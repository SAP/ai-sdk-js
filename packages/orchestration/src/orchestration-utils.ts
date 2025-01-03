import type { LlmModelParams } from './orchestration-types.js';
import type {
  AzureContentSafety,
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
 * Convenience function to set model params in LLM Module Configuration.
 * @param model_params - Configuration for the model params object in LLM Module Configuration.
 * @returns An object with the model params for LLM Module Config.
 */
export function modelParamOptions(
  model_params: LlmModelParams
): LlmModelParams {
  return { ...model_params };
}
