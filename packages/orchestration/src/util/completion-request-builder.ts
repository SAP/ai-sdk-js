import { createLogger } from '@sap-cloud-sdk/util';

import {
  type ChatCompletionRequest,
  type StreamOptions,
  type BaseStreamOptions,
  type OrchestrationConfigRefById,
  type OrchestrationConfigRefByName,
  type OrchestrationModuleConfig,
  type OrchestrationModuleConfigList
} from '../orchestration-types.ts';
import {
  assertConfigHasNoPrompt,
  buildLegacyModuleConfigs,
  buildModuleConfigs,
  isTemplateRef,
  rejectRequestPromptMessage,
  validateRequestPromptShape
} from './completion-prompt-util.ts';
import { addStreamIfEnabled } from './completion-stream-options.ts';

import type {
  CompletionPostRequest,
  CompletionRequestConfigurationReferenceById,
  CompletionRequestConfigurationReferenceByNameScenarioVersion,
  PartialOrchestrationConfig
} from '../client/api/schema/index.ts';

const logger = createLogger({
  package: 'orchestration',
  messageContext: 'orchestration-client'
});

/**
 * @internal
 */
export function constructCompletionPostRequestFromJsonModuleConfig(
  config: Record<string, any>,
  request?: ChatCompletionRequest,
  stream?: boolean
): Record<string, any> {
  let { modules } = config;
  const isModulesArray = Array.isArray(modules);

  const moduleList: Record<string, any>[] = isModulesArray
    ? modules
    : [modules];

  validateJsonModuleConfigShape(moduleList);

  if (request?.prompt) {
    assertConfigHasNoPrompt(
      moduleList.map(mod => mod?.prompt_templating?.prompt)
    );
    const prompt = validateRequestPromptShape(request);
    const modulesWithPrompt = moduleList.map(mod => ({
      ...mod,
      prompt_templating: {
        ...mod.prompt_templating,
        prompt
      }
    }));
    modules = isModulesArray ? modulesWithPrompt : modulesWithPrompt[0];
  }

  if (stream) {
    config = {
      ...config,
      modules,
      stream: {
        ...config.stream,
        enabled: true
      }
    };
  } else {
    config = { ...config, modules };
    delete config.stream;
  }

  return {
    messages_history: request?.messagesHistory || [],
    placeholder_values: request?.placeholderValues || {},
    config
  };
}

/**
 * Validates the structural shape of a parsed JSON orchestration module config.
 * Checks only what the request builder relies on: every module is an object
 * carrying a `prompt_templating` object. It does not verify the config is
 * complete.
 * @param moduleList - The parsed module configurations to validate.
 */
function validateJsonModuleConfigShape(
  moduleList: Record<string, any>[]
): void {
  moduleList.forEach(mod => {
    if (!mod || typeof mod !== 'object' || Array.isArray(mod)) {
      throw new Error(
        "Invalid JSON config: 'modules' must be an object or array."
      );
    }
    if (
      !mod.prompt_templating ||
      typeof mod.prompt_templating !== 'object' ||
      Array.isArray(mod.prompt_templating)
    ) {
      throw new Error(
        "Invalid JSON config: each module's 'prompt_templating' must be an object."
      );
    }
  });
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
      rejectRequestPromptMessage(
        'a config reference',
        "A config reference is single-turn and defines the template server-side. Use 'messagesHistory' for prior turns instead."
      )
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
  assertConfigHasNoPrompt(configs.map(c => c?.promptTemplating?.prompt));
  const prompt = validateRequestPromptShape(request);

  const moduleConfigurations = configs.map(c => buildModuleConfigs(c, prompt));

  const configWithStream = addStreamIfEnabled(
    Array.isArray(config) ? moduleConfigurations : moduleConfigurations[0],
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

  const moduleConfigurations = configs.map(c =>
    buildLegacyModuleConfigs(c, moduleRequest)
  );

  const configWithStream = addStreamIfEnabled(
    Array.isArray(config) ? moduleConfigurations : moduleConfigurations[0],
    stream,
    streamOptions
  );

  // When routing messages to history, append request.messages after messagesHistory
  const messagesHistory =
    routeMessagesToHistory && request?.messages?.length
      ? [...(request.messagesHistory || []), ...request.messages]
      : request?.messagesHistory;

  if (routeMessagesToHistory && request?.messages?.length) {
    logger.debug(
      'Messages provided with a TemplateRef will be sent as messages_history.'
    );
  }

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
