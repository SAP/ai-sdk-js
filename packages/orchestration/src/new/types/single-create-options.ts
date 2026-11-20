import type { CustomRequestConfig } from '@sap-ai-sdk/core';
import type { Xor } from '@sap-cloud-sdk/util';

import type { ChatMessages } from '../../client/api/schema/index.ts';
import type { OrchestrationRequestHeaders } from '../../orchestration-types.ts';
import type {
  OrchestrationCompletionCreateOptionsWithTemplateRef,
  OrchestrationInlinePromptOptions,
  OrchestrationModelOption
} from './orchestration-types.ts';
import type {
  NewStreamOptionsWithFallbacks,
  NewStreamOptionsWithoutFallbacks
} from './streaming.ts';

/**
 * Per-call inputs for a {@link OrchestrationClient} builder's `create` method.
 * The prompt is not included here: it is supplied only through the `config` builder's `create`, whose options type adds it.
 * @experimental This type is experimental and may change at any time without prior notice.
 */
export interface OrchestrationCreateOptions {
  /**
   * Prior conversation turns, appended to the request as context and never merged into a prompt template.
   */
  messagesHistory?: ChatMessages;
  /**
   * Values for the `{{?placeholder}}` variables in the prompt template.
   * @example
   * placeholderValues: {
   *   product: 'SAP Cloud SDK'
   * }
   */
  placeholderValues?: Record<string, string>;
  /**
   * Whether to stream the response, optionally carrying stream options.
   * Pass `true` or a stream options object to stream, or omit it (or pass `false`) for a single response.
   * When streaming, `create` returns an {@link OrchestrationStreamResponse}, otherwise an {@link OrchestrationResponse}.
   * Use the plain object form to set stream options, or {@link NewStreamOptionsWithFallbacks} to set per-config options for module fallback.
   * @example
   * stream: true
   * @example
   * stream: { chunk_size: 100 }
   */
  stream?:
    | boolean
    | NewStreamOptionsWithoutFallbacks
    | NewStreamOptionsWithFallbacks;
}

/**
 * Per-call inputs for the `config` builder's `create` method.
 * Adds the current-turn `prompt` to {@link OrchestrationCreateOptions}, because the inline configuration is the only source whose template can be extended per call.
 * @experimental This type is experimental and may change at any time without prior notice.
 */
export interface OrchestrationCreateOptionsWithPrompt extends OrchestrationCreateOptions {
  /**
   * The current turn's chat messages, appended to the inline prompt template.
   * @example
   * messages: [{ role: 'user', content: 'What is the capital of France?' }]
   */
  messages?: ChatMessages;
}

/**
 * Transport configuration for a builder's `create` method, passed as its optional second argument.
 * Use `headers` to pass service-specific headers, and `signal` to cancel the request.
 * @experimental This type is experimental and may change at any time without prior notice.
 */
export type OrchestrationCreateRequestConfig = CustomRequestConfig & {
  headers?: OrchestrationRequestHeaders;
};

/**
 * Per-call inputs for the callable builder's `create` when the prompt is supplied inline through `messages`.
 * `model` is required; `messages` carries the current-turn and template content. The inline templating options (`defaults`, `response_format`, `tools`) are spread at the top level.
 * @experimental This type is experimental and may change at any time without prior notice.
 */
export interface OrchestrationCompletionCreateOptionsWithMessages
  extends OrchestrationCreateOptions, OrchestrationInlinePromptOptions {
  /**
   * The model to use for the request, as a {@link LlmModelDetails} object or a bare model-name shorthand.
   */
  model: OrchestrationModelOption;
  /**
   * Chat messages for the request, including templated messages with `{{?placeholder}}` variables.
   */
  messages: ChatMessages;
}

/**
 * Per-call inputs for the callable builder's `create`.
 * Either supply the prompt inline through `messages` (with optional `defaults`, `response_format`, `tools`), or reference a remote template through `template_ref`; the two are mutually exclusive.
 * @experimental This type is experimental and may change at any time without prior notice.
 */
export type OrchestrationCompletionCreateOptions = Xor<
  OrchestrationCompletionCreateOptionsWithMessages,
  OrchestrationCompletionCreateOptionsWithTemplateRef
>;
