import type { OrchestrationModuleConfig } from '../../orchestration-types.ts';

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
 * A fallback list of prompt-less module configurations supplied to the callable builder's `withModules`.
 * Each entry carries only the non-prompt orchestration modules; the prompt-templating pieces for each are supplied positionally through the fallbacks builder's `create`.
 * @experimental This type is experimental and may change at any time without prior notice.
 */
export type OrchestrationCompletionConfigList = OrchestrationCompletionConfig[];
