import { supportedAzureFilterThresholds } from '../orchestration-types.js';
import type {
  AzureContentSafety,
  AzureContentSafetyFilterConfig,
  InputFilteringConfig,
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
