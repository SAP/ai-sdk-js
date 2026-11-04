# OpenTelemetry Instrumentation

The SAP AI SDK emits [OpenTelemetry](https://opentelemetry.io/) spans for every LLM call made through `OrchestrationClient`.
Spans follow the [GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/) so they integrate out of the box with observability tools like Grafana, Jaeger, Dynatrace, and the SAP AI Agent Observability UI.

## How It Works

When an OTel SDK is registered in your application, the following spans are created automatically — no changes to your application code required.

### `chatCompletion()`

A single span wraps the HTTP request and its response:

```
chat gpt-4o                   ← gen_ai span (CLIENT)
└── POST /inference/...        ← HTTP span (automatic)
```

The span ends when the response is returned, carrying token usage from that same response.

### `stream()`

A span wraps the HTTP connection setup and stays open until the last SSE chunk arrives and the stream is fully consumed:

```
chat gpt-4o                   ← gen_ai span (CLIENT), open until stream closes
└── POST /inference/...        ← HTTP span (automatic)
```

Token usage and finish reason are recorded on the span when `_processStreamEnd` fires.

## Span Attributes

| Attribute | When set | Example value |
|---|---|---|
| `gen_ai.system` | Always | `sap-aicore` |
| `gen_ai.operation.name` | Always | `chat` |
| `gen_ai.request.model` | Always | `gpt-4o` |
| `gen_ai.usage.input_tokens` | After response / stream end | `120` |
| `gen_ai.usage.output_tokens` | After response / stream end | `48` |
| `gen_ai.response.finish_reasons` | After response / stream end | `stop` |
| `gen_ai.response.id` | After response / stream end | `903367ba-…` |

> **Config references** — When `OrchestrationClient` is constructed with a stored configuration (`{ id: '...' }` or `{ scenario, name, version }`), the model name is not available at construction time. `gen_ai.request.model` is set to `unknown` in those cases; the actual model used is still visible via `gen_ai.response.id` on the response.

## Zero Overhead Without a Registered SDK

`@opentelemetry/api` — the package that provides the tracing API — ships a built-in no-op implementation. When no OTel SDK is registered in your process, every `trace.getTracer()` call returns a no-op tracer and all span operations compile down to empty function calls. There is no measurable overhead.

## Setup

### 1. Install the OTel SDK

```bash
npm install @opentelemetry/sdk-node \
            @opentelemetry/exporter-trace-otlp-http \
            @opentelemetry/auto-instrumentations-node
```

`@opentelemetry/api` is already a dependency of `@sap-ai-sdk/core` and does not need to be installed separately.

### 2. Initialise OTel Before Your Application

Create a file (e.g. `tracing.ts`) and **import it as the very first module** in your entry point:

```ts
// tracing.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces', // OTLP/HTTP endpoint
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
```

```ts
// server.ts  ← your entry point
import './tracing.js'; // must be first
import { OrchestrationClient } from '@sap-ai-sdk/orchestration';

// ... rest of your app
```

### 3. Use the Client Normally

No changes to your existing code are needed:

```ts
const client = new OrchestrationClient({
  promptTemplating: {
    model: { name: 'gpt-4o' }
  }
});

// chatCompletion — span starts and ends with this call
const response = await client.chatCompletion({
  messages: [{ role: 'user', content: 'Hello!' }]
});

// stream — span starts here, ends when the last chunk is consumed
const streamResponse = await client.stream({
  messages: [{ role: 'user', content: 'Tell me a story.' }]
});
for await (const chunk of streamResponse.stream) {
  process.stdout.write(chunk.getDeltaContent() ?? '');
}
```

## Advanced: Custom Span Wrappers

`@sap-ai-sdk/core` exports tracing helpers at two levels:

- **Semantic helpers** (`withAgentSpan`, `withToolSpan`) — encode the correct GenAI attribute names for common agentic operations. Use these first.
- **Generic primitives** (`withGenAiSpan`, `startGenAiSpan`) — used internally by the SDK; available for wrapping calls to AI providers not yet covered by the SDK.

### `withAgentSpan` — agentic execution loops

Wraps the entire agent loop in a root span. Automatically sets `gen_ai.operation.name: 'execute_agent'`, `gen_ai.agent.name`, and `gen_ai.conversation.id` (a UUID is generated when none is supplied). The resolved conversation ID is passed back to the callback so it can be used for logging or child spans.

```ts
import { withAgentSpan } from '@sap-ai-sdk/core';

const result = await withAgentSpan(
  { agentName: 'my-agent', conversationId: sessionId },
  async (update, setError, addEvent, conversationId) => {
    const { text } = await runMyAgentLoop(conversationId);
    update({
      'calm.agent.steps':          iterationCount,
      'calm.agent.tool_call_count': toolCallCount,
      'final_result':               text.slice(0, 4096),
    });
    return text;
  }
);
```

### `withToolSpan` — individual tool executions

Wraps a single tool invocation. Automatically sets `gen_ai.operation.name: 'execute_tool'`, `gen_ai.tool.name`, and `gen_ai.tool.arguments` (JSON-serialised input). Use `update` to record the result and any size metrics.

```ts
import { withToolSpan } from '@sap-ai-sdk/core';

const result = await withToolSpan(
  'search_documents',
  { query: 'quarterly report' },
  async (update) => {
    const output = await searchDocuments({ query: 'quarterly report' });
    update({
      'gen_ai.tool.result':      output.slice(0, 8192),
      'gen_ai.tool.result_size': output.length,
    });
    return output;
  }
);
```

### `withGenAiSpan` — generic non-streaming calls

Use this for any call where the result is fully available when the async function resolves (e.g. non-streaming requests to an AI provider not yet covered by the SDK):

```ts
import { withGenAiSpan } from '@sap-ai-sdk/core';

const result = await withGenAiSpan(
  'chat my-model',
  {
    'gen_ai.system':         'my-provider',
    'gen_ai.operation.name': 'chat',
    'gen_ai.request.model':  'my-model',
  },
  async (update) => {
    const response = await myClient.complete(prompt);
    update({
      'gen_ai.usage.input_tokens':  response.usage.promptTokens,
      'gen_ai.usage.output_tokens': response.usage.completionTokens,
    });
    return response;
  }
);
```

### `startGenAiSpan` — streaming or deferred calls

Use this when the span must outlive the initial call and be ended later (e.g. after a stream is fully consumed). The `activeCallback` runs while the span is active in the OTel context so child HTTP spans nest correctly:

```ts
import { startGenAiSpan } from '@sap-ai-sdk/core';

const { result: stream, update, end } = await startGenAiSpan(
  'chat my-model',
  {
    'gen_ai.system':         'my-provider',
    'gen_ai.operation.name': 'chat',
    'gen_ai.request.model':  'my-model',
  },
  () => myClient.streamComplete(prompt)
);

stream.onEnd(() => {
  update({
    'gen_ai.usage.input_tokens':  stream.promptTokens,
    'gen_ai.usage.output_tokens': stream.completionTokens,
  });
  end();
});
```

All helpers accept `setError(message)` as a second callback parameter to mark the span as errored without throwing — useful for controlled failure paths.

## Span Hierarchy in a Multi-Turn Agent

When an agent makes several LLM calls within one user turn, spans form a tree. `withAgentSpan` creates the root; `OrchestrationClient` creates the LLM child spans automatically; `withToolSpan` creates the tool child spans:

```
agent run (withAgentSpan)
├── chat gpt-4o                 ← OrchestrationClient — turn 1
│   └── POST /inference/...
├── execute_tool search_docs    ← withToolSpan
└── chat gpt-4o                 ← OrchestrationClient — turn 2
    └── POST /inference/...
```

```ts
import { withAgentSpan, withToolSpan } from '@sap-ai-sdk/core';
import { OrchestrationClient } from '@sap-ai-sdk/orchestration';

const client = new OrchestrationClient({ promptTemplating: { model: { name: 'gpt-4o' } } });

await withAgentSpan(
  { agentName: 'my-agent', conversationId: sessionId },
  async (update, setError, addEvent, conversationId) => {
    // LLM call — child span created automatically by OrchestrationClient
    const response = await client.chatCompletion({ messages });

    if (response.getFinishReason() === 'tool_calls') {
      // Tool call — child span created by withToolSpan
      const toolResult = await withToolSpan(
        'search_docs',
        { query: response.getToolCallArguments() },
        async (update) => {
          const output = await searchDocs(query);
          update({ 'gen_ai.tool.result': output.slice(0, 8192) });
          return output;
        }
      );
      // … feed toolResult back and call the LLM again
    }

    update({ 'calm.agent.steps': iterations, 'final_result': finalText.slice(0, 4096) });
  }
);
```

## Why the SDK Cannot Auto-Detect Agent Boundaries

The `chat <model>` spans emitted by `OrchestrationClient` are automatic because the SDK fully controls that operation. Agent run spans and tool spans cannot be automatic for a different reason: **the SDK does not see those boundaries**.

The SDK only sees individual LLM calls. It has no visibility into:

- When an agent "run" starts and ends — that boundary lives in the application's loop.
- Whether any given LLM call is part of an agent loop or a standalone request.
- When tool execution happens — the application calls its own functions; the SDK is not involved.

OTel's parent–child span hierarchy requires the root `agent run` span to be created *before* its children (LLM spans, tool spans) start. Without controlling the loop, the SDK has no hook to create that root, and all LLM child spans would appear as disconnected top-level spans.

### Current approach vs. SDK-managed loop

| | `withAgentSpan` / `withToolSpan` | SDK-managed agent loop (`OrchestrationAgent`) |
|---|---|---|
| App instrumentation boilerplate | One wrapper per function | Zero — just `agent.run()` |
| App control over loop logic | Full | Via hook callbacks |
| SDK scope | Thin semantic helpers in `@sap-ai-sdk/core` | Agent loop abstraction in `@sap-ai-sdk/orchestration` |

`withAgentSpan` and `withToolSpan` are the right choice today: they remove all knowledge of OTel attribute names from application code while keeping the loop logic in the application. A full `OrchestrationAgent` is the natural next step if the SDK evolves into an agentic framework.
