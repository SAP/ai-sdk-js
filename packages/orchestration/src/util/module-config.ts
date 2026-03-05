import { Buffer } from 'node:buffer';
import { createLogger } from '@sap-cloud-sdk/util';
import {
  type ChatCompletionRequest,
  type StreamOptions,
  type BaseStreamOptions,
  type ModuleStreamOptions,
  type OrchestrationConfigRef,
  type OrchestrationModuleConfig,
  type OrchestrationModuleConfigList,
  type EmbeddingModuleConfig,
  type EmbeddingRequest,
  type FileContentInput,
  type ChatMessages,
  type UserChatMessageContentItem
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
  TemplatingChatMessage,
  EmbeddingsPostRequest,
  EmbeddingsOrchestrationConfig,
  EmbeddingsModuleConfigs,
  ChatMessages as OrchestrationChatMessages,
  FileContent as OrchestrationFileContent
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
    messages_history:
      transformSdkToOrchestrationMessages(prompt?.messagesHistory) || [],
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
  const messagesHistory = transformSdkToOrchestrationMessages(
    request?.messagesHistory
  );
  return {
    config_ref: configRef,
    ...(request?.placeholderValues && {
      placeholder_values: request.placeholderValues
    }),
    ...(messagesHistory && {
      messages_history: messagesHistory
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
  streamOptions?: ModuleStreamOptions
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

function warnAboutUnusedOverrides(
  streamOptions: StreamOptions | undefined,
  configurationCount: number
): void {
  const overrideKeys = Object.keys(streamOptions?.overrides || []);
  if (!overrideKeys.length) {
    return;
  }

  const unusedOverrides = overrideKeys.filter(key => {
    const index = parseFloat(key);
    return !Number.isInteger(index) || index < 0 || index >= configurationCount;
  });

  if (unusedOverrides.length) {
    logger.debug(
      `The following override keys do not correspond to any module configuration and will be ignored: ${unusedOverrides.join(', ')}.`
    );
  }
}

function warnAboutShortOverridesArray(
  streamOptions: StreamOptions | undefined,
  configurationCount: number
): void {
  if (
    !Array.isArray(streamOptions?.overrides) ||
    !streamOptions.overrides.length
  ) {
    return;
  }
  const arrayLength = streamOptions.overrides.length;
  logger.debug(
    `Override array has ${arrayLength} element(s) but there are ${configurationCount} module configuration(s). ` +
      `Configs at indices ${arrayLength}-${configurationCount - 1} will use shared options. ` +
      'If this is intentional, use object input to silence this warning: `{...streamOptionsArray}`'
  );
}

/**
 * Gets stream options for a specific module configuration.
 * Returns the override for the given index if it exists, otherwise returns shared options.
 * @param streamOptions - The stream options containing shared settings and optional overrides.
 * @param index - The index of the module configuration.
 * @returns Override options for this index if present, otherwise shared options, or undefined if streamOptions is not provided.
 */
function getStreamOptionsForItem(
  streamOptions: StreamOptions | undefined,
  index: number
): ModuleStreamOptions | undefined {
  if (!streamOptions) {
    return undefined;
  }
  const { global: _global, overrides, ...shared } = streamOptions;
  return (overrides && overrides[index]) || shared;
}

/**
 * @internal
 * Warns if output filtering stream options are provided but some configs lack output filtering.
 * Checks both shared options and per-config overrides.
 * @param moduleConfigs - Single or array of module configurations.
 * @param streamOptions - Stream options (shared settings and optional per-config overrides).
 */
function warnAboutMissingOutputFiltering(
  moduleConfigs: ModuleConfigs | ModuleConfigs[],
  streamOptions?: StreamOptions
): void {
  const configs = Array.isArray(moduleConfigs)
    ? moduleConfigs
    : [moduleConfigs];

  // Collect indices where output filtering options are set but config lacks output filtering
  const configsWithoutFilter: number[] = configs
    .map((cfg, idx) => {
      const opts = getStreamOptionsForItem(streamOptions, idx);

      // Only flag if stream options request output filtering but config doesn't have it
      if (opts?.outputFiltering && !cfg.filtering?.output) {
        return idx;
      }
      return undefined;
    })
    .filter(idx => idx !== undefined);

  if (configsWithoutFilter.length === 0) {
    return;
  }

  // Three scenarios:
  // 1. All configs with output filtering options lack output filtering - warn that options are unused
  // 2. Some configs lack output filtering - warn about specific configs affected
  // 3. All configs have output filtering - no warning needed
  if (configsWithoutFilter.length === configs.length) {
    logger.warn(
      'Output filter stream options are not applied because no module configuration has output filtering enabled.'
    );
  } else if (configsWithoutFilter.length > 0) {
    const configWord =
      configsWithoutFilter.length > 1 ? 'configurations' : 'configuration';
    const positions = configsWithoutFilter.map(i => `#${i + 1}`).join(', ');
    logger.warn(
      `Output filter stream options will not be applied to ${configWord} ${positions} because output filtering is not configured for those modules.`
    );
  }
}

/**
 * @internal
 * Adds stream options to module configurations for streaming requests.
 */
function buildModules(
  configs: ModuleConfigs[],
  options?: StreamOptions
): ModuleConfigs[] {
  return configs.map((config, index) => {
    const itemStreamOptions = getStreamOptionsForItem(options, index);
    return addStreamOptionsToSingleModuleConfig(config, itemStreamOptions);
  });
}

// Overload for array with stream options (can have overrides)
/** @internal */
export function addStreamOptions(
  moduleConfigs: ModuleConfigs[],
  streamOptions?: StreamOptions
): OrchestrationConfig;

// Overload for single module configuration (no overrides allowed)
/** @internal */
export function addStreamOptions(
  moduleConfigs: ModuleConfigs,
  streamOptions?: BaseStreamOptions
): OrchestrationConfig;

/**
 * @internal
 * Adds stream options to module configurations and returns an orchestration config for streaming requests.
 * Validates overrides and warns about unused or invalid override indices.
 * @param moduleConfigs - Single or array of module configurations.
 * @param streamOptions - Stream options with optional per-config overrides.
 * @returns Orchestration config with stream enabled and processed modules.
 */
export function addStreamOptions(
  moduleConfigs: ModuleConfigs | ModuleConfigs[],
  streamOptions?: StreamOptions
): OrchestrationConfig {
  const configs = Array.isArray(moduleConfigs)
    ? moduleConfigs
    : [moduleConfigs];

  if (!Array.isArray(moduleConfigs) && streamOptions?.overrides) {
    throw new Error(
      'Overrides in stream options are not supported when a single module configuration is provided.'
    );
  }
  warnAboutUnusedOverrides(streamOptions, configs.length);
  warnAboutShortOverridesArray(streamOptions, configs.length);
  warnAboutMissingOutputFiltering(moduleConfigs, streamOptions);

  const modules = buildModules(configs, streamOptions);

  return {
    stream: {
      enabled: true,
      ...(streamOptions?.global || {})
    },
    modules: Array.isArray(moduleConfigs) ? modules : modules[0]
  };
}

function addStreamOptionsToSingleModuleConfig(
  moduleConfigs: ModuleConfigs,
  streamOptions?: ModuleStreamOptions
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
 */
export function constructCompletionPostRequest(
  config: OrchestrationModuleConfig,
  request?: ChatCompletionRequest,
  stream?: boolean,
  streamOptions?: BaseStreamOptions
): CompletionPostRequest;

/** @internal */
export function constructCompletionPostRequest(
  config: OrchestrationModuleConfigList,
  request?: ChatCompletionRequest,
  stream?: boolean,
  streamOptions?: StreamOptions
): CompletionPostRequest;

/** @internal */
export function constructCompletionPostRequest(
  config: OrchestrationModuleConfig | OrchestrationModuleConfigList,
  request?: ChatCompletionRequest,
  stream?: boolean,
  streamOptions?: StreamOptions
): CompletionPostRequest {
  // Preserve format: single config → ModuleConfigs, array → ModuleConfigs[]
  // The orchestration service expects the config structure to match the input:
  // - Single config (OrchestrationModuleConfig) → single ModuleConfigs object
  // - Config array (OrchestrationModuleConfigList) → array of ModuleConfigs for fallback behavior
  /**
   * Module configurations for the orchestration request.
   */
  const moduleConfigurations = Array.isArray(config)
    ? config.map(c => buildCompletionModulesConfig(c, request))
    : buildCompletionModulesConfig(config, request);

  /**
   * Orchestration configuration with or without streaming enabled.
   */
  const configWithStream = stream
    ? Array.isArray(moduleConfigurations)
      ? addStreamOptions(moduleConfigurations, streamOptions)
      : addStreamOptions(
          moduleConfigurations,
          streamOptions as BaseStreamOptions | undefined
        )
    : { modules: moduleConfigurations };

  const messagesHistory = request?.messagesHistory
    ? transformSdkToOrchestrationMessages(request.messagesHistory)
    : undefined;

  return {
    config: configWithStream,
    ...(request?.placeholderValues && {
      placeholder_values: request.placeholderValues
    }),
    ...(messagesHistory && { messages_history: messagesHistory })
  } as CompletionPostRequest;
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
      ...(transformSdkToOrchestrationMessages(request?.messages) || [])
    ] as TemplatingChatMessage;
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

/**
 * Transforms messages from the orchestration response format back to SDK format.
 * Converts file items from `{ file_data: url }` back to `{ type: 'url', url }`.
 * @internal
 */
export function transformOrchestrationToSdkMessages(
  messages?: OrchestrationChatMessages
): ChatMessages | undefined {
  if (!messages) {
    return undefined;
  }

  return messages.map((message): ChatMessages[number] => {
    if (message.role !== 'user') {
      return message;
    }

    if (!Array.isArray(message.content)) {
      return { role: message.role, content: message.content };
    }

    const content: UserChatMessageContentItem[] = message.content.map(
      (item): UserChatMessageContentItem => {
        if (item.type !== 'file') {
          return item as UserChatMessageContentItem;
        }

        if (!item.file) {
          return item as UserChatMessageContentItem;
        }

        const { file_data: url, ...rest } = item.file;
        return {
          type: 'file' as const,
          file: { type: 'url' as const, url, ...rest }
        };
      }
    );

    return { role: message.role, content };
  });
}

function transformSdkToOrchestrationMessages(
  messages?: ChatMessages
): OrchestrationChatMessages | undefined {
  if (!messages) {
    return messages;
  }

  return messages.map(message => {
    if (message.role !== 'user' || !Array.isArray(message.content)) {
      return message;
    }

    const resolvedContent = message.content.map(item => {
      if (item.type !== 'file') {
        return item;
      }

      if (!item.file) {
        return item;
      }
      return {
        ...item,
        file: transformSdkToOrchestrationFileContent(item.file)
      };
      };
    });

    return {
      ...message,
      content: resolvedContent
    };
  }) as OrchestrationChatMessages;
}

/**
 * @internal
 */
export function transformSdkToOrchestrationFileContent(
  input: FileContentInput
): OrchestrationFileContent {
  if (input.type === 'url') {
    const { type: _typeUrl, url, ...restUrl } = input;
    return { file_data: url, ...restUrl };
  }

  const { type: _type, data: rawData, mimeType, ...rest } = input;

  const data = Buffer.isBuffer(rawData) ? rawData.toString('base64') : rawData;

  return { file_data: `data:${mimeType};base64,${data}`, ...rest };
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
