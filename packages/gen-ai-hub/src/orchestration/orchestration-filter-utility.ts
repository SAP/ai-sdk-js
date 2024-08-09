import { AzureContentSafety, FilteringConfig } from './client/api/index.js';

/**
 * Convenience function to create Azure filters.
 * @param filter - Filtering configuration for Azure filter.
 * @returns An object with the Azure filtering configuration.
 */
export function createAzureFilter(filter: AzureContentSafety): FilteringConfig {
  const inputFilterConfig: FilteringConfig = {
    filters: [
      {
        type: 'azure_content_safety',
        config: filter
      }
    ]
  };
  return inputFilterConfig;
}
