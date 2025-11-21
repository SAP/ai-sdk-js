import { supportedAzureFilterThresholds } from '../orchestration-types.js';
import type {
  AzureContentSafetyFilterParameters,
  AzureContentSafetyFilterReturnType,
  AzureFilterThreshold,
  LlamaGuard38BCategory,
  LlamaGuard38BFilterReturnType,
  ConfigType
} from '../orchestration-types.js';

/**
 * Convenience function to build Azure content filter.
 * @param type - Type of the filter, either 'input' or 'output'.
 * @param config - Configuration for Azure content safety filter.
 * If skipped, the default configuration of `ALLOW_SAFE_LOW` is used for all filter categories.
 * @returns Azure content safety configuration.
 * @example "buildAzureContentSafetyFilter('input', { hate: 'ALLOW_SAFE', violence: 'ALLOW_SAFE_LOW_MEDIUM' })"
 */
export function buildAzureContentSafetyFilter<T extends ConfigType>(
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
      config as AzureContentSafetyFilterParameters<'input'>;
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
    } as AzureContentSafetyFilterReturnType<T>;
  }

  const { protected_material_code, ...restConfig } =
    config as AzureContentSafetyFilterParameters<'output'>;
  return {
    type: 'azure_content_safety',
    config: {
      ...Object.fromEntries(
        Object.entries(restConfig).map(([key, value]) => [
          key,
          supportedAzureFilterThresholds[value as AzureFilterThreshold]
        ])
      ),
      ...(protected_material_code !== undefined && { protected_material_code })
    }
  } as AzureContentSafetyFilterReturnType<T>;
}

/**
 * Convenience function to build Llama Guard 3 8B filter.
 * @param type - Type of the filter, either `input` or `output`.
 * @param categories - Categories to be enabled for filtering. Provide at least one category.
 * @returns Llama Guard 3 8B filter configuration.
 * @example buildLlamaGuard38BFilter('input', ['elections', 'hate'])
 */
export function buildLlamaGuard38BFilter<T extends ConfigType>(
  type: T,
  categories: [LlamaGuard38BCategory, ...LlamaGuard38BCategory[]]
): LlamaGuard38BFilterReturnType<T> {
  return {
    type: 'llama_guard_3_8b',
    config: Object.fromEntries(
      [...categories].map(category => [category, true])
    )
  };
}
