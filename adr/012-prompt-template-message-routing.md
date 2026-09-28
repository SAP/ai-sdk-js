# Prompt Template Message Routing

## Status

proposed

## Context

The `OrchestrationClient` class wraps the SAP AI Core Orchestration API.
That API has no top-level `messages` field — the only ways to supply chat content are:

- The `config.modules.prompt_templating.prompt` field — the prompt template that defines the scenario, persona, or instructions.
  It is _either_ a local template (the `Template` type, an inline message array with optional `{{?placeholder}}` slots filled from the `placeholder_values` map) _or_ a single template reference (the `TemplateRef` type, one registry template by ID or by scenario/name/version) — the two cannot be mixed, and multiple template references are not allowed.
- The `messages_history` field — prior conversation turns, prepended to the request as context and never merged into the template

The SDK introduces a third concept, the `request.messages` field, that has no direct equivalent in the API.
It represents the current user turn — the dynamic per-call content layered on top of the fixed template configuration.

### The `request.messages` convenience field

The `ChatCompletionRequest.messages` field was introduced so callers do not have to choose between the `prompt.template` array and the `messages_history` field depending on whether they configured a template.
In API terms it is the per-request portion of the `prompt.template` array — the API has no static/dynamic split.
The SDK routes the `messages` field automatically:

- with a local template (the `prompt.template` array) — appended to the `prompt.template` array in the outgoing request
- in every other case (a `TemplateRef` reference, config reference, or no template) — appended to the `messages_history` field

The template lives in the constructor because the constructor maps 1:1 to an orchestration **configuration artifact** — the same `module_configurations` block that can be stored and referenced on the server.
All module-level settings (model, parameters, filters, masking, grounding, translation, prompt template) are fixed for the lifetime of a client instance, with per-call arguments (`messages`, `messagesHistory`, `placeholderValues`) layered on top.
The config-artifact mapping is an SDK-layer abstraction — the Orchestration API is stateless and the `prompt.template` field is per-request content with no such distinction.
This mirrors the pattern in `adr/003-history-maintenance.md`: one client instance = one conversation = one configuration context.

This ADR focuses on the local-template path, where the routing has non-obvious consequences.
The `TemplateRef` path is documented below.

### The template echo problem

When using a local template, the Orchestration service echoes the fully-rendered template (static messages + the appended `request.messages` content, after placeholder substitution) back in the response under the `intermediate_results.templating` field.
The `OrchestrationResponse.getAllMessages()` method returns these echoed messages concatenated with the assistant reply.

This creates two manifestations of the same problem for multi-turn conversations:

1. **Unexpected response content**: The response appears to contain the full prompt template, not just the assistant reply.
2. **Template duplication on subsequent turns**: If the `getAllMessages()` return value is naively fed back as the `request.messages` field on the next turn, the template is merged into the `prompt.template` array again — the model receives the static template twice.

### Multi-Turn Conversations

#### Pattern A — Single client, `getAllMessages()` as `messagesHistory`

Use one client throughout the conversation.
On each subsequent turn, pass the previous response's `getAllMessages()` output as the `messagesHistory` parameter (not the `messages` field).

```ts
const client = new OrchestrationClient({
  promptTemplating: {
    model: { name: 'anthropic--claude-4.5-haiku' },
    prompt: {
      template: [{ role: 'system', content: 'You are a helpful assistant.' }]
    }
  }
});

// Turn 1
const resp1 = await client.chatCompletion({
  messages: [{ role: 'user', content: 'What is the capital of France?' }]
});

// Turn 2
const resp2 = await client.chatCompletion({
  messagesHistory: resp1.getAllMessages(), // echoed template + assistant reply
  messages: [{ role: 'user', content: 'What is the typical food there?' }]
});
```

**Caveat**: From turn 2 onward, the `messagesHistory` parameter contains the echoed template messages.
On each subsequent turn, the `request.messages` field is again appended to the `prompt.template` array, so the model sees the static template messages twice — once in the `messages_history` field and once in the template array.
In practice the model handles this gracefully, but it is redundant and may affect token usage.
Do not feed the `getAllMessages()` return value back as the `request.messages` field — this re-merges the template on every turn:

