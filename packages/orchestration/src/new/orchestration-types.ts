import type { Xor } from '@sap-cloud-sdk/util';

import type {
  ChatMessages,
  Template,
  TemplateRef
} from '../client/api/schema/index.ts';
import type { ChatModel } from '../model-types.ts';
import type {
  LlmModelDetails,
  OrchestrationCreateOptions,
  OrchestrationModuleConfig
} from '../orchestration-types.ts';

/**
 * The model to use for a request, as either the full {@link LlmModelDetails} object or a bare model-name shorthand.
 * A string `'amazon--nova-lite'` is accepted as shorthand for `{ name: 'amazon--nova-lite' }`.
 * @experimental This type is experimental and may change at any time without prior notice.
 */
export type OrchestrationModelOption = ChatModel | LlmModelDetails;

/**
 * Configuration accepted by the callable `completion(config)` entry point.
 * Carries only the non-prompt orchestration modules — the prompt-templating pieces (`model`, `prompt`, `messages`) are supplied per call through `create` instead.
 * Derived from {@link OrchestrationModuleConfig} by dropping `promptTemplating`.
 * @experimental This type is experimental and may change at any time without prior notice.
 */
export type OrchestrationCompletionConfig = Omit<
  OrchestrationModuleConfig,
  'promptTemplating'
>;

/**
 * Prompt-templating options supplied per call to the callable builder's `create`, excluding the inline `template`.
 * The inline template content is passed through `messages` instead; these carry the remaining templating options (`defaults`, `response_format`, `tools`) directly at the top level.
 * @experimental This type is experimental and may change at any time without prior notice.
 */
export type OrchestrationInlinePromptOptions = Omit<Template, 'template'>;

/**
 * Per-call inputs for the callable builder's `create` when the prompt is supplied inline through `messages`.
 * `model` is required; `messages` carries the current-turn and template content. The inline templating options (`defaults`, `response_format`, `tools`) are spread at the top level.
 * @experimental This type is experimental and may change at any time without prior notice.
 */
export interface OrchestrationCompletionCreateOptionsWithMessages
  extends OrchestrationCreateOptions,
    OrchestrationInlinePromptOptions {
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
 * Per-call inputs for the callable builder's `create` when the prompt is a remote prompt-registry {@link TemplateRef}.
 * `model` is required and `template_ref` is spread at the top level. `messages` is not allowed, because the template lives remotely and cannot be extended inline.
 * @experimental This type is experimental and may change at any time without prior notice.
 */
export interface OrchestrationCompletionCreateOptionsWithTemplateRef
  extends OrchestrationCreateOptions,
    TemplateRef {
  /**
   * The model to use for the request, as a {@link LlmModelDetails} object or a bare model-name shorthand.
   */
  model: OrchestrationModelOption;
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

/**
 * A fallback list of prompt-less module configurations supplied to the callable builder's `withModules`.
 * Each entry carries only the non-prompt orchestration modules; the prompt-templating pieces for each are supplied positionally through the fallbacks builder's `create`.
 * @experimental This type is experimental and may change at any time without prior notice.
 */
export type OrchestrationCompletionConfigList = OrchestrationCompletionConfig[];

/**
 * Per-fallback prompt input for the fallbacks builder's `create`, positionally aligned to the configuration list passed to `withModules`.
 * Each entry supplies its fallback's `model` (required) and either inline `messages` (with optional `defaults`, `response_format`, `tools`) or a remote `template_ref`.
 * @experimental This type is experimental and may change at any time without prior notice.
 */
export type OrchestrationFallbackEntry = Xor<
  OrchestrationInlinePromptOptions & {
    /**
     * The model to use for this fallback, as a {@link LlmModelDetails} object or a bare model-name shorthand.
     */
    model: OrchestrationModelOption;
    /**
     * Chat messages for this fallback, including templated messages with `{{?placeholder}}` variables.
     */
    messages: ChatMessages;
  },
  TemplateRef & {
    /**
     * The model to use for this fallback, as a {@link LlmModelDetails} object or a bare model-name shorthand.
     */
    model: OrchestrationModelOption;
  }
>;

/**
 * Request-global options for the fallbacks builder's `create`, applied across every fallback: streaming and the shared request inputs.
 * @experimental This type is experimental and may change at any time without prior notice.
 */
export interface OrchestrationFallbacksGlobalOptions {
  /**
   * Chat messages prepended as history to every fallback request.
   */
  messagesHistory?: ChatMessages;
  /**
   * Placeholder values applied to every fallback request.
   */
  placeholderValues?: Record<string, string>;
}

/**
 * The list form of the callable builder's `create`: a fallback chain over the one shared configuration.
 * Supply the per-fallback prompt-templating pieces under `fallbacks`; the orchestration service tries each in order until one succeeds. `messagesHistory` and `placeholderValues` are request-global, applied to every fallback.
 * @experimental This type is experimental and may change at any time without prior notice.
 */
export interface OrchestrationCompletionCreateFallbacksOptions
  extends OrchestrationFallbacksGlobalOptions {
  /**
   * The per-fallback prompt-templating pieces, tried in order until one succeeds. Each supplies its fallback's `model` and either inline `messages` or a remote `template_ref`.
   */
  fallbacks: OrchestrationFallbackEntry[];
}
