import type {
  DocumentGroundingServiceConfig,
  GroundingModule
} from '../orchestration-types.js';

/**
 * Convenience function to create Document Grounding configuration.
 * @param groundingConfig - Configuration for the document grounding service.
 * @returns An object with the full grounding configuration.
 */
export function buildDocumentGroundingConfig(
  groundingConfig: DocumentGroundingServiceConfig
): GroundingModule {
  return {
    type: 'document_grounding_service',
    config: {
      placeholders: {
        input: groundingConfig.placeholders.input,
        output: groundingConfig.placeholders.output
      },
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
