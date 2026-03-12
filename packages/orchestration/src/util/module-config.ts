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
  type ChatMessage,
  type ChatMessages,
  type UserChatMessageContentItem as SdkContentItem,
  isFileUrlContent
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
  ChatMessage as OrchestrationChatMessage,
  ChatMessages as OrchestrationChatMessages,
  FileContent as OrchestrationFileContent,
  UserChatMessageContentItem as OrchestrationContentItem
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
    messages_history: transformSdkToOrchestrationMessages(
      prompt?.messagesHistory
    ),
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
    ...(messagesHistory.length && {
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

  return {
    config: configWithStream,
    ...(request?.placeholderValues && {
      placeholder_values: request.placeholderValues
    }),
    ...(request?.messagesHistory && {
      messages_history: transformSdkToOrchestrationMessages(
        request.messagesHistory
      )
    })
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
      ...transformSdkToOrchestrationMessages(request?.messages)
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

/**
 * Transforms messages from the orchestration response format back to SDK format.
 * Converts file items from `{ file_data: url }` back to `{ url }`.
 * @internal
 */
export function transformOrchestrationToSdkMessages(
  messages: OrchestrationChatMessages | undefined
): ChatMessages {
  return (messages || []).map((message): ChatMessage => {
    if (message.role === 'user' && Array.isArray(message.content)) {
      return {
        ...message,
        content: message.content.map(transformOrchestrationToSdkContentItem)
      } as ChatMessage;
    }
    return message as ChatMessage;
  });
}

function transformSdkToOrchestrationMessages(
  messages: ChatMessages | undefined
): OrchestrationChatMessages {
  return (messages || []).map((message): OrchestrationChatMessage => {
    if (message.role === 'user' && Array.isArray(message.content)) {
      return {
        ...message,
        content: message.content.map(transformSdkToOrchestrationContentItem)
      } as OrchestrationChatMessage;
    }
    return message as OrchestrationChatMessage;
  });
}

/**
 * Transforms file content from SDK format to orchestration format.
 * @internal
 * @param input - SDK file content input.
 * @returns Orchestration file content.
 */
export function transformSdkToOrchestrationFileContent(
  input: FileContentInput
): OrchestrationFileContent {
  if (isFileUrlContent(input)) {
    const { url, ...inputWithoutUrl } = input;
    return { file_data: url, ...inputWithoutUrl };
  }

  const { data, mimeType, ...inputWithoutData } = input;
  const base64Data = Buffer.isBuffer(data) ? data.toString('base64') : data;

  return {
    file_data: `data:${mimeType};base64,${base64Data}`,
    ...inputWithoutData
  };
}

/**
 * Transforms content items from orchestration format back to SDK format.
 * Converts `file` properties on items from `{ file_data: url }` to `{ url }` (`FileUrlContent`).
 * Never creates `file` properties of type `FileDataContent`.
 * @internal
 * @param item - Orchestration content item.
 * @returns SDK content item.
 */
function transformOrchestrationToSdkContentItem(
  item: OrchestrationContentItem
): SdkContentItem {
  const { file, ...itemWithoutFile } = item;
  if (file) {
    const { file_data, ...fileWithoutData } = file;
    return {
      ...itemWithoutFile,
      file: { url: file_data, ...fileWithoutData }
    };
  }
  return itemWithoutFile;
}

function transformSdkToOrchestrationContentItem(
  item: SdkContentItem
): OrchestrationContentItem {
  const { file, ...itemWithoutFile } = item;

  if (file) {
    return {
      ...itemWithoutFile,
      file: transformSdkToOrchestrationFileContent(file)
    };
  }
  return itemWithoutFile;
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
