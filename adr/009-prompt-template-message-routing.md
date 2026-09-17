# Prompt Template Message Routing

## Status

Accepted

## Context

The `OrchestrationClient` wraps the SAP AI Core Orchestration API.
That API has no top-level `messages` field — the only ways to supply chat content are:

- `config.modules.prompt_templating.prompt.template` — the static message array that defines the scenario, persona, or instructions (with optional `{{?placeholder}}` slots filled from `placeholder_values`)
- `messages_history` — prior conversation turns, prepended to the request as context and never merged into the template

The SDK introduces a third concept, `request.messages`, that has no direct equivalent in the API.
It represents the current user turn — the dynamic per-call content layered on top of the fixed template configuration.
This ADR documents why it exists, how it is routed, the consequences of that routing, and the recommended usage patterns today.

### The `request.messages` convenience field

`ChatCompletionRequest.messages` was introduced so callers do not have to decide between two different API fields (`prompt.template` vs `messages_history`) depending on whether they configured a template.
The SDK routes it automatically:

| Config path                               | Where `request.messages` ends up                      |
| ----------------------------------------- | ----------------------------------------------------- |
| Local template (`prompt.template`)        | Appended to `prompt.template` in the outgoing request |
| Remote template reference (`TemplateRef`) | Appended to `messages_history`                        |
| Config reference (by ID or name)          | Appended to `messages_history`                        |
| No template                               | Appended to `messages_history`                        |

This ADR focuses on the **local template** path, where the routing has non-obvious consequences.
The `TemplateRef` path is documented in the section below.

### Why the merge happens for local templates

The Orchestration API requires that when a local template is present, all messages are either part of the template array or the history.
There is no separate "current turn" slot at the API level.
Appending `request.messages` to `prompt.template` is the SDK's way of delivering a per-request user turn when a local template is configured.

### Constructor as config artifact

The prompt template lives in the constructor, not in `chatCompletion()`, because the constructor maps 1:1 to an orchestration **configuration artifact** — the same `module_configurations` block that can be stored and referenced on the server.
All module-level settings (model, parameters, filters, masking, grounding, translation, and prompt template) are part of that artifact and are fixed for the lifetime of a client instance.
Per-call arguments (`messages`, `messagesHistory`, `placeholderValues`) are the dynamic content layered on top of that fixed artifact.

This mirrors the intent of `adr/003-history-maintenance.md`: one client instance = one conversation = one configuration context.

### The template echo problem

When using a local template, the Orchestration service echoes the fully-rendered template (static messages + appended `request.messages`, after placeholder substitution) back in the response under `intermediate_results.templating`.
`OrchestrationResponse.getAllMessages()` returns these echoed messages concatenated with the assistant reply:

```ts
getAllMessages(): ChatMessages {
  const messages = this._data.intermediate_results.templating ?? [];
  const content = this.findChoiceByIndex(choiceIndex)?.message;
  return content ? [...messages, content] : messages;
}
```

This creates two manifestations of the same problem for multi-turn conversations:

1. **Unexpected response content**: The response appears to contain the full prompt template, not just the assistant reply.
2. **Template duplication on subsequent turns**: If `getAllMessages()` is naïvely fed back as `request.messages` on the next turn, the template is merged into `prompt.template` again — the model receives the static template twice.

### Multi-Turn Conversations

#### Pattern A — Single client, `getAllMessages()` as `messagesHistory`

Use one client throughout the conversation.
On each subsequent turn, pass the previous response's `getAllMessages()` output as `messagesHistory` (not `messages`).

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

**Caveat**: From turn 2 onward, `messagesHistory` contains the echoed template messages.
On each subsequent turn, `request.messages` is again appended to `prompt.template`, so the model sees the static template messages twice — once in `messages_history` and once in the template array.
In practice the model handles this gracefully, but it is redundant and may affect token usage.

#### Pattern B — Two clients (recommended, when template is present)

Use one client that carries the template configuration for the initial turn, and a second client (with no template) to manage the ongoing conversation.
The second client routes all messages through `messages_history`.

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

