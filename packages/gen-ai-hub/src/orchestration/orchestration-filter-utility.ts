import { AzureContentSafety, FilteringConfig } from './client/api/index.js';

/**
 * Convenience function to create Azure filters.
 * @param filter - Filtering configuration for Azure filter.
 * @returns An object with the Azure filtering configuration.
 */
export function azureContentFilter(
  filter: AzureContentSafety = { default: undefined }
): FilteringConfig {
  let inputFilterConfig: FilteringConfig;
  if (filter.default === undefined) {
    inputFilterConfig = {
      filters: [
        {
          type: 'azure_content_safety'
        }
      ]
    };
  } else if (Object.keys(filter).length === 0) {
    throw new Error('Filter property cannot be an empty object');
  }
  else{
  inputFilterConfig = {
    filters: [
      {
        type: 'azure_content_safety',
        config: filter
      }
    ]
  };
}
  return inputFilterConfig;
}
