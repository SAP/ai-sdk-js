import {
  context,
  trace,
  SpanKind,
  SpanStatusCode
} from '@opentelemetry/api';
import { randomUUID } from 'node:crypto';

import type { Attributes, Span } from '@opentelemetry/api';

const tracer = trace.getTracer('@sap-ai-sdk/core', '1.0.0');

/**
 * Sets additional span attributes at any point during execution.
 */
export type UpdateFn = (attrs: Attributes) => void;

/**
 * Marks the span as errored without throwing (for controlled soft-failure paths).
 */
export type SetErrorFn = (message: string) => void;

/**
 * Adds a named event with optional attributes to the current span.
 * Follows the GenAI semantic conventions event model, e.g.:
 *   addEvent('gen_ai.user.message', { 'gen_ai.event.content': '{"role":"user","content":"..."}' })
 */
export type AddEventFn = (name: string, attributes?: Attributes) => void;

/**
 * Wraps an async operation in an active OpenTelemetry span.
 *
 * Child spans (e.g., outbound HTTP requests) are automatically nested because
 * the new span is set as the active context for the duration of `fn`.
 *
 * When no OTel SDK is registered `@opentelemetry/api` is a no-op, so this
 * function adds zero overhead and has no effect.
 *
 * @param name - Span name following GenAI semantic conventions, e.g. `chat gpt-4o`.
 * @param attributes - Initial span attributes to set at span start.
 * @param fn - Async callback that receives `update`, `setError`, and `addEvent` helpers.
 * @returns The value returned by `fn`.
 */
export async function withGenAiSpan<T>(
  name: string,
  attributes: Attributes,
  fn: (update: UpdateFn, setError: SetErrorFn, addEvent: AddEventFn) => Promise<T>
): Promise<T> {
  return tracer.startActiveSpan(
    name,
    { kind: SpanKind.CLIENT, attributes },
    async (span: Span) => {
      let statusSet = false;
      const update: UpdateFn = attrs => span.setAttributes(attrs);
      const setError: SetErrorFn = message => {
        statusSet = true;
        span.setStatus({ code: SpanStatusCode.ERROR, message });
      };
      const addEvent: AddEventFn = (evtName, evtAttrs) =>
        span.addEvent(evtName, evtAttrs);
      try {
        const result = await fn(update, setError, addEvent);
        if (!statusSet) {
          span.setStatus({ code: SpanStatusCode.OK });
        }
        return result;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        span.setStatus({ code: SpanStatusCode.ERROR, message });
        span.recordException(err instanceof Error ? err : new Error(message));
        throw err;
      } finally {
        span.end();
      }
    }
  );
}

/**
 * Starts a GenAI span and runs `activeCallback` within its context (so child
 * HTTP spans nest correctly), then returns control functions so the caller can
 * update attributes and end the span later — e.g. when a stream finishes.
 *
 * Typical usage for streaming:
 * ```ts
 * const { result: streamResponse, update, addEvent, end } = await startGenAiSpan(
 *   'chat gpt-4o',
 *   { 'gen_ai.operation.name': 'chat', ... },
 *   () => this.createStreamResponse(...)
 * );
 * streamResponse._onStreamEnd = () => {
 *   update({ 'gen_ai.usage.input_tokens': ... });
 *   end();
 * };
 * return streamResponse;
 * ```
 *
 * @param name - Span name.
 * @param attributes - Initial span attributes.
 * @param activeCallback - Async work to run while the span is active (HTTP call, etc.).
 */
