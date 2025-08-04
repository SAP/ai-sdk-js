# Chat History Maintenance

## Status

Accepted

## Context

With the introduction of chat history maintenance, we must distinguish between client-side and server-side approaches.
This ADR primarily focuses on **client-side history maintenance**, but also outlines the alternative **server-side** approach for context.

---

### Server-Side History Maintenance

In server-side maintenance, the server is responsible for storing the chat history.

A prominent example is OpenAI’s [conversation state](https://platform.openai.com/docs/guides/conversation-state?api-mode=responses), where conversations can branch off from any given `response_id`, continuing from that point in history.

Ideally, this would be implemented by the orchestration service, which could:

- Unify APIs across different vendors
- Enable history support for vendors that do not yet offer it natively

**Benefits**:

- **Reduced ingress traffic**: Only the latest user message needs to be sent, not the full conversation history.
- **Optimization potential**: History could be pre-vectorized, enabling efficient input by attaching only the relevant context.

---

### Client-Side History Maintenance

In this model, the client becomes **stateful**, tracking the ongoing conversation locally.

This approach introduces several responsibilities:

- History initialization
- Tenant isolation
- History retrieval
- Streaming considerations

---

#### History Initialization

Client-side history can be initialized in two ways:

1. **New conversation**: Starts with an empty history
2. **Existing conversation**: Initializes with a preloaded history

The client must support both scenarios.

---

#### Tenant Isolation

To ensure multi-tenant safety (similar to Cloud SDK destination isolation), chat histories must be isolated per tenant.

Options include:

- **User-managed**: Users instantiate a new client per tenant
- **Client-managed**: Built-in isolation via a token or tenant identifier

---

#### History Retrieval

Since production environments often favor stateless services, history may be offloaded to external databases (e.g., Redis, NoSQL) for durability and scalability.

To support this, the client should expose APIs that allow:

- Full history export
- Incremental updates (for batch or real-time sync)

```ts
client.getChatHistory(); // Returns all messages
client.getChatHistoryIncrement(); // Returns messages since the last call
```

---

#### Streaming Considerations

When handling multiple concurrent streams, conversation isolation becomes critical.

Two design choices emerge:

1. **Stream Lock**  
   Prevent multiple simultaneous streams per client.  
   - Pros: Simple to implement  
   - Cons: Limits concurrency  
   - Risk: If not locked, stream chunks could bleed into a shared history

2. **Conversation IDs**  
   Create isolated “conversations” client-side, allowing concurrent streams.  
   - Pros: Scalable and concurrent  
   - Cons: Requires the introduction of a conversation ID concept (not currently supported by vendors)

---

## Proposal:

We instantiate a new client for every conversation; this way, we can simplify multiple concerns:
- We leave tenant-isolation concerns to our users
- We don't need to handle internal conversation id's, instead a simple stream-lock
- Conversations are only created at client instantiation, where we can pass history as an instantiation parameter

---

## Decision

Proposal accepted as-is
