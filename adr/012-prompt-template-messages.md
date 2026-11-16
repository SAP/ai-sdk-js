<!-- vale off -->

# Prompt Template Message Routing

## Status

decided

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
- to the `messages_history` field — with a `TemplateRef` reference or a complete config reference, because the template is defined server-side and cannot be extended inline.

Config references are single-turn only.
The API cannot express a config reference plus a current user turn in a single call without reconstructing the stored config client-side or misusing config overrides, which defeats the purpose of referencing it.
Multi-turn conversations must use a local template or a `TemplateRef`.

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

The client exposes a **fluent builder**.
An entry method on the client selects the configuration source and returns a builder.
The entry method determines, **at the type level**, whether a prompt may still be supplied.
A terminal `create()` sends the request, and streaming is requested through its options rather than a separate method.

```ts
client.config(configWithoutPrompt).create({ prompt: [message] });
client.configRef(configRef).create();
client.configRef([configRef]).create();
client.configList([configWithPrompt]).create();
client.raw().config(configInGeneratedFormat).create();
client.raw().configJson(jsonString).create();
```

The design rests on one idea: the prompt travels with whichever source owns it, and the builder type reflects that.

- `config(config)` takes a configuration whose type **omits** the prompt, so the builder it returns accepts a `prompt` on `create({ prompt })`.
  The caller supplies the prompt per call, and it is the only path that does.
- `configRef(ref)` and `configRef([ref])` take one or more references to a server-side template.
  The template lives in the registry, so the returned builder's `create()` offers **no** `prompt` — the prompt is already defined remotely.
- `configList([config])` takes a fallback list where **each** configuration carries its own prompt.
  A fallback list is tried in order until one configuration succeeds, and a fallback from a premium model to a cheaper one often needs a different prompt per entry.
  Carrying the prompt inside each configuration is what lets every entry bring its own.
  The returned builder's `create()` offers no `prompt`, because the prompts already live inside the configurations.
- `raw().config(config)` and `raw().configJson(json)` are the low-level escape hatch.
  They accept the generated request format — a typed `OrchestrationConfig` object or its JSON string — which already specifies everything, prompts and fallback list included.
  Their `create()` takes no `prompt`.

Because the entry method fixes whether `create()` accepts a `prompt`, no runtime throw is needed to reject a prompt where none is allowed — a misuse does not compile.
`create()` takes an optional `{ messagesHistory?, placeholderValues?, stream? }` for the per-call inputs that are not the prompt, where `stream` selects a streamed response.
The exact option shapes, and the builder type names, are left to a proof of concept.

**Impact on existing consumers**: The LangChain integration's `OrchestrationClient` (`packages/langchain/src/orchestration/client.ts`) depends on the `messages` field as its only runtime channel.
It maps the combined LangChain message list and passes it as `chatCompletion({ messages, ... })`, keeping the template in the constructor config.
Migrating it means building its request through `config(...).create({ prompt })` instead.

### Consequences

Per-fallback prompts become expressible: `configList` carries a prompt inside each configuration.
The question of whether a prompt is allowed is answered by the type system rather than a runtime check, so invalid combinations fail to compile instead of throwing.
The generated `OrchestrationConfig` type must be exported publicly to back `raw().config()`, which today is reachable only through the internal entry point.
The trade-off is a larger API surface: five entry methods and their builders replace a single `chatCompletion()` call, and callers must learn which entry point matches their configuration source.
Alternative C collapses those five entry methods into one overloaded `config()`.

## Alternatives

### Option A — `prompt` at request level only

The `prompt` field lives at request level only, on a single `chatCompletion()` method.

- The `messages` field is removed from the `ChatCompletionRequest` type.
- The `chatCompletion()` method gains a `prompt?: Xor<PromptTemplate, TemplateRef>` field.
- The `messagesHistory` parameter is unchanged.
- The `prompt` field is removed from the constructor.
- Passing a `prompt: TemplateRef` value alongside anything that would require merging inline messages into the template throws, because the SDK cannot modify a remote template.

```ts
const client = new OrchestrationClient({
  promptTemplating: { model: { name: 'anthropic--claude-4.5-haiku' } }
});

const resp = await client.chatCompletion({
  prompt: {
    template: [
      // Turn 0
      { role: 'system', content: 'You are a helpful assistant.' },
      // Turn 1+
      { role: 'user', content: 'What is the capital of France?' }
    ]
  }
});
```

**Remote template (TemplateRef)**:

```ts
const client = new OrchestrationClient({
  promptTemplating: { model: { name: 'anthropic--claude-4.5-haiku' } }
});

const resp1 = await client.chatCompletion({
  // Turn 0
  prompt: { template_ref: { id: 'my-system-prompt' } }
});
const res2 = await client.chatCompletion({
  messagesHistory: resp1.getAllMessages(),
  prompt: {
    template: [
      // Turn 1+
      { role: 'user', content: 'What is the capital of France?' }
    ]
  }
});
```

**The per-fallback prompt gap**: A single orchestration request can carry a **fallback list** of module configurations.
The service tries each configuration in order and uses the first that succeeds.
In the SDK this is `OrchestrationModuleConfigList`, a non-empty list of `OrchestrationModuleConfig`, and each entry carries its own model under `promptTemplating.model` and its own optional `promptTemplating.prompt`.
A fallback from a premium model to a cheaper one often needs a different prompt per entry, because the two models respond best to differently worded instructions.
A single request-level `prompt` cannot express this: it supplies one prompt shared across the whole call, so every configuration in the fallback list receives the same prompt.
Per-entry prompts are only expressible if the prompt travels **with each configuration**, not alongside the call.
This gap, identified after this approach was first decided, is what reopened the design.

