import type {
  AzureContentSafety,
  DataRepositoryType,
  DocumentGroundingFilter,
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
 * Represents a filter configuration for the Document Grounding Service.
 *
 */
export type DocumentGroundingServiceFilter = Pick<
  DocumentGroundingFilter,
  | 'id'
  | 'search_config'
  | 'data_repositories'
  | 'data_repository_metadata'
  | 'document_metadata'
  | 'chunk_metadata'
> & {
  /**
   * Defines the type of data repository.
   * If not set, the default value is 'vector'.
   */
  data_repository_type?: DataRepositoryType;
};

/**
 * Represents the configuration for the Document Grounding Service.
 */
export interface DocumentGroundingServiceConfig {
  /**
   * Define the filters to apply during the grounding process.
   */
  filters?: DocumentGroundingServiceFilter[];
  /**
   * Contains the input parameters used for grounding input questions.
   */
  input_params: string[];
  /**
   * Parameter name used for grounding output.
   * @example "groundingOutput"
   */
  output_param: string;
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
