import { constructCompletionPostRequest } from '../../util/index.ts';
import { parseModuleConfigList } from '../../util/parse-config.ts';

import type {
  CompletionPostRequest,
  CompletionRequestConfigurationReferenceById,
  CompletionRequestConfigurationReferenceByNameScenarioVersion,
  PartialOrchestrationConfig,
  PartialPromptTemplatingModuleConfig,
  Template
} from '../../client/api/schema/index.ts';
import type {
  ChatCompletionRequest,
  LlmModelDetails,
  OrchestrationConfigRefById,
  OrchestrationConfigRefByName,
  OrchestrationModuleConfig,
  OrchestrationModuleConfigList,
  PromptTemplatingModule
} from '../../orchestration-types.ts';
import type {
  OrchestrationCompletionConfig,
  OrchestrationCompletionCreateOptions,
  OrchestrationFallbackEntry,
  OrchestrationFallbacksGlobalOptions,
  OrchestrationInlinePromptOptions,
  OrchestrationModelOption
} from '../orchestration-types.ts';

/**
 * Normalize a model option into the {@link PromptTemplatingModule} `model` shape, expanding a bare model-name shorthand.
 * A string `'amazon--nova-lite'` becomes `{ name: 'amazon--nova-lite' }`; a details object is returned as-is.
 * @param model - The model as a details object or a bare model-name string.
 * @returns The full model details object.
 * @internal
 */
export function normalizeModel(
  model: OrchestrationModelOption
): LlmModelDetails {
  return typeof model === 'string' ? { name: model } : model;
}

/**
 * Turn a single prompt entry (`model` plus inline `messages` or a remote `template_ref`) into an `OrchestrationModuleConfig` by baking its prompt into the shared config's `promptTemplating`.
 * `messages` becomes the template via the request, so it is not part of the nested prompt here.
 * @param config - The shared non-prompt module configuration.
 * @param entry - The per-call `model` and prompt pieces.
 * @returns A module configuration with `promptTemplating` synthesized, plus the request's `messages` if supplied inline.
 * @internal
 */
function entryToModuleConfig(
  config: OrchestrationCompletionConfig,
  entry: OrchestrationFallbackEntry
): {
  moduleConfig: OrchestrationModuleConfig;
  messages?: ChatCompletionRequest['messages'];
} {
  const { model, ...promptOptions } = entry;
  const { messages, ...prompt } =
    promptOptions as OrchestrationInlinePromptOptions & {
      messages?: ChatCompletionRequest['messages'];
    };

  const moduleConfig: OrchestrationModuleConfig = {
    ...config,
    promptTemplating: {
      model: normalizeModel(model),
      ...(Object.keys(prompt).length > 0 && {
        prompt: prompt as PromptTemplatingModule['prompt']
      })
    }
  };

  return { moduleConfig, messages };
}

/**
 * Assemble a single completion request from one shared config and one prompt entry.
 * @param config - The shared non-prompt module configuration.
 * @param body - The per-call `model`, prompt pieces, `messagesHistory`, `placeholderValues`, and `stream`.
 * @returns The completion post request body.
 * @internal
 */
export function buildSingleCompletionPostRequest(
  config: OrchestrationCompletionConfig,
  body: OrchestrationCompletionCreateOptions & {
    messagesHistory?: ChatCompletionRequest['messagesHistory'];
    placeholderValues?: ChatCompletionRequest['placeholderValues'];
    stream?: unknown;
  }
): CompletionPostRequest {
  const { messagesHistory, placeholderValues, stream, ...entry } = body;
  const { moduleConfig, messages } = entryToModuleConfig(
    config,
    entry as OrchestrationFallbackEntry
  );

  const request: ChatCompletionRequest = {
    messages,
    messagesHistory,
    placeholderValues
  };

  // TODO: map per-module stream options from the `stream` object into the
  // helper's `streamOptions` param (same gap as the other `new/` builders).
  return constructCompletionPostRequest(
    moduleConfig,
    request,
    !!stream,
    undefined
  );
}

/**
 * Assemble a fallback-chain completion request: one shared config fanned over several prompt entries.
 * Each entry's prompt is baked into a copy of the shared config, so every fallback carries distinct messages.
 * @param config - The shared non-prompt module configuration, spread into every fallback.
 * @param entries - The per-fallback `model` and prompt pieces, tried in order.
 * @param global - Request-global options (`messagesHistory`, `placeholderValues`) applied to every fallback.
 * @param stream - Whether streaming is enabled.
 * @returns The completion post request body.
 * @internal
 */
