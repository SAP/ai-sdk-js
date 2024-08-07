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
 * @param outputFilter - List of filters to be used fot output filtering.
 * @returns Filter module configuration of the orchetration service.
 */
export function createFilterConfig(
  /**
   * List of filters to be used for the input filtering.
   */
  inputFilter?: FilteringConfig,
  /**
   * List of filters to be used fot output filtering.
   */
  outputFilter?: FilteringConfig
): FilteringModuleConfig {
  return {
    ...(inputFilter ? { input: inputFilter } : {}),
    ...(outputFilter ? { output: outputFilter } : {})
  };
}

/**
 * Convenience function to provide input filters to the orchestration service.
 * @param input - List of filters to be used for the input filtering.
 * @returns - An array of filters.
 */
export const createInputFilter = createFilter;

/**
 * Convenience function to provide output filters to the orchestration service.
 * @param output - List of filters to be used for the output filtering.
 * @returns - An array of filters.
 */
export const createOutputFilter = createFilter;

const createFilter = (
  input: FilterWrapper | FilterWrapper[]
): FilteringConfig => {
  const filterArray: FilterWrapper[] = !Array.isArray(input) ? [input] : input;
  const filterOutput: FilteringConfig = {
    filters: filterArray.map(moduleConfig => ({
      type: filterServiceProviders[moduleConfig.type],
      config: moduleConfig.config
    }))
  };
  return filterOutput;
};
