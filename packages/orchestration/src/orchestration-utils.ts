import { createLogger } from '@sap-cloud-sdk/util';
import type {
  CompletionPostRequest,
  FilteringStreamOptions,
  ModuleConfigs,
  OrchestrationConfig,
  OutputFilteringConfig
} from './client/api/schema/index.js';
import type {
  Prompt,
  StreamOptions,
  LlmModuleConfig,
  OrchestrationModuleConfig
} from './orchestration-types.js';

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
          ...(llmModuleConfig.model_params.stream_options || {}),
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
