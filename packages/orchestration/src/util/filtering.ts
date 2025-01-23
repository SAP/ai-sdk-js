import type {
  AzureContentSafety,
  AzureContentSafetyFilterConfig,
  InputFilteringConfig,
  OutputFilteringConfig
} from '../client/api/schema/index.js';

/**
 * Convenience function to create Azure content filters.
 * @param filter - Filtering configuration for Azure filter. If skipped, the default Azure content filter configuration is used.
 * @returns An object with the Azure filtering configuration.
 * @deprecated Use ContentFilters.buildAzureContentSafety() instead.
 */
export function buildAzureContentFilter(
  filter?: AzureContentSafety
): InputFilteringConfig | OutputFilteringConfig {
  return {
    filters: [ContentFilters.buildAzureContentSafety(filter)]
  };
}

/**
 * Convenience function to create Azure content filters.
 * @param config - Filtering configuration for Azure filter. If skipped, the default Azure content filter configuration is used.
 * @returns Filter config object.
 */
export function buildAzureContentSafety(
  config?: AzureContentSafety
): AzureContentSafetyFilterConfig {
  return {
    type: 'azure_content_safety',
    ...(config && { config })
  };
}

/**
 * Content filters for orchestration.
 */
export const ContentFilters = {
  buildAzureContentSafety
};
