import {
  AzureContentSafety,
  ProviderType,
  FilteringConfig
} from './api/index.js';
import { FilteringModuleConfig } from './api/schema/filtering-module-config.js';

/**
 * Map of filter service providers.
 * @internal
 */
export const filterServiceProviders: { [key: string]: ProviderType } = {
  azureContentSafety: 'azure_content_safety'
};

/**
 * Wrapper type for Filters encompassing multiple service providers and their respective configuration.
 *
 */
export type FilterWrapper =
  | {
      /**
       * Allowed filter service providers.
       */
      type: 'azureContentSafety';
      /**
       *
       */
      config: AzureContentSafety;
    }
  | {
      /**
       * Allowed filter service providers.
       */
      type: 'someOtherFilterServiceProvider';
      /**
       *
       */
      config: AzureContentSafety;
    };

/**
 * Convenience function to provide filters to the orchestration service.
 * @param inputFilter - List of filters to be used for the input filtering.
 * @param inputFilter.input - The input filtering configuration.
 * @param outputFilter - List of filters to be used for output filtering.
 * @param outputFilter.output - The output filtering configuration.
 * @returns The filtering module configuration.
 */
export function createFilterConfig(
  inputFilter?: { input: FilteringConfig },
  outputFilter?: { output: FilteringConfig }
): FilteringModuleConfig {
  return {
    ...(inputFilter ? inputFilter : {}),
    ...(outputFilter ? outputFilter : {})
  };
}

const createFilter = (input: FilterWrapper[]): FilteringConfig => {
  const filterOutput: FilteringConfig = {
    filters: input.map(moduleConfig => ({
      type: filterServiceProviders[moduleConfig.type],
      config: moduleConfig.config
    }))
  };
  return filterOutput;
};

/**
 * Convenience function to provide output filters to the orchestration service.
 * @param output - List of filters to be used for the output filtering.
 * @returns - An object with the output filtering configuration.
 */
export const createOutputFilter = (
  ...output: FilterWrapper[]
): { output: FilteringConfig } => ({ output: createFilter(output) });
