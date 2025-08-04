import { supportedAzureFilterThresholds } from '../orchestration-types.js';
import type {
  LlamaGuard38BFilterConfig
} from '../client/api/schema/index.js';
import type {
  AzureContentFilter,
  AzureContentSafetyFilterConfig,
  AzureFilterThreshold,
  LlamaGuardCategory
} from '../orchestration-types.js';

/**
 * Convenience function to build Azure content filter.
 * @param config - Configuration for Azure content safety filter.
 * If skipped, the default configuration of `ALLOW_SAFE_LOW` is used for all filter categories.
 * @returns Filter config object.
 * @example "buildAzureContentSafetyFilter({ Hate: 'ALLOW_SAFE', Violence: 'ALLOW_SAFE_LOW_MEDIUM' })"
 */
export function buildAzureContentSafetyFilter(
  config?: AzureContentFilter
): AzureContentSafetyFilterConfig {
  if (config && !Object.keys(config).length) {
    throw new Error('Filtering configuration cannot be an empty object');
  }
  return {
    type: 'azure_content_safety',
    ...(config && {
      config: {
        ...Object.fromEntries(
          Object.entries(config).map(([key, value]) => [
            key,
            supportedAzureFilterThresholds[value as AzureFilterThreshold]
          ])
        )
      }
    })
  };
}

/**
 * Convenience function to build Llama guard filter.
 * @param categories - Categories to be enabled for filtering. Provide at least one category.
 * @returns Filter config object.
 * @example "buildLlamaGuardFilter('self_harm', 'hate')"
 */
export function buildLlamaGuardFilter(
  ...categories: [LlamaGuardCategory, ...LlamaGuardCategory[]]
): LlamaGuard38BFilterConfig {
  return {
    type: 'llama_guard_3_8b',
    config: Object.fromEntries(
      [...categories].map(category => [category, true])
    )
  };
}
