import { supportedAzureFilterThresholds } from '../orchestration-types.js';
import type {
  AzureContentSafetyInputFilterConfig,
  AzureContentSafetyOutputFilterConfig
} from '../client/api/schema/index.js';
import type {
  AzureContentSafetyFilterInputParameters,
  AzureContentSafetyFilterParameters,
  AzureContentSafetyFilterReturnType,
  AzureFilterThreshold,
  LlamaGuardCategory,
  LlamaGuardFilterReturnType
} from '../orchestration-types.js';

/**
 * Convenience function to build Azure content filter.
 * @param type - Type of the filter, either 'input' or 'output'.
 * @param config - Configuration for Azure content safety filter.
 * If skipped, the default configuration of `ALLOW_SAFE_LOW` is used for all filter categories.
 * @returns Azure content safety configuration.
 * @example "buildAzureContentSafetyFilter({ type: 'input', hate: 'ALLOW_SAFE', violence: 'ALLOW_SAFE_LOW_MEDIUM' })"
 */
export function buildAzureContentSafetyFilter<T extends 'input' | 'output'>(
  type: T,
  config?: AzureContentSafetyFilterParameters<T>
): AzureContentSafetyFilterReturnType<T> {
  if (!config) {
    return {
      type: 'azure_content_safety'
    };
  }

  if (!Object.keys(config).length) {
    throw new Error('Filtering parameters cannot be empty');
  }

  if (type === 'input') {
    const { prompt_shield, ...rest } =
      config as AzureContentSafetyFilterInputParameters;
    return {
      type: 'azure_content_safety',
      config: {
        ...Object.fromEntries(
          Object.entries(rest).map(([key, value]) => [
            key,
            supportedAzureFilterThresholds[value as AzureFilterThreshold]
          ])
        ),
        ...(prompt_shield !== undefined && { prompt_shield })
      }
    } as AzureContentSafetyInputFilterConfig;
  }

  return {
    type: 'azure_content_safety',
    config: {
      ...Object.fromEntries(
        Object.entries(config).map(([key, value]) => [
          key,
          supportedAzureFilterThresholds[value as AzureFilterThreshold]
        ])
      )
    }
  } as AzureContentSafetyOutputFilterConfig;
}

/**
 * Convenience function to build Llama guard filter.
 * @param type - Type of the filter, either 'input' or 'output'.
 * @param categories - Categories to be enabled for filtering. Provide at least one category.
 * @returns Llama Guard filter configuration.
 * @example "buildLlamaGuardFilter('input', ['elections', 'hate'])"
 */
export function buildLlamaGuardFilter<T extends 'input' | 'output'>(
  type: T,
  categories: [LlamaGuardCategory, ...LlamaGuardCategory[]]
): LlamaGuardFilterReturnType<T> {
  return {
    type: 'llama_guard_3_8b',
    config: Object.fromEntries(
      [...categories].map(category => [category, true])
    )
  };
}
