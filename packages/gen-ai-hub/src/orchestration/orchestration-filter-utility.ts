import { AzureContentSafety, FilteringConfig } from './client/api/index.js';

/**
 * Convenience function to create Azure filters.
 * @param filter - Filtering configuration for Azure filter.
 * @returns An object with the Azure filtering configuration.
 */
export function azureContentFilter(
  filter?: AzureContentSafety
): FilteringConfig {
  if (filter && Object.keys(filter).length === 0) {
    throw new Error('Filter property cannot be an empty object');
  }
  const inputFilterConfig: FilteringConfig = {
    filters: [
      {
        type: 'azure_content_safety',
        ...(filter ? { config: filter } : {})
      }
    ]
  };
  return inputFilterConfig;
}
