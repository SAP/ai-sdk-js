import { createLogger } from '@sap-cloud-sdk/util';

import {
  type ChatCompletionRequest,
  type StreamOptions,
  type BaseStreamOptions,
  type ModuleStreamOptions,
  type OrchestrationConfigRefById,
  type OrchestrationConfigRefByName,
  type OrchestrationModuleConfig,
  type OrchestrationModuleConfigList,
  type EmbeddingModuleConfig,
  type EmbeddingRequest
} from '../orchestration-types.ts';

import type {
  CompletionPostRequest,
  CompletionRequestConfigurationReferenceById,
  CompletionRequestConfigurationReferenceByNameScenarioVersion,
  FilteringStreamOptions,
  ModuleConfigs,
  OrchestrationConfig,
  OutputFilteringConfig,
  PartialOrchestrationConfig,
  Template,
  PromptTemplatingModuleConfig,
  TemplateRef,
  EmbeddingsPostRequest,
  EmbeddingsOrchestrationConfig,
  EmbeddingsModuleConfigs
} from '../client/api/schema/index.ts';

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
  if (prompt?.prompt) {
    throw new Error(
      "Cannot set 'prompt' in the request when using a Launchpad JSON config. Use 'messagesHistory' or 'placeholderValues' instead."
    );
  }

  if (stream) {
    config = {
      ...config,
      stream: {
        ...config.stream,
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
  configRef: OrchestrationConfigRefById | OrchestrationConfigRefByName,
  request?: ChatCompletionRequest,
  stream?: boolean
):
  | CompletionRequestConfigurationReferenceById
  | CompletionRequestConfigurationReferenceByNameScenarioVersion {
  // Config references are single-turn by nature: the stored artifact defines the
  // full template and cannot be extended with a request-level prompt (see ADR 012).
  if (request?.prompt) {
    throw new Error(
      "Cannot set 'prompt' in the request when using a config reference. A config reference is single-turn and defines the template server-side. Use 'messagesHistory' for prior turns instead."
    );
  }

  // Route request.messages into messages_history since there is no local
  // prompt.template to merge them into for config references.
  const messagesHistory = [
    ...(request?.messagesHistory || []),
    ...(request?.messages || [])
  ];

  const { overrideConfig, ...configReference } = configRef;
  const partialConfig: PartialOrchestrationConfig = {
    ...overrideConfig,
    stream: {
      ...overrideConfig?.stream,
      enabled: stream === true
    }
  };

  return {
    config_ref: configReference,
    config: partialConfig,
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
        ...promptTemplatingModuleConfig.model.params,
        ...(streamOptions?.promptTemplating !== null && {
          stream_options: {
            include_usage: true,
            ...promptTemplatingModuleConfig.model.params?.stream_options,
            ...streamOptions?.promptTemplating
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
      ...outputFilteringConfig.stream_options,
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
      ...streamOptions?.global
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
  return request?.prompt
    ? buildRequestPromptCompletion(config, request, stream, streamOptions)
    : buildLegacyMessagesCompletion(config, request, stream, streamOptions);
}

/**
 * Builds the request from a request-level `prompt`, the current direction for
 * supplying the turn's template or template reference per call.
 * The deprecated `messages` field and constructor prompt are not supported here;
 * they belong to {@link buildLegacyMessagesCompletion} and are rejected up front.
 * @param config - Single or array of module configurations.
 * @param request - The request carrying the request-level prompt.
 * @param stream - Whether to enable streaming.
 * @param streamOptions - Stream options with optional per-config overrides.
 * @returns The completion post request.
 */
function buildRequestPromptCompletion(
  config: OrchestrationModuleConfig | OrchestrationModuleConfigList,
  request: ChatCompletionRequest,
  stream?: boolean,
  streamOptions?: StreamOptions
): CompletionPostRequest {
  const configs = Array.isArray(config) ? config : [config];
  assertRequestPromptIsExclusive(configs, request);

  const prompt = resolveRequestPrompt(request.prompt);

  const moduleConfigurations = Array.isArray(config)
    ? config.map(c => buildModulesConfigWithPrompt(c, prompt))
    : buildModulesConfigWithPrompt(config, prompt);

  const configWithStream = addStreamIfEnabled(
    moduleConfigurations,
    stream,
    streamOptions
  );

  return {
    config: configWithStream,
    ...(request.placeholderValues && {
      placeholder_values: request.placeholderValues
    }),
    ...(request.messagesHistory && {
      messages_history: request.messagesHistory
    })
  };
}

/**
 * @deprecated Builds the request from the deprecated `messages` field and the
 * constructor prompt. Delete this path once `messages` is removed; the request
 * is then built solely by {@link buildRequestPromptCompletion}.
 * @param config - Single or array of module configurations.
 * @param request - The request carrying the deprecated `messages` field.
 * @param stream - Whether to enable streaming.
 * @param streamOptions - Stream options with optional per-config overrides.
 * @returns The completion post request.
 */
function buildLegacyMessagesCompletion(
  config: OrchestrationModuleConfig | OrchestrationModuleConfigList,
  request?: ChatCompletionRequest,
  stream?: boolean,
  streamOptions?: StreamOptions
): CompletionPostRequest {
  const configs = Array.isArray(config) ? config : [config];

  // When a TemplateRef is in the constructor, messages cannot be merged into
  // prompt.template (the template lives remotely). Route them to history instead.
  const routeMessagesToHistory = configs.some(c =>
    isTemplateRef(c?.promptTemplating?.prompt || {})
  );

  const moduleRequest =
    routeMessagesToHistory && request
      ? { ...request, messages: undefined }
      : request;

  const moduleConfigurations = Array.isArray(config)
    ? config.map(c => buildCompletionModulesConfig(c, moduleRequest))
    : buildCompletionModulesConfig(config, moduleRequest);

  const configWithStream = addStreamIfEnabled(
    moduleConfigurations,
    stream,
    streamOptions
  );

  // When routing messages to history, append request.messages after messagesHistory
  const messagesHistory =
    routeMessagesToHistory && request?.messages?.length
      ? [...(request.messagesHistory || []), ...request.messages]
      : request?.messagesHistory;

  return {
    config: configWithStream,
    ...(request?.placeholderValues && {
      placeholder_values: request.placeholderValues
    }),
    ...(messagesHistory && {
      messages_history: messagesHistory
    })
  };
}

/**
 * Asserts that a request-level prompt is not combined with a constructor prompt
 * or the deprecated `messages` field, both of which it is mutually exclusive with.
 * @param configs - The module configurations to check for a constructor prompt.
 * @param request - The request to check for the deprecated `messages` field.
 */
function assertRequestPromptIsExclusive(
  configs: OrchestrationModuleConfig[],
  request: ChatCompletionRequest
): void {
  if (configs.some(c => c?.promptTemplating?.prompt)) {
    throw new Error(
      "Cannot set 'prompt' in the request when a prompt is already configured in the constructor. The constructor prompt only supports the deprecated 'messages' field. Migrate to the request-level 'prompt' field only."
    );
  }
  if (request.messages?.length) {
    throw new Error(
      "Cannot set both 'prompt' and 'messages' in the request. Use the request-level 'prompt' field for the current turn."
    );
  }
}

/**
 * Resolves a request-level prompt into the template or template reference sent
 * to the orchestration service.
 * @param requestPrompt - The request-level prompt to resolve.
 * @returns The resolved template or template reference.
 */
function resolveRequestPrompt(
  requestPrompt: ChatCompletionRequest['prompt']
): Template | TemplateRef {
  if (typeof requestPrompt === 'string') {
    throw new TypeError('Prompt must be parsed before merging with messages.');
  }

  if (
    !requestPrompt ||
    (isTemplate(requestPrompt) && !requestPrompt.template?.length)
  ) {
    throw new Error(
      'The request-level prompt template must contain at least one message.'
    );
  }

  // Cast required: the Xor on `prompt`'s type leaves `template?: ... | undefined` on the ref branch
  return requestPrompt as Template | TemplateRef;
}

/**
 * Builds a single module configuration with an already-resolved request-level prompt.
 * @param config - The module configuration to build from.
 * @param prompt - The resolved template or template reference.
 * @returns The module configuration with the prompt applied.
 */
function buildModulesConfigWithPrompt(
  config: OrchestrationModuleConfig,
  prompt: Template | TemplateRef
): ModuleConfigs {
  const { promptTemplating, filtering, masking, grounding, translation } =
    config;

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
 * Wraps module configurations in an orchestration config, enabling streaming when requested.
 * @param moduleConfigurations - Single or array of module configurations.
 * @param stream - Whether to enable streaming.
 * @param streamOptions - Stream options with optional per-config overrides.
 * @returns The orchestration config, with streaming enabled when requested.
 */
function addStreamIfEnabled(
  moduleConfigurations: ModuleConfigs | ModuleConfigs[],
  stream?: boolean,
  streamOptions?: StreamOptions
): OrchestrationConfig | { modules: ModuleConfigs | ModuleConfigs[] } {
  if (!stream) {
    return { modules: moduleConfigurations };
  }
  return Array.isArray(moduleConfigurations)
    ? addStreamOptions(moduleConfigurations, streamOptions)
    : addStreamOptions(
        moduleConfigurations,
        streamOptions as BaseStreamOptions | undefined
      );
}

function mergePromptWithMessages(
  promptTemplating: OrchestrationModuleConfig['promptTemplating'],
  request?: ChatCompletionRequest
): Template | TemplateRef {
  // Legacy path only: there is no request-level prompt here (it routes to
  // buildRequestPromptCompletion). Fall back to the constructor prompt merged
  // with the deprecated `messages` field.
  const effectivePrompt = promptTemplating.prompt;
  const messages = request?.messages;

  if (typeof effectivePrompt === 'string') {
    throw new TypeError('Prompt must be parsed before merging with messages.');
  }

  // If no prompt is defined, we initialize it with an empty template object
  const prompt = effectivePrompt ?? { template: [] };

  if (isTemplate(prompt)) {
    if (!prompt.template?.length && !messages?.length) {
      throw new Error('Either a prompt template or messages must be defined.');
    }
    return {
      ...prompt,
      template: [...(prompt.template || []), ...(messages || [])]
    };
  }

  return prompt as TemplateRef;
}

function buildCompletionModulesConfig(
  config: OrchestrationModuleConfig,
  request?: ChatCompletionRequest
): ModuleConfigs {
  const { promptTemplating, filtering, masking, grounding, translation } =
    config;

  const prompt = mergePromptWithMessages(promptTemplating, request);

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

function isTemplate(template: unknown): template is Template {
  return (
    !!template && typeof template === 'object' && !('template_ref' in template)
  );
}

function isTemplateRef(template: unknown): template is TemplateRef {
  return (
    !!template && typeof template === 'object' && 'template_ref' in template
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