**Why this avoids the duplication**: The second client has no local template, so `request.messages` is routed to `messages_history` and `prompt.template` is never touched.
The model sees the history (including the echoed template from turn 1) exactly once.

**Tradeoff**: Requires managing two client instances and coordinating which one to use for which turn.
This pattern is oral knowledge today — it is not reflected in any sample code or documentation.

### What not to do

Do not feed `getAllMessages()` back as `request.messages` when using a local template.
This will re-merge the template messages into `prompt.template` on every turn.

```ts
// WRONG — causes template to accumulate on each turn
const resp2 = await client.chatCompletion({
  messages: resp1.getAllMessages() // ← do not do this
});
```

### TemplateRef routing

When `promptTemplating.prompt` is a remote template reference (`TemplateRef`), the SDK cannot read or modify the remote template — it has no local array to append to.
`request.messages` is therefore routed to `messages_history` automatically.

This routing is mechanically forced — unlike the local-template path, there is no design decision being made.
However, **no log is emitted** when this rerouting occurs.
The config-reference path (`OrchestrationConfigRefById` / `OrchestrationConfigRefByName`) emits a `logger.debug` saying messages will be sent as `messages_history`; the inline `TemplateRef` path does not.
A developer who passes `messages` to `chatCompletion()` alongside a `TemplateRef` config receives no signal that the routing differs from the local-template case.

#### Module behavior on `messages_history`

All three input modules process the full combined list (history + current template) by default.
Each has different opt-out or scoping behavior:

**Translation**: Translates history and template together by default.
Use `translate_messages_history: false` per-request to avoid re-translating already-translated history on every turn.

**Content filtering**: Filters the full combined list by default.
Use the `target_selector` option (`after_last_role` or `last_messages`) to scope filtering to only new turns — recommended for long conversations to avoid redundant filtering of history.

**Data masking**: Re-masks the full combined list on every turn.
There is no opt-out or scoping mechanism — this is by design.

## Open Questions

1. **Why is `PromptTemplatingModuleConfig.prompt` a `oneOf` (XOR)?**: The API spec defines `prompt` as `oneOf: [Template, TemplateRef]`, meaning a request must carry either a local template array or a remote reference — never both.
   It is unclear whether this is an intentional design constraint (e.g. the service cannot meaningfully merge inline messages with a remote template), a historical artefact, or simply an oversight.
   The answer directly affects whether Option A is feasible without a service-side change.

2. How do Java and Python handle this?

## Options

Both options share the same core change to `chatCompletion()`:

- `messages` is removed from `ChatCompletionRequest`.
- `chatCompletion()` gains a `prompt?: Xor<PromptTemplate, TemplateRef>` field.
- `messagesHistory` is unchanged.
- Passing `prompt: TemplateRef` alongside anything that would require merging (inline messages in the template) throws an error — the SDK cannot modify a remote template.

The options differ in whether `prompt` is also allowed in the constructor.

### Option A — `prompt` at request level only

`prompt` is removed from the constructor.
The constructor accepts only model parameters and pipeline module config (filtering, masking, grounding, translation).
Every call to `chatCompletion()` that needs a template or ref supplies it inline via `prompt`.

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

**Tradeoff**: The constructor no longer maps 1:1 to a stored config artifact — callers who want to reuse a template across calls must pass it on every call or manage it themselves.

### Option B — `prompt` in both constructor and request

`prompt` is retained in the constructor as a convenience for the config-artifact use case (typically a system message or a remote template reference).
`chatCompletion()` also gains `prompt?`.
The following combinations throw an error:

- Constructor `prompt` and request `prompt` are both set.
- Constructor `prompt: TemplateRef` is set and the request carries content that would need merging.

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

**Tradeoff**: The constructor-as-config-artifact model is preserved, but the two sites where `prompt` can live add complexity — callers must understand which site to use and when.

No decision has been made.
A separate ADR is warranted before implementing either option, as both remove `messages` from the public API contract of `chatCompletion()`.
