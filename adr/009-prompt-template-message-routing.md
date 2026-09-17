# Prompt Template Message Routing

## Status

Accepted

## Context

The `OrchestrationClient` wraps the SAP AI Core Orchestration API.
That API has no top-level `messages` field — the only ways to supply chat content are:

- `config.modules.prompt_templating.prompt.template` — the static message array that defines the scenario, persona, or instructions (with optional `{{?placeholder}}` slots filled from `placeholder_values`)
- `messages_history` — prior conversation turns, prepended to the request as context and never merged into the template

The SDK introduces a third concept, `request.messages`, that has no direct equivalent in the API.
This ADR documents why it exists, how it is routed, the consequences of that routing, and the recommended usage patterns today.

### The `request.messages` convenience field

`ChatCompletionRequest.messages` was introduced so callers do not have to decide between two very different API fields (`prompt.template` vs `messages_history`) depending on whether they configured a template.
The SDK routes it automatically:

| Config path | Where `request.messages` ends up |
|---|---|
| Local template (`prompt.template`) | Appended to `prompt.template` in the outgoing request |
| Remote template reference (`TemplateRef`) | Appended to `messages_history` |
| Config reference (by ID or name) | Appended to `messages_history` |
| No template | Appended to `messages_history` |

This ADR focuses on the **local template** path, where the routing has non-obvious consequences.
The `TemplateRef` path is tracked as an open question below.

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

## Decision

### Two supported patterns for multi-turn conversation

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

#### Pattern B — Two clients (currently recommended)

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
  messages: resp1.getAllMessages(), // ← do not do this
});
```

## Open Questions

1. **Semantic meaning of `request.messages`**: It is unclear whether `request.messages` was intended to represent (a) the current user turn, (b) additional template messages, or (c) a convenience alias for `messages_history`.
   The routing behaviour differs by config path, which suggests it may have been designed as "whatever makes sense given the config" rather than with a single semantics.
   This should be clarified and documented.

2. **Ideal future developer experience**: The current patterns require callers to understand internal routing details.
   Candidate improvements include: (a) the client automatically strips echoed template messages from `getAllMessages()` so it returns only non-template turns; (b) `request.messages` is always routed to `messages_history` and never merged into the template; (c) a stateful client that accumulates history internally.
   No decision has been made.

3. **Why is the prompt template in the constructor?**: Prompt template is one property of `promptTemplating` alongside model parameters, filters, and other module configs — all of which live in the constructor because they map to a stored config artifact.
   Whether it would be ergonomic to also allow a per-call template override (without breaking the config-artifact mental model) is an open question.

4. **Review `TemplateRef` routing**: When using a remote template reference, `request.messages` is routed to `messages_history` rather than merged into the template.
   The consequences of this for multi-turn conversations, and whether it is consistent with the local-template behaviour, should be reviewed separately.
