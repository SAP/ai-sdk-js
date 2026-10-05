<!-- vale off -->
# Prompt Template Message Routing

## Status

proposed

## Context

The `OrchestrationClient`'s routing of chat content through two distinct API fields has non-obvious consequences for multi-turn conversations and tool calling.

### Routing mechanics

The `OrchestrationClient` class wraps the SAP AI Core Orchestration API.
That API has no top-level `messages` field.
The only ways to supply chat content are:

- The `config.modules.prompt_templating.prompt` field — the prompt template that defines the scenario, persona, or instructions.
  It is _either_ a local template (the `Template` type, an inline message array with optional `{{?placeholder}}` slots filled from the `placeholder_values` map) _or_ a single template reference (the `TemplateRef` type, one registry template by ID or by scenario/name/version).
  The two cannot be mixed, and multiple references are not allowed.
- The `messages_history` field — prior conversation turns, prepended to the request as context and never merged into the template.

The SDK adds a third concept with no direct API equivalent: the `ChatCompletionRequest.messages` field.
It represents the current user turn — the dynamic per-call content layered on top of the fixed template configuration.
Callers use it so they do not have to choose between the `prompt.template` array and the `messages_history` field depending on whether they configured a template.
The SDK routes it automatically in the outgoing request:

- to the `prompt.template` array — with a local template or no template.
- to the `messages_history` field — with a `TemplateRef` reference or a complete config reference.

### Routing consequences

This automatic routing has non-obvious consequences.
With a local template, the Orchestration service echoes the fully-rendered template back in the response under `intermediate_results.templating`, and `OrchestrationResponse.getAllMessages()` returns those echoed messages concatenated with the assistant reply.
In multi-turn conversations this echoed content is easy to feed back into the next request in a way that re-merges the template, so the model receives the static template more than once.
Working around this today requires client-management patterns that are not reflected in any sample or documentation (see [multi-turn patterns](./012-prompt-template-message-routing-patterns.md)).

Two further behaviors constrain any redesign.
The `TemplateRef` path reroutes `messages` to the `messages_history` field without a debug signal — unlike the config-reference path, it emits no `logger.debug` entry that the routing differs.
And by default each orchestration module treats the `messages_history` field the same as the template (except prompt templating):

- **Prompt templating** never renders history, so `{{?placeholder}}` text there is passed through literally.
- **Translation** can be disabled per request with `translate_messages_history`.
- **Content filtering** can be scoped per request with `target_selector`.
- **Data masking** always processes everything, with no opt-out.

### Tool calling