export async function startGenAiSpan<T>(
  name: string,
  attributes: Attributes,
  activeCallback: () => Promise<T>
): Promise<{
  result: T;
  update: UpdateFn;
  setError: SetErrorFn;
  addEvent: AddEventFn;
  end: () => void;
}> {
  const span = tracer.startSpan(name, { kind: SpanKind.CLIENT, attributes });
  const ctx = trace.setSpan(context.active(), span);

  let statusSet = false;
  const update: UpdateFn = attrs => span.setAttributes(attrs);
  const setError: SetErrorFn = message => {
    statusSet = true;
    span.setStatus({ code: SpanStatusCode.ERROR, message });
  };
  const addEvent: AddEventFn = (evtName, evtAttrs) =>
    span.addEvent(evtName, evtAttrs);
  const end = () => {
    if (!statusSet) {
      span.setStatus({ code: SpanStatusCode.OK });
    }
    span.end();
  };

  try {
    const result = await context.with(ctx, activeCallback);
    return { result, update, setError, addEvent, end };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    span.setStatus({ code: SpanStatusCode.ERROR, message });
    span.recordException(err instanceof Error ? err : new Error(message));
    span.end();
    throw err;
  }
}

/**
 * Options for {@link withAgentSpan}.
 */
export interface AgentSpanOptions {
  /**
   * Human-readable name identifying this agent instance.
   * Sets `gen_ai.agent.name`.
   */
  agentName: string;
  /**
   * ID that groups all turns of a multi-turn session into one conversation.
   * Sets `gen_ai.conversation.id`. A random UUID is generated when omitted.
   */
  conversationId?: string;
}

/**
 * Wraps an agentic execution loop in a root GenAI span using the
 * `execute_agent` operation type from the OpenTelemetry GenAI semantic
 * conventions.
 *
 * Automatically sets:
 * - `gen_ai.operation.name: 'execute_agent'`
 * - `gen_ai.agent.name`
 * - `gen_ai.conversation.id` (uses supplied value or generates a UUID)
 *
 * The callback receives `update`, `setError`, `addEvent`, and the resolved
 * `conversationId` — useful for logging or passing to child spans.
 *
 * @param options - Agent name and optional conversation ID.
 * @param fn - Async callback that receives the span helpers and resolved conversation ID.
 * @returns The value returned by `fn`.
 */
export async function withAgentSpan<T>(
  options: AgentSpanOptions,
  fn: (
    update: UpdateFn,
    setError: SetErrorFn,
    addEvent: AddEventFn,
    conversationId: string
  ) => Promise<T>
): Promise<T> {
  const conversationId = options.conversationId ?? randomUUID();
  return withGenAiSpan(
    'agent run',
    {
      'gen_ai.operation.name': 'execute_agent',
      'gen_ai.agent.name': options.agentName,
      'gen_ai.conversation.id': conversationId,
    },
    (update, setError, addEvent) => fn(update, setError, addEvent, conversationId)
  );
}

/**
 * Wraps a single tool execution in a GenAI span using the `execute_tool`
 * operation type from the OpenTelemetry GenAI semantic conventions.
 *
 * Automatically sets:
 * - `gen_ai.operation.name: 'execute_tool'`
 * - `gen_ai.tool.name`
 * - `gen_ai.tool.arguments` — JSON-serialised `toolInput`
 *
 * Use `update` inside `fn` to record the tool result and any size metrics,
 * e.g. `update({ 'gen_ai.tool.result': result, 'gen_ai.tool.result_size': result.length })`.
 *
 * @param toolName - Name of the tool being invoked.
 * @param toolInput - Structured input the model passed to the tool.
 * @param fn - Async callback that receives `update`, `setError`, and `addEvent` helpers.
 * @returns The value returned by `fn`.
 */
export async function withToolSpan<T>(
  toolName: string,
  toolInput: Record<string, unknown> | undefined,
  fn: (update: UpdateFn, setError: SetErrorFn, addEvent: AddEventFn) => Promise<T>
): Promise<T> {
  return withGenAiSpan(
    `execute_tool ${toolName}`,
    {
      'gen_ai.operation.name': 'execute_tool',
      'gen_ai.tool.name': toolName,
      'gen_ai.tool.arguments': JSON.stringify(toolInput ?? {}),
    },
    fn
  );
}
