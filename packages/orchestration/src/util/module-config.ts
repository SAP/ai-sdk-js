import { createLogger } from '@sap-cloud-sdk/util';
import type {
  ChatCompletionRequest,
  StreamOptions,
  OrchestrationModuleConfig,
  OrchestrationConfigRef,
  EmbeddingModuleConfig,
  EmbeddingRequest
} from '../orchestration-types.js';
import type {
  CompletionPostRequest,
  CompletionRequestConfigurationReferenceById,
  CompletionRequestConfigurationReferenceByNameScenarioVersion,
  FilteringStreamOptions,
  ModuleConfigs,
  OrchestrationConfig,
  OutputFilteringConfig,
  Template,
  PromptTemplatingModuleConfig,
  TemplateRef,
  EmbeddingsPostRequest,
  EmbeddingsOrchestrationConfig,
  EmbeddingsModuleConfigs
} from '../client/api/schema/index.js';

const logger = createLogger({
  package: 'orchestration',
  messageContext: 'orchestration-utils'
});

/**
 * @internal
 */
export function constructCompletionPostRequestFromJsonModuleConfig(
  config: Record<string, any>,
  prompt?: ChatCompletionRequest,
  stream?: boolean
): Record<string, any> {
  if (stream) {
    config = {
      ...config,
      stream: {
        ...(config.stream || {}),
        enabled: true
      }
    };
  } else {
    delete config.stream;
  }

  return {
    messages_history: prompt?.messagesHistory || [],
    placeholder_values: prompt?.placeholderValues || {},
    config
  };
}

/**
 * @internal
 */
export function constructCompletionPostRequestFromConfigReference(
  configRef: OrchestrationConfigRef,
  request?: ChatCompletionRequest
):
  | CompletionRequestConfigurationReferenceById
  | CompletionRequestConfigurationReferenceByNameScenarioVersion {
  return {
    config_ref: configRef,
    ...(request?.placeholderValues && {
      placeholder_values: request.placeholderValues
    }),
    ...(request?.messagesHistory && {
      messages_history: request.messagesHistory
    })
  } as
    | CompletionRequestConfigurationReferenceById
    | CompletionRequestConfigurationReferenceByNameScenarioVersion;
}

/**
 * @internal
 */
export function addStreamOptionsToPromptTemplatingModuleConfig(
  promptTemplatingModuleConfig: PromptTemplatingModuleConfig,
  streamOptions?: StreamOptions
): PromptTemplatingModuleConfig {
  if (streamOptions?.promptTemplating === null) {
    return promptTemplatingModuleConfig;
  }
  return {
    ...promptTemplatingModuleConfig,
    model: {
      ...promptTemplatingModuleConfig.model,
      params: {
        ...(promptTemplatingModuleConfig.model.params || {}),
        ...(streamOptions?.promptTemplating !== null && {
          stream_options: {
            include_usage: true,
            ...(promptTemplatingModuleConfig.model.params?.stream_options ||
              {}),
            ...(streamOptions?.promptTemplating || {})
          }
        })
      }
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
  const { prompt_templating, filtering } = moduleConfigs;
  const outputFiltering = streamOptions?.outputFiltering;
  const globalStreamOptions = streamOptions?.global;

  if (!moduleConfigs?.filtering?.output && outputFiltering) {
    logger.warn(
      'Output filter stream options are not applied because filtering module is not configured.'
    );
  }

  return {
    stream: {
      ...(globalStreamOptions || {}),
      enabled: true
    },
    modules: {
      ...moduleConfigs,
      prompt_templating: addStreamOptionsToPromptTemplatingModuleConfig(
        prompt_templating,
        streamOptions
      ),
      ...(outputFiltering &&
        filtering?.output && {
          filtering: {
            ...filtering,
            output: addStreamOptionsToOutputFilteringConfig(
              filtering.output,
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
  request?: ChatCompletionRequest,
  stream?: boolean,
  streamOptions?: StreamOptions
): CompletionPostRequest {
  const moduleConfigurations = buildCompletionModulesConfig(config, request);

  return {
    config: stream
      ? addStreamOptions(moduleConfigurations, streamOptions)
      : { modules: moduleConfigurations },
    ...(request?.placeholderValues && {
      placeholder_values: request.placeholderValues
    }),
    ...(request?.messagesHistory && {
      messages_history: request.messagesHistory
    })
  };
}

function buildCompletionModulesConfig(
  config: OrchestrationModuleConfig,
  request?: ChatCompletionRequest
): ModuleConfigs {
  const { promptTemplating, filtering, masking, grounding, translation } =
    config;

  // prompt is not a string here as it is already parsed in `parseAndMergeTemplating` method
  const prompt = {
    ...(promptTemplating.prompt as Template | TemplateRef)
  };

  // If promptTemplating.prompt is not defined, we initialize it with an empty Template object
  promptTemplating.prompt = promptTemplating.prompt || { template: [] };

  if (isTemplate(prompt)) {
    if (!prompt.template?.length && !request?.messages?.length) {
      throw new Error('Either a prompt template or messages must be defined.');
    }
    prompt.template = [
      ...(prompt.template || []),
      ...(request?.messages || [])
    ];
  }

  return {
    prompt_templating: {
      ...promptTemplating,
      prompt
    },
    ...(filtering && Object.keys(filtering).length && { filtering }),
    ...(masking && Object.keys(masking).length && { masking }),
    ...(grounding && Object.keys(grounding).length && { grounding }),
    ...(translation && Object.keys(translation).length && { translation })
  };
}

function isTemplate(
  templating: Template | TemplateRef
): templating is Template {
  return (
    templating &&
    typeof templating === 'object' &&
    !('template_ref' in templating)
  );
}

/**
 * Constructs an embedding post request from the given configuration and request.
 * @internal
 */
export function constructEmbeddingPostRequest(
  config: EmbeddingModuleConfig,
  request: EmbeddingRequest
): EmbeddingsPostRequest {
  const orchestrationConfig: EmbeddingsOrchestrationConfig = {
    modules: buildEmbeddingModulesConfig(config)
  };

  const embeddingRequest: EmbeddingsPostRequest = {
    config: orchestrationConfig,
    input: {
      text: request.input,
      ...(request.type && { type: request.type })
    }
  };
  return embeddingRequest;
}

function buildEmbeddingModulesConfig(
  config: EmbeddingModuleConfig
): EmbeddingsModuleConfigs {
  const { embeddings, masking } = config;
  const { model } = embeddings;
  const { name, version, params } = model;

  const modules: EmbeddingsModuleConfigs = {
    embeddings: {
      model: {
        name,
        ...(version && { version }),
        ...(params && { params })
      }
    },
    ...(masking && Object.keys(masking).length && { masking })
  };

  return modules;
}