export function buildFallbackChainPostRequest(
  config: OrchestrationCompletionConfig,
  entries: OrchestrationFallbackEntry[],
  global: OrchestrationFallbacksGlobalOptions,
  stream?: unknown
): CompletionPostRequest {
  const list = entries.map(entry => {
    const { moduleConfig, messages } = entryToModuleConfig(config, entry);
    // Bake this fallback's messages into its own template, since the shared
    // helper applies a single `request` across the whole list.
    if (messages?.length) {
      const prompt = moduleConfig.promptTemplating.prompt;
      const existingTemplate =
        prompt && typeof prompt === 'object' && 'template' in prompt
          ? prompt.template
          : [];
      moduleConfig.promptTemplating.prompt = {
        ...(typeof prompt === 'object' ? prompt : {}),
        template: [...(existingTemplate || []), ...messages]
      } as PromptTemplatingModule['prompt'];
    }
    return moduleConfig;
  }) as OrchestrationModuleConfigList;

  const request: ChatCompletionRequest = {
    messagesHistory: global.messagesHistory,
    placeholderValues: global.placeholderValues
  };

  // TODO: map per-fallback stream options from the `stream` object into the
  // helper's `streamOptions` param (same gap as the other `new/` builders).
  return constructCompletionPostRequest(
    parseModuleConfigList(list),
    request,
    !!stream,
    undefined
  );
}

/**
 * Assemble a completion request backed by a stored configuration reference.
 * The inline `create` body carries the same prompt-templating pieces as the other builders; map them into the config_ref override: `model` becomes `config.modules.prompt_templating.model`, while `messages` and the template options (`defaults`/`response_format`/`tools`) — or a remote `template_ref` — become `config.modules.prompt_templating.prompt`. `messagesHistory` is sent as `messages_history`.
 * This mirrors the legacy `constructCompletionPostRequestFromConfigReference`, but builds the request here so the shared util keeps its original behavior; this path additionally routes `messages` into the template rather than `messages_history`.
 * @param configRef - The stored configuration reference, with any module overrides already merged.
 * @param body - The per-call `model`, prompt pieces, `messagesHistory`, `placeholderValues`, and `stream`.
 * @returns The completion post request body.
 * @internal
 */
export function buildConfigRefPostRequest(
  configRef: OrchestrationConfigRefById | OrchestrationConfigRefByName,
  body: OrchestrationCompletionCreateOptions & {
    messagesHistory?: ChatCompletionRequest['messagesHistory'];
    placeholderValues?: ChatCompletionRequest['placeholderValues'];
    stream?: unknown;
  }
): CompletionPostRequest {
  const { messagesHistory, placeholderValues, stream, ...entry } = body;
  const { model, template_ref, messages, ...templateOptions } =
    entry as OrchestrationInlinePromptOptions & {
      model?: OrchestrationModelOption;
      template_ref?: PartialPromptTemplatingModuleConfig['prompt'];
      messages?: ChatCompletionRequest['messages'];
    };

  // Build the prompt override: a remote `template_ref` overrides the prompt
  // directly; otherwise `messages` and the template options
  // (defaults/response_format/tools) become a Template. `messages` are always
  // the template here — never messages_history — so the stored prompt is
  // replaced rather than used as conversation history.
  let prompt: PartialPromptTemplatingModuleConfig['prompt'] | undefined;
  if (template_ref) {
    prompt = template_ref;
  } else if (messages?.length || Object.keys(templateOptions).length) {
    prompt = {
      ...(templateOptions as Omit<Template, 'template'>),
      template: messages ?? []
    };
  }

  const promptTemplating: PartialPromptTemplatingModuleConfig = {
    ...(model && { model: normalizeModel(model) }),
    ...(prompt && { prompt })
  };

  const { overrideConfig, ...configReference } = configRef;

  // Merge the per-call prompt-templating override into the stored override's
  // modules, preserving any module overrides already carried by the reference.
  const modules = Object.keys(promptTemplating).length
    ? {
        ...overrideConfig?.modules,
        prompt_templating: {
          ...overrideConfig?.modules?.prompt_templating,
          ...promptTemplating
        }
      }
    : overrideConfig?.modules;

  const config: PartialOrchestrationConfig = {
    ...overrideConfig,
    ...(modules && { modules }),
    stream: {
      ...overrideConfig?.stream,
      enabled: stream === true
    }
  };

  return {
    config_ref: configReference,
    config,
    ...(placeholderValues && { placeholder_values: placeholderValues }),
    ...(messagesHistory?.length && { messages_history: messagesHistory })
  } as
    | CompletionRequestConfigurationReferenceById
    | CompletionRequestConfigurationReferenceByNameScenarioVersion;
}
