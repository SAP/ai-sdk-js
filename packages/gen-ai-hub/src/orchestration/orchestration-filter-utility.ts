import { AzureContentSafety, FilteringConfig } from './client/api/index.js';

/**
 * Convenience function to create Azure filters.
 * @param filter - Filtering configuration for Azure filter. If skipped, the default Azure filter configuration is used.
 * @returns An object with the Azure filtering configuration.
 */
export function azureContentFilter(
  filter?: AzureContentSafety
): FilteringConfig {
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
  return inputFilterConfig;
}
