import { createLogger } from '@sap-cloud-sdk/util';
import {
  type ChatCompletionRequest,
  type StreamOptions,
  type StreamOptionsArray,
  type OrchestrationConfigRef,
  type OrchestrationModuleConfig,
  type OrchestrationModuleConfigList,
  type EmbeddingModuleConfig,
  type EmbeddingRequest
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
  EmbeddingsModuleConfigs,
  GlobalStreamOptions
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
 * Validates that stream options are compatible with module configs.
 * @throws TypeError if streamOptions array is provided for single moduleConfigs.
 * @throws RangeError if streamOptions array length doesn't match moduleConfigs array length.
 */
export function validateStreamOptions(
  moduleConfigs: ModuleConfigs | ModuleConfigs[],
  streamOptions?: StreamOptions | StreamOptionsArray
): void {
  if (Array.isArray(streamOptions)) {
    if (!Array.isArray(moduleConfigs)) {
      throw new TypeError(
        'Cannot use array of stream options with single module configuration. ' +
          'Use either a single StreamOptions object or provide an array of OrchestrationModuleConfig.'
      );
    }

    if (streamOptions.length !== moduleConfigs.length) {
      throw new RangeError(
        `StreamOptions array length (${streamOptions.length}) must match moduleConfigs array length (${moduleConfigs.length}). ` +
          'Either provide matching arrays or use a single StreamOptions object that will apply to all configs.'
      );
    }
  }
}

/**
 * @internal
 * Warns if output filtering stream options are provided but some configs lack output filtering.
 */
function warnAboutMissingOutputFiltering(
  moduleConfigs: ModuleConfigs | ModuleConfigs[],
  streamOptions?: StreamOptions
): void {
  if (!streamOptions?.outputFiltering) {
    return;
  }

  const configs = Array.isArray(moduleConfigs)
    ? moduleConfigs
    : [moduleConfigs];
  const configsWithoutFilter: number[] = configs
    .map((cfg, idx) => [cfg, idx] as const)
    .filter(([cfg]) => !cfg.filtering?.output)
    .map(([, idx]) => idx);

  // Three scenarios:
  // 1. All configs lack output filtering - warn that options are unused
  // 2. Some configs lack output filtering - warn about specific configs affected
  // 3. All configs have output filtering - no warning needed
  if (configsWithoutFilter.length === configs.length) {
    logger.warn(
      'Output filter stream options are not applied because no module configuration has output filtering enabled.'
    );
  } else if (configsWithoutFilter.length > 0) {
    const configWord = configs.length > 1 ? 'configurations' : 'configuration';
    const positions = configsWithoutFilter.map(i => `#${i + 1}`).join(', ');
    logger.warn(
      `Output filter stream options will not be applied to ${configWord} ${positions} because output filtering is not configured for those modules.`
    );
  }
}

/**
 * @internal
 * Extracts global stream configuration from stream options and applies defaults.
 */
function getGlobalStreamConfig(
  streamOptions?: StreamOptions | StreamOptionsArray
): GlobalStreamOptions {
  const globalOptions = Array.isArray(streamOptions)
    ? streamOptions[0]?.global
    : streamOptions?.global;

  return {
    enabled: true,
    ...(globalOptions || {})
  };
}

/**
 * @internal
 * Builds module configs for array of configs with array of stream options (one-to-one mapping).
 */
function buildModulesForArrayConfigsWithArrayOptions(
  moduleConfigs: ModuleConfigs[],
  streamOptions: StreamOptionsArray
): ModuleConfigs[] {
  return moduleConfigs.map((config, index) =>
    addStreamOptionsToSingleModuleConfig(config, streamOptions[index])
  );
}

/**
 * @internal
 * Build modules for array of configs with single stream options (one-to-many mapping).
 */
function buildModulesForArrayConfigsWithSingleOptions(
  moduleConfigs: ModuleConfigs[],
  streamOptions?: StreamOptions
): ModuleConfigs[] {
  return moduleConfigs.map(config =>
    addStreamOptionsToSingleModuleConfig(config, streamOptions)
  );
}

/**
 * @internal
 * Build modules for single config with single stream options (one-to-one mapping).
 */
function buildModulesForSingleConfigWithSingleOptions(
  moduleConfig: ModuleConfigs,
  streamOptions?: StreamOptions
): ModuleConfigs {
  return addStreamOptionsToSingleModuleConfig(moduleConfig, streamOptions);
}

/**
 * @internal
 * Implementation
 */
export function addStreamOptions(
  moduleConfigs: ModuleConfigs | ModuleConfigs[],
  streamOptions?: StreamOptions | StreamOptionsArray
): OrchestrationConfig {
  validateStreamOptions(moduleConfigs, streamOptions);

  let modules: ModuleConfigs | ModuleConfigs[];

  if (Array.isArray(streamOptions)) {
    const configsArray = moduleConfigs as ModuleConfigs[];
    modules = buildModulesForArrayConfigsWithArrayOptions(
      configsArray,
      streamOptions
    );
  } else {
    warnAboutMissingOutputFiltering(moduleConfigs, streamOptions);
    if (Array.isArray(moduleConfigs)) {
      modules = buildModulesForArrayConfigsWithSingleOptions(
        moduleConfigs,
        streamOptions
      );
    } else {
      modules = buildModulesForSingleConfigWithSingleOptions(
        moduleConfigs,
        streamOptions
      );
    }
  }

  return {
    stream: getGlobalStreamConfig(streamOptions),
    modules
  };
}

function addStreamOptionsToSingleModuleConfig(
  moduleConfigs: ModuleConfigs,
  streamOptions?: StreamOptions
): ModuleConfigs {
  const { prompt_templating, filtering } = moduleConfigs;
  const outputFiltering = streamOptions?.outputFiltering;

  return {
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
  };
}

/**
 * @internal
 * Overload for single config with single stream options
 */
export function constructCompletionPostRequest(
  config: OrchestrationModuleConfig | OrchestrationModuleConfigList,
  request?: ChatCompletionRequest,
  stream?: boolean,
  streamOptions?: StreamOptions
): CompletionPostRequest;

/**
 * @internal
 * Overload for array config with single or array stream options
 */
export function constructCompletionPostRequest(
  config: OrchestrationModuleConfigList,
  request?: ChatCompletionRequest,
  stream?: boolean,
  streamOptions?: StreamOptions | StreamOptionsArray
): CompletionPostRequest;

/**
 * @internal
 * Implementation
 */
export function constructCompletionPostRequest(
  config: OrchestrationModuleConfig | OrchestrationModuleConfigList,
  request?: ChatCompletionRequest,
  stream?: boolean,
  streamOptions?: StreamOptions | StreamOptionsArray
): CompletionPostRequest {
  // Preserve format: single config → ModuleConfigs, array → ModuleConfigs[]
  // The orchestration service expects the config structure to match the input:
  // - Single config (OrchestrationModuleConfig) → single ModuleConfigs object
  // - Config array (OrchestrationModuleConfigList) → array of ModuleConfigs for fallback behavior
  const moduleConfigurations = Array.isArray(config)
    ? config.map(c => buildCompletionModulesConfig(c, request))
    : buildCompletionModulesConfig(config, request);

  return {
    config: stream
      ? addStreamOptions(moduleConfigurations as ModuleConfigs, streamOptions)
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
