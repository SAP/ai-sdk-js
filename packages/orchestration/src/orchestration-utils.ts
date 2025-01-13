import { createLogger } from '@sap-cloud-sdk/util';
import type {
  DocumentGroundingServiceConfig,
  Prompt,
  StreamOptions,
  LlmModuleConfig,
  OrchestrationModuleConfig
} from './orchestration-types.js';
import type {
  AzureContentSafety,
  GroundingModuleConfig,
  InputFilteringConfig,
  CompletionPostRequest,
  FilteringStreamOptions,
  ModuleConfigs,
  OrchestrationConfig,
  OutputFilteringConfig
} from './client/api/schema/index.js';

const logger = createLogger({
  package: 'orchestration',
  messageContext: 'orchestration-utils'
});

/**
 * @internal
 */
export function constructCompletionPostRequestFromJsonModuleConfig(
  config: Record<string, any>,
  prompt?: Prompt,
  stream?: boolean
): Record<string, any> {
  const orchestration_config = { ...config };
  if (stream) {
    orchestration_config.stream = true;
  } else {
    delete orchestration_config.stream;
  }

  return {
    messages_history: prompt?.messagesHistory || [],
    input_params: prompt?.inputParams || {},
    orchestration_config
  };
}

/**
 * @internal
 */
export function addStreamOptionsToLlmModuleConfig(
  llmModuleConfig: LlmModuleConfig,
  streamOptions?: StreamOptions
): LlmModuleConfig {
  if (streamOptions?.llm === null) {
    return llmModuleConfig;
  }
  return {
    ...llmModuleConfig,
    model_params: {
      ...llmModuleConfig.model_params,
      ...(streamOptions?.llm !== null && {
        stream_options: {
          include_usage: true,
          ...(llmModuleConfig.model_params?.stream_options || {}),
          ...(streamOptions?.llm || {})
        }
      })
    }
  };
}

/**
 * @internal
 */
export function addStreamOptionsToOutputFilteringConfig(
  outputFilteringConfig: OutputFilteringConfig,
  filteringStreamOptions: FilteringStreamOptions
): OutputFilteringConfig {
  return {
    ...outputFilteringConfig,
    stream_options: {
      ...(outputFilteringConfig.stream_options || {}),
      ...filteringStreamOptions
    }
  };
}

/**
 * @internal
 */
export function addStreamOptions(
  moduleConfigs: ModuleConfigs,
  streamOptions?: StreamOptions
): OrchestrationConfig {
  const { llm_module_config, filtering_module_config } = moduleConfigs;
  const outputFiltering = streamOptions?.outputFiltering;
  const globalOptions = streamOptions?.global;

  if (!moduleConfigs?.filtering_module_config?.output && outputFiltering) {
    logger.warn(
      'Output filter stream options are not applied because filtering module is not configured.'
    );
  }

  return {
    stream: true,
    ...(globalOptions && { stream_options: globalOptions }),
    module_configurations: {
      ...moduleConfigs,
      llm_module_config: addStreamOptionsToLlmModuleConfig(
        llm_module_config,
        streamOptions
      ),
      ...(outputFiltering &&
        filtering_module_config?.output && {
          filtering_module_config: {
            ...filtering_module_config,
            output: addStreamOptionsToOutputFilteringConfig(
              filtering_module_config.output,
              outputFiltering
            )
          }
        })
    }
  };
}

/**
 * @internal
 */
export function constructCompletionPostRequest(
  config: OrchestrationModuleConfig,
  prompt?: Prompt,
  stream?: boolean,
  streamOptions?: StreamOptions
): CompletionPostRequest {
  const moduleConfigurations = {
    templating_module_config: config.templating,
    llm_module_config: config.llm,
    ...(config?.filtering &&
      Object.keys(config.filtering).length && {
        filtering_module_config: config.filtering
      }),
    ...(config?.masking &&
      Object.keys(config.masking).length && {
        masking_module_config: config.masking
      }),
    ...(config?.grounding &&
      Object.keys(config.grounding).length && {
        grounding_module_config: config.grounding
      })
  };

  return {
    orchestration_config: stream
      ? addStreamOptions(moduleConfigurations, streamOptions)
      : { module_configurations: moduleConfigurations },
    ...(prompt?.inputParams && {
      input_params: prompt.inputParams
    }),
    ...(prompt?.messagesHistory && {
      messages_history: prompt.messagesHistory
    })
  };
}

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
