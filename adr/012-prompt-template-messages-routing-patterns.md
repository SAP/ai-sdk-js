<!-- vale off -->

# Prompt Template Message Routing — Multi-Turn Patterns

How to run a multi-turn conversation with a local template today, given the routing behavior described in [ADR 012](./012-prompt-template-message-routing.md).

These patterns are workarounds for the current API.
They may become obsolete once ADR 012 is implemented.

A multi-turn conversation in this document refers to a fixed sequence of exchanges.

- **Turn 0** — system message: the logical first position that establishes the assistant's behavior for the session — not necessarily a separate API call.
- **Turn 1** — first user exchange: a user message and an assistant response.
- **Turn 2+** — each subsequent exchange: another user message followed by another assistant response.

## System Message as Local Template

### Pattern A — Single client

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

// Turn 0 + Turn 1 — system message alongside the first user message
const resp1 = await client.chatCompletion({
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is the capital of France?' }
  ]
});

// Turn 2+
const resp2 = await client.chatCompletion({
  messagesHistory: resp1.getAllMessages(), // system + user1 + assistant1
  messages: [{ role: 'user', content: 'What is the typical food there?' }]
});
```

**Tradeoff**: The system message must be inlined with the user message, so the structural separation between system and user/assistant turns is lost.

### Pattern B — Two clients (recommended, when a template is present)

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

// Turn 0 + Turn 1 — use the template client
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

### Anti-Pattern C — Single client with constructor template (avoid)

Using a single client with the system message in the constructor template and passing `getAllMessages()` as `messagesHistory` on subsequent turns produces an incorrect history.

```ts
// ⚠️ Avoid
const client = new OrchestrationClient({
  promptTemplating: {
    model: { name: 'anthropic--claude-4.5-haiku' },
    prompt: {
      template: [{ role: 'system', content: 'You are a helpful assistant.' }]
    }
  }
});

// Turn 0 + Turn 1
const resp1 = await client.chatCompletion({
  messages: [{ role: 'user', content: 'What is the capital of France?' }]
});

// Turn 2+ — ⚠️ the constructor template re-prepends the system message
const resp2 = await client.chatCompletion({
  messagesHistory: resp1.getAllMessages(), // already contains the system message
  messages: [{ role: 'user', content: 'What is the typical food there?' }]
});
```

**Problem**: `getAllMessages()` from turn 1 already contains the system message echoed back from the constructor template.
On turn 2, the constructor template re-prepends it again, so the model receives the system message twice.
The duplication compounds on every subsequent turn.

## System Message as Remote Template

With a template reference, any messages passed via `messages` route to `messages_history`.
The orchestration service places `messages_history` before the template output, so a user message cannot be co-located with the system prompt in the same request.

### Anti-Pattern A — Single client (avoid)

The local-template Pattern A works because the system message is inlined with the first user message in `messages`.
With a template reference this is not possible.
Any message in `messages` is routed to `messages_history`, landing before the system prompt.

```ts
// ⚠️ Does not work
const client = new OrchestrationClient({
  promptTemplating: {
    prompt: { template_ref: { id: 'my-system-prompt' } },
    model: { name: 'anthropic--claude-4.5-haiku' }
  }
});

// Turn 1 — ⚠️ user message lands in messages_history before the system prompt
const resp1 = await client.chatCompletion({
  messages: [{ role: 'user', content: 'What is the capital of France?' }]
});

// Turn 2+ — ⚠️ getAllMessages() already contains the system message echoed from the template module
const resp2 = await client.chatCompletion({
  messagesHistory: resp1.getAllMessages(), // already contains the system message
  messages: [{ role: 'user', content: 'What is the typical food there?' }]
});
```

**Problem**: On turn 1, the user message lands in `messages_history` before the system prompt — the order is wrong.
On turn 2, `getAllMessages()` already contains the system message captured from the template module.
The template reference prepends it again, so the model receives the system message twice.
The duplication compounds on every subsequent turn.

### Pattern B — Two clients (recommended, when a template reference is present)

Use one client that carries the template reference for the initial turn, and a second client with no template for the ongoing conversation.
The first call to the template reference client must be empty — no user message — to render the system prompt into history without placing any message before it.

```ts
const templateRefClient = new OrchestrationClient({
  promptTemplating: {
    prompt: { template_ref: { id: 'my-system-prompt' } },
    model: { name: 'anthropic--claude-4.5-haiku' }
  }
});

const conversationClient = new OrchestrationClient({
  promptTemplating: {
    model: { name: 'anthropic--claude-4.5-haiku' }
    // no prompt template — messages go to the template position directly
  }
});

// Turn 0 — empty call to render the template reference into the conversation history
const resp0 = await templateRefClient.chatCompletion();

// Turn 1 — first user exchange
const resp1 = await conversationClient.chatCompletion({
  messagesHistory: resp0.getAllMessages(), // [system from template ref, ...]
  messages: [{ role: 'user', content: 'What is the capital of France?' }]
});

// Turn 2+
const resp2 = await conversationClient.chatCompletion({
  messagesHistory: resp1.getAllMessages(),
  messages: [{ role: 'user', content: 'What is the typical food there?' }]
});
```

**Tradeoff**: The first call to `templateRefClient` is empty and produces a wasted completion — the assistant receives only the system prompt and its response is discarded.
Two client instances must be managed, and every conversation requires a bootstrap call before the first real user exchange.

### Pattern C — User placeholder in the template reference

Author the remote template so it ends with a user message whose content is a placeholder.
The first user input then rides in through `placeholderValues`, so it is templated and lands after the system prompt in a single call.
This avoids the wasted completion from Pattern B on turn 1.

The template stored in the prompt registry:

```json
[
  {
    "role": "system",
    "content": "You describe images in 5 words or less."
  },
  {
    "role": "user",
    "content": [
      {
        "type": "text",
        "text": "{{ ?user_input }}"
      }
    ]
  }
]
```

```ts
const templateRefClient = new OrchestrationClient({
  promptTemplating: {
    prompt: { template_ref: { id: 'my-system-prompt' } },
    model: { name: 'anthropic--claude-4.5-haiku' }
  }
});

const conversationClient = new OrchestrationClient({
  promptTemplating: {
    model: { name: 'anthropic--claude-4.5-haiku' }
    // no prompt template — messages go to the template position directly
  }
});

// Turn 0 + Turn 1 — the first user message fills the template placeholder
const resp1 = await templateRefClient.chatCompletion({
  placeholderValues: { user_input: 'What is in this image?' }
});

// Turn 2+ — switch to the conversation client to avoid re-rendering the template
const resp2 = await conversationClient.chatCompletion({
  messagesHistory: resp1.getAllMessages(), // [system, user1, assistant1]
  messages: [{ role: 'user', content: 'And what colors dominate?' }]
});
```

**Tradeoff**: The template must be authored with a user placeholder, which couples its structure to this usage.
The placeholder only carries the first turn.
From turn 2 onward the conversation still moves to a second client, because reusing the template reference client would re-render the templated user message on every call.
