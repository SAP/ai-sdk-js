import type { DocumentGroundingServiceConfig } from './orchestration-types.js';
import type {
  AzureContentSafety,
  GroundingModuleConfig,
  InputFilteringConfig,
  OutputFilteringConfig
} from './client/api/schema/index.js';

/**
 * Convenience function to create Azure content filters.
 * @param filter - Filtering configuration for Azure filter. If skipped, the default Azure content filter configuration is used.
 * @returns An object with the Azure filtering configuration.
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
 * Convenience function to create Document Grounding configuration.
 * @param groundingConfig - Configuration for the document grounding service.
 * @returns An object with the full grounding configuration.
 */
export function buildDocumentGroundingConfig(
  groundingConfig: DocumentGroundingServiceConfig
): GroundingModuleConfig {
  return {
    type: 'document_grounding_service',
    config: {
      input_params: groundingConfig.input_params,
      output_param: groundingConfig.output_param,
      ...(groundingConfig.filters && {
        filters: groundingConfig.filters?.map(filter => ({
          data_repository_type: 'vector',
          ...filter
        }))
      })
    }
  };
}