```ts
// WRONG — causes template to accumulate on each turn
const resp2 = await client.chatCompletion({
  messages: resp1.getAllMessages() // ← do not do this
});
```

#### Pattern B — Two clients (recommended, when template is present)

Use one client that carries the template configuration for the initial turn, and a second client (with no template) to manage the ongoing conversation.
The second client routes all messages through the `messages_history` field.

```ts
const templateClient = new OrchestrationClient({
  promptTemplating: {
    model: { name: 'anthropic--claude-4.5-haiku' },
    prompt: {
      template: [{ role: 'system', content: 'You are a helpful assistant.' }]
    }
  }
});

const conversationClient = new OrchestrationClient({
  promptTemplating: {
    model: { name: 'anthropic--claude-4.5-haiku' }
    // no prompt template — messages go to messages_history
  }
});

// Turn 1 — use the template client
const resp1 = await templateClient.chatCompletion({
  messages: [{ role: 'user', content: 'What is the capital of France?' }]
});

// Turn 2+ — use the conversation client; no template duplication
const resp2 = await conversationClient.chatCompletion({
  messagesHistory: resp1.getAllMessages(),
  messages: [{ role: 'user', content: 'What is the typical food there?' }]
});
```

**Tradeoff**: Requires managing two client instances, but avoids duplication — the second client has no local template, so its `messages` entries route to the `messages_history` field only.
This pattern is oral knowledge today — it is not reflected in any sample code or documentation.

### TemplateRef routing

When the `promptTemplating.prompt` field is a remote template reference (a `TemplateRef` object), the SDK cannot read or modify the remote template — it has no local array to append to.
The `request.messages` field is therefore routed to the `messages_history` field automatically.

This routing is mechanically forced — unlike the local-template path, there is no design decision being made.
However, **no log is emitted** when this rerouting occurs.
The config-reference path (the `OrchestrationConfigRefById` type / `OrchestrationConfigRefByName` type) emits a `logger.debug` message saying messages will be sent as the `messages_history` field.
The inline `TemplateRef` path does not.
A developer who passes a `messages` value to the `chatCompletion()` method alongside a `TemplateRef` config receives no signal that the routing differs from the local-template case.

#### Module behavior on `messages_history`

All three input modules process the full combined list (history + current template) by default.
Each has different opt-out or scoping behavior:

**Translation**: Translates history and template together by default.
Set the `translate_messages_history` option to `false` per-request to avoid re-translating already-translated history on every turn.

**Content filtering**: Filters the full combined list by default.
Use the `target_selector` option (the `after_last_role` value or the `last_messages` value) to scope filtering to only new turns — recommended for long conversations to avoid redundant filtering of history.

**Data masking**: Re-masks the full combined list on every turn.
There is no opt-out or scoping mechanism — this is by design.

## Open Questions

1. **Why is the `PromptTemplatingModuleConfig.prompt` field a `oneOf` discriminator (XOR)?**: The API spec defines the `prompt` field as a `oneOf: [Template, TemplateRef]` schema, meaning a request must carry either a local template array or a remote reference — never both.
   It is unclear whether this is an intentional design constraint (e.g. the service cannot meaningfully merge inline messages with a remote template), a historical artefact, or simply an oversight.
   The answer directly affects whether Option A is feasible without a service-side change.

2. How do Java and Python handle this?

## Options

Both options share the same core change to the `chatCompletion()` method:

- The `messages` field is removed from the `ChatCompletionRequest` type.
- The `chatCompletion()` method gains a `prompt?: Xor<PromptTemplate, TemplateRef>` field.
- The `messagesHistory` parameter is unchanged.
- Passing a `prompt: TemplateRef` value alongside anything that would require merging (inline messages in the template) throws an error — the SDK cannot modify a remote template.

The options differ in whether the `prompt` field is also allowed in the constructor.

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

**Tradeoff**: Aligns with the API's per-request semantics, but the constructor no longer maps 1:1 to a stored config artifact — callers must supply the template on every call or manage it themselves.

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

**Tradeoff**: Preserves the SDK's config-artifact abstraction, but the two sites where the `prompt` field can live add complexity — callers must understand which site to use and when.

No decision has been made.
A separate ADR is warranted before implementing either option, as both remove the `messages` field from the public API contract of the `chatCompletion()` method.
