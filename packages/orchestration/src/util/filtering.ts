import { supportedAzureFilterThresholds } from '../orchestration-types.js';
import type {
  AzureContentSafety,
  AzureContentSafetyFilterConfig,
  InputFilteringConfig,
  LlamaGuard38B,
  LlamaGuard38BFilterConfig,
  OutputFilteringConfig
} from '../client/api/schema/index.js';
import type {
  AzureContentFilter,
  AzureFilterThreshold
} from '../orchestration-types.js';

/**
 * Convenience function to create Azure content filters.
 * @param filter - Filtering configuration for Azure filter. If skipped, the default Azure content filter configuration is used.
 * @returns An object with the Azure filtering configuration.
 * @deprecated Since 1.8.0. Use {@link buildAzureContentSafetyFilter()} instead.
 */
export function buildAzureContentFilter(
  filter?: AzureContentSafety
): InputFilteringConfig | OutputFilteringConfig {
  if (filter && !Object.keys(filter).length) {
    throw new Error('Filter property cannot be an empty object');
  }
  return {
    filters: [
      {
        type: 'azure_content_safety',
        ...(filter && { config: filter })
      }
    ]
  };
}

/**
 * Convenience function to create Azure content filters.
 * @param config - Configuration for Azure content safety filter.
 * If skipped, the default configuration of `ALLOW_SAFE_LOW` is used for all filter categories.
 * @returns Filter config object.
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
 * @internal
 */
const defaultLlamaGuardConfig: LlamaGuard38B = {
  violent_crimes: false,
  non_violent_crimes: false,
  sex_crimes: false,
  child_exploitation: false,
  defamation: false,
  specialized_advice: false,
  privacy: false,
  intellectual_property: false,
  indiscriminate_weapons: false,
  hate: false,
  self_harm: false,
  sexual_content: false,
  elections: false,
  code_interpreter_abuse: false
};

/**
 * Convenience function to create Azure content filters.
 * @param config - Configuration for Llama guard filter.
 * @returns Filter config object.
 */
export function buildLlamaGuardFilter(
  config?: LlamaGuard38B
): LlamaGuard38BFilterConfig {
  if (config && !Object.keys(config).length) {
    throw new Error('Filtering configuration cannot be an empty object');
  }
  return {
    type: 'llama_guard_3_8b',
    config: config ?? defaultLlamaGuardConfig
  };
}
