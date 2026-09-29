# Prompt Template Message Routing

## Status

proposed

## Context

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
The SDK routes it automatically:

- with a local template or no template — appended to the `prompt.template` array in the outgoing request.
- with a `TemplateRef` reference or a complete config reference — appended to the `messages_history` field.

This automatic routing has non-obvious consequences.
With a local template, the Orchestration service echoes the fully-rendered template back in the response under `intermediate_results.templating`, and `OrchestrationResponse.getAllMessages()` returns those echoed messages concatenated with the assistant reply.
In multi-turn conversations this echoed content is easy to feed back into the next request in a way that re-merges the template, so the model receives the static template more than once.
Working around this today requires client-management patterns that are not reflected in any sample or documentation (see [multi-turn patterns](./012-prompt-template-message-routing-patterns.md)).

Two further behaviors constrain any redesign.
The `TemplateRef` path reroutes `messages` to the `messages_history` field without a debug signal — unlike the config-reference path, it emits no `logger.debug` entry that the routing differs.
And by default each module treats the `messages_history` field the same as the template (except prompt templating):

- **Prompt templating** never renders history, so `{{?placeholder}}` text there is passed through literally.
- **Translation** can be disabled per request with `translate_messages_history`.
- **Content filtering** can be scoped per request with `target_selector`.
- **Data masking** always processes everything, with no opt-out.

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
Under Option A, callers must supply the template on every call or manage it themselves.

### Option B — `prompt` in both constructor and request

The `prompt` field is retained in the constructor as a convenience for the config-artifact use case (typically a system message or a remote template reference).
The `chatCompletion()` method also gains a `prompt?` parameter.
The following combinations throw an error:

- The constructor `prompt` field and request `prompt` field are both set.
- A constructor-level `prompt: TemplateRef` value is set and the request carries content that would need merging.

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

## Open Questions

1. **Why is the `PromptTemplatingModuleConfig.prompt` field a `oneOf` discriminator (XOR)?**: The API spec defines the `prompt` field as a `oneOf: [Template, TemplateRef]` schema, meaning a request must carry either a local template array or a remote reference — never both.
   It is unclear whether this is an intentional design constraint (e.g. the service cannot meaningfully merge inline messages with a remote template), a historical artefact, or an oversight.
   The answer directly affects whether Option A is feasible without a service-side change.

2. How do Java and Python handle this?

