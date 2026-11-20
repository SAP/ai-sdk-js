import type {
  OrchestrationCompletionCreateOptions,
  OrchestrationGlobalCreateOptions
} from './global-create-options.ts';
import type { OrchestrationInlinePromptOptions } from './prompt-templating-create-options.ts';

/**
 * The list form of the callable builder's `create`: a fallback chain over the one shared configuration.
 * Supply the per-fallback prompt-templating pieces under `fallbacks`; the orchestration service tries each in order until one succeeds. `messagesHistory` and `placeholderValues` are request-global, applied to every fallback.
 * @experimental This type is experimental and may change at any time without prior notice.
 */
export interface OrchestrationCompletionCreateFallbacksOptions extends OrchestrationGlobalCreateOptions {
  /**
   * The per-fallback prompt-templating pieces, tried in order until one succeeds. Each supplies its fallback's `model` and either inline `messages` or a remote `template_ref`.
   */
  promptConfigs: OrchestrationInlinePromptOptions[];
}

/**
 * Narrow a `create` body to the fallback-chain form.
 * Returns `true` when the body carries `promptConfigs`, distinguishing {@link OrchestrationCompletionCreateFallbacksOptions} from a single-completion {@link OrchestrationCompletionCreateOptions}.
 * @param options - The `create` body, either single-completion or fallback-chain.
 * @returns `true` if the body is the fallback-chain form.
 * @experimental This function is experimental and may change at any time without prior notice.
 */
export function isFallbacksCreateOptions(
  options:
    | OrchestrationCompletionCreateOptions
    | OrchestrationCompletionCreateFallbacksOptions
): options is OrchestrationCompletionCreateFallbacksOptions {
  return 'promptConfigs' in options;
}