Tool calling introduces a third constraint.
The Orchestration Service expects Tool Results to be supplied through the `prompt.template` array.
The templating engine processes `role: tool` message content as template text, which causes a server-side error when a Tool Result's output contains `{{?placeholder}}`-style patterns.
This is tracked in [llm-orchestration#3612](https://github.tools.sap/AI/llm-orchestration/issues/3612).
The fix is acknowledged but not yet committed, and there is no workaround.

## Decision

tbd

## Options

Both options share the same core change to the `chatCompletion()` method:

- The `messages` field is removed from the `ChatCompletionRequest` type.
- The `chatCompletion()` method gains a `prompt?: Xor<PromptTemplate, TemplateRef>` field.
- The `messagesHistory` parameter is unchanged.
- Passing a `prompt: TemplateRef` value alongside anything that would require merging inline messages into the template throws an error, because the SDK cannot modify a remote template.

The options differ in whether the `prompt` field is also allowed in the constructor.

**Impact on existing consumers**: The LangChain integration's `OrchestrationClient` (`packages/langchain/src/orchestration/client.ts`) depends on the `messages` field as its only runtime channel.
It maps the combined LangChain message list and passes it as `chatCompletion({ messages, ... })`, keeping the template in the constructor config.
It never sets `messagesHistory` and never passes a per-request `prompt`.
Removing the `messages` field therefore breaks this client under both options.
Both options require migrating it to route its combined list through `messagesHistory` and/or the per-request `prompt`.

### Option A — `prompt` at request level only

The `prompt` field is removed from the constructor.
The constructor accepts only model parameters and pipeline module config (filtering, masking, grounding, translation).
Every call to the `chatCompletion()` method that needs a template or ref supplies it inline via the `prompt` field.

```ts
const client = new OrchestrationClient({
  promptTemplating: {
    model: { name: 'anthropic--claude-4.5-haiku' }
  }
});

const resp = await client.chatCompletion({
  prompt: {
    template: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'What is the capital of France?' }
    ]
  }
});
```

**Tradeoff**: Aligns with the API's per-request semantics.
But it drops the SDK abstraction where a client instance maps 1:1 to a stored orchestration **configuration artifact** — the same `module_configurations` block that can be stored and referenced on the server.
All module-level settings are fixed for the client's lifetime, and per-call arguments are layered on top (mirroring `adr/003-history-maintenance.md`: one client = one conversation = one configuration context).
Under Option A, callers must supply the template on the first call or manage it themselves.

### Option B — `prompt` in both constructor and request

The `prompt` field is retained in the constructor as a convenience for the config-artifact use case (typically a system message or a remote template reference).
The `chatCompletion()` method also gains a `prompt?` parameter.
Setting the constructor `prompt` field and request `prompt` field both at once throws an error when one of them is a remote template, because the SDK cannot merge into a remote template.
The constructor prompt will be prepended to the `messages_history` field.

```ts
const client = new OrchestrationClient({
  promptTemplating: {
    model: { name: 'anthropic--claude-4.5-haiku' },
    prompt: {
      template: [{ role: 'system', content: 'You are a helpful assistant.' }]
    }
  }
});

// Turn 1 — constructor template is merged with the per-call prompt on the first request
const resp1 = await client.chatCompletion({
  prompt: {
    template: [{ role: 'user', content: 'What is the capital of France?' }]
  }
});

// Turn 2+ — use messagesHistory; no prompt needed
const resp2 = await client.chatCompletion({
  messagesHistory: resp1.getAllMessages(),
  prompt: {
    template: [{ role: 'user', content: 'What is the typical food there?' }]
  }
});
```

**Tradeoff**: Preserves the SDK's config-artifact abstraction.
But the two sites where the `prompt` field can live add complexity — callers must understand which site to use and when.

## How Java and Python handle this

Neither sibling SDK reproduces the TS design of a `messages` current turn plus a constructor template plus hidden rerouting.
They split on a more fundamental question: whether a current-turn abstraction should exist at all.

### Java

Java keeps a current-turn abstraction but drops the constructor template.
The current turn lives as `OrchestrationPrompt.messages`, a per-call list distinct from `OrchestrationPrompt.messagesHistory`.
The whole module config, template included, is passed to each `chatCompletion()` call.
The client constructor takes only a destination.

Routing is explicit per template type.
With an inline template the current-turn `messages` are appended to the template array.
With a `TemplateRef` the current-turn `messages` are dropped, so the caller must place runtime messages in `messagesHistory` instead.
History always maps to `messages_history` and never to the template.

Multi-turn uses `OrchestrationChatResponse.getAllMessages()`, fed into the next prompt's `messageHistory(...)`.
Tool definitions travel in the template's `tools`, while tool-call and tool-result messages travel through history.

### Python

Python has no current-turn abstraction.
The current turn is an element of the prompt template itself, for example `Template(template=[UserMessage(...)])`.
The template config lives both as a constructor default and as a per-`run` override, resolved by `config or self.config`.

There is no client-side routing.
The `config` maps 1:1 to the template and the `history` parameter maps 1:1 to `messages_history`, and the server merges them.
Choosing a `TemplateRef` or a `config_ref` resolves the template server-side, so the caller supplies only `placeholder_values` and optional history.

There is no `getAllMessages()` helper.
Multi-turn is manual: the caller reads the rendered messages from `response.intermediate_results.templating`, appends the assistant reply, and passes the result as `history` on the next call.
Tool definitions travel in the template's `tools`, while tool-call and tool-result messages travel through history.

### Bearing on the options

Python is the closest precedent for Option B: the template can live in both the constructor and the request, and the current turn is expressed as template content rather than a separate `messages` field.
Java is the closest precedent for Option A: no constructor template, with per-request config only.
Neither SDK routes a current turn silently between the template and `messages_history`, which is the specific behavior this ADR removes.
