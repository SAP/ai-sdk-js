# Prompt Template Message Routing — Multi-Turn Patterns

How to run a multi-turn conversation with a local template today, given the routing behavior described in [ADR 012](./012-prompt-template-message-routing.md).

These patterns are workarounds for the current API.
They may become obsolete once ADR 012 is decided.

## Pattern A — Single client, `getAllMessages()` as `messagesHistory`

Use one client throughout the conversation.
On each subsequent turn, pass the previous response's `getAllMessages()` output as the `messagesHistory` parameter — not the `messages` field.

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
On each subsequent turn, the `messages` field is again appended to the `prompt.template` array, so the model sees the static template messages twice — once in the `messages_history` field and once in the template array.
In practice the model handles this gracefully, but it is redundant and may affect token usage.

Do not feed the `getAllMessages()` return value back as the `messages` field — this re-merges the template on every turn:

```ts
// WRONG — causes template to accumulate on each turn
const resp2 = await client.chatCompletion({
  messages: resp1.getAllMessages() // ← do not do this
});
```

## Pattern B — Two clients (recommended, when a template is present)

Use one client that carries the template configuration for the initial turn, and a second client with no template to manage the ongoing conversation.
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

**Tradeoff**: Requires managing two client instances, but avoids duplication.
The second client has no local template, so its `messages` entries route to the `messages_history` field only.
