# Prompt Template Message Routing — Multi-Turn Patterns

How to run a multi-turn conversation with a local template today, given the routing behavior described in [ADR 012](./012-prompt-template-message-routing.md).

These patterns are workarounds for the current API.
They may become obsolete once ADR 012 is decided.

## Pattern A — Single client

Use one client throughout the conversation with no constructor template.
Include the system message as the first entry in `messages` on turn 1 alongside the first user message.
On each subsequent turn, pass the previous response's `getAllMessages()` output as the `messagesHistory` parameter — not the `messages` field.

```ts
const client = new OrchestrationClient({
  promptTemplating: {
    model: { name: 'anthropic--claude-4.5-haiku' }
    // no prompt template
  }
});

// Turn 1 — system message travels as the first entry alongside the user message
const resp1 = await client.chatCompletion({
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is the capital of France?' }
  ]
});

// Turn 2
const resp2 = await client.chatCompletion({
  messagesHistory: resp1.getAllMessages(), // system + user1 + assistant1
  messages: [{ role: 'user', content: 'What is the typical food there?' }]
});
```

**Note**: `getAllMessages()` from turn 1 captures the system message, so it flows into `messagesHistory` naturally from turn 2 onward — no duplication occurs.

Do not feed the `getAllMessages()` return value back as the `messages` field — this re-appends all prior messages to the template slot on every turn:

```ts
const client = new OrchestrationClient({
  promptTemplating: {
    model: { name: 'anthropic--claude-4.5-haiku' }
  }
});

// WRONG — causes prior messages to accumulate in the template slot on each turn
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