**Tradeoff**: Aligns with the API's per-request semantics and keeps a single call method.
But a single request-level `prompt` cannot give each configuration in a fallback list its own prompt — the per-fallback prompt gap.
Per-entry prompts are only expressible if the prompt travels with each configuration, not alongside the call.
It also drops the SDK abstraction where a client instance maps 1:1 to a stored configuration artifact, and prompt-not-allowed cases are caught only at runtime by a throw.

### Option B — `prompt` in both constructor and request

The `prompt` field is retained in the constructor as a convenience for the config-artifact use case, and the `chatCompletion()` method also gains a `prompt?` parameter.
Setting both at once throws when one of them is a remote template, because the SDK cannot merge into a remote template.
The constructor has three mutually exclusive shapes: a config ref, a module config with an optional `prompt`, or a module config with no `prompt`.

```ts
const client = new OrchestrationClient({
  promptTemplating: {
    model: { name: 'anthropic--claude-4.5-haiku' },
    prompt: {
      // Turn 0
      template: [{ role: 'system', content: 'You are a helpful assistant.' }]
    }
  }
});

const resp = await client.chatCompletion({
  prompt: {
    template: [{ role: 'user', content: 'What is the capital of France?' }]
  }
});
```

**Tradeoff**: Preserves the SDK's config-artifact abstraction.
But three constructor shapes exist, and callers must understand which site to use for `prompt` and when.
The `TemplateRef` and config ref shapes look identical at the `chatCompletion()` call site — the distinction lives in the constructor.
It also shares the per-fallback prompt gap, since the per-call `prompt` is still a single shared field.

### Option C — Overloaded single `config()`

The fluent builder keeps its type-level prompt gating, but a single overloaded `config()` replaces the five entry methods.
One `config()` absorbs every source shape — a configuration without a prompt, a configuration with a prompt, a `TemplateRef`, a `TemplateRef[]`, and a fallback list.
The overload resolves which builder is returned, and that builder's type decides whether `create()` accepts a `prompt`.

```ts
client.config(configWithoutPrompt).create({ prompt: [message] });
client.config(configRef).create();
client.config([configRef]).create();
client.config(configList).create();
```

**Tradeoff**: One entry point to learn instead of five, and the call site reads the same regardless of source.
But the source shapes are no longer visible in the method name, so which overload applies — and therefore whether `create()` accepts a `prompt` — is legible only through the types, not the call itself.

### Option D — OpenAI call-site framing over Option C

Option D keeps Option C's accessor and type-level prompt gate unchanged.
It adds a framing: the terminal call reads like OpenAI, and a documented root object wraps the standalone client.

Orchestration configuration has no OpenAI analogue, so it cannot sit inside `create()` the way OpenAI's `messages` do.
Matching OpenAI therefore means matching the **call site**: the verb is `create`, and streaming is `create({ stream: true })` with an overloaded return.
Everything above `create()` is SAP-specific.

The request splits into four axes, each on its own hop: connection, deployment, static pipeline config (`config()`, carrying the prompt gate), and dynamic input (`create()`).

```ts
new SapAi(connection)
  .orchestration(deploymentConfig)
  .config(staticConfig)
  .create({ prompt: [message], stream: true });
```

`orchestration(deploymentConfig)` returns the same `Orchestration` handle a caller can construct directly, so the standalone form drops the root and merges connection and deployment into the constructor:

```ts
new Orchestration(connectionAndDeployment)
  .config(staticConfig)
  .create({ prompt: [message] });

// identity
sapAi.orchestration(deploymentConfig)  ≡  new Orchestration(connectionAndDeployment)
```

Deployment lives on the per-service hop rather than the root, because the root fans out to several services that each resolve their own deployment — which is what makes the full shape four single-purpose hops.
The static-versus-dynamic split is the feature: `config()` configures the pipeline once, `create()` sends dynamic input per call.

**Scope**: `SapAi` is proposal-only, and whether to build it is a separate decision.
Option D is designed so the standalone `Orchestration` ships first and a future `SapAi` wraps it without changing the handle, builder, or terminal.

#### Per-package install model

A desirable property for `SapAi` is that each service accessor exists — at the type level — only when its package is imported.
This is viable through TypeScript module augmentation, but with one inversion: core owns the `SapAi` class with an empty, open interface, and each service package augments it, because augmentation can only patch an existing declaration, never add a new top-level `SapAi`.

```ts
// @sap-ai-sdk/core
export class SapAi {
  /* connection */
}
export interface SapAi {} // open for augmentation

// @sap-ai-sdk/orchestration — patches SapAi when imported
declare module '@sap-ai-sdk/core' {
  interface SapAi {
    orchestration(deployment: DeploymentConfig): Orchestration;
  }
}
SapAi.prototype.orchestration = function (deployment) {
  /* ... */
};
```

A proof of concept would need to confirm the key risk: the unlock trigger is import, not install, and the types-only augmentation and the runtime `prototype` assignment must be wired together or a typed call fails at runtime.

**Tradeoff**: The terminal call site matches OpenAI, and the four-axis model carves connection, deployment, pipeline, and dynamic input so no hop does double duty, resolving the objection that connection lived on a thing named `Orchestration`.
The cost is a four-hop chain at the root altitude and a documented root that does not yet exist, so the shippable and documented surfaces differ until `SapAi` is built.

## How Java and Python handle this

This section is for comparison only.
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
