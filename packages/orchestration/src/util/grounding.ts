import type { GroundingModuleConfig } from '../client/api/schema/index.js';
import type { DocumentGroundingServiceConfig } from '../orchestration-types.js';

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
      }),
      ...(groundingConfig.metadata_params && {
        metadata_params: groundingConfig.metadata_params
      })
    }
  };
}
