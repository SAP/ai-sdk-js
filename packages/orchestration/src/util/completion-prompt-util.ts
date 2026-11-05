import type {
  ModuleConfigs,
  Template,
  TemplateRef
} from '../client/api/schema/index.ts';
import type {
  ChatCompletionRequest,
  OrchestrationModuleConfig
} from '../orchestration-types.ts';

/**
 * @internal
 * Builds the error message for rejecting a request-level prompt on an entry
 * point that structurally cannot carry one.
 * @param context - The rejecting entry point, e.g. `'a config reference'`.
 * @param hint - What the caller should use instead.
 * @returns The error message.
 */
export function rejectRequestPromptMessage(
  context: string,
  hint: string
): string {
  return `Cannot set 'prompt' in the request when using ${context}. ${hint}`;
}

/**
 * @internal
 * Throws if any module configuration already carries a prompt, which conflicts
 * with a request-level prompt. A prompt counts as present when it is a non-null
 * object (a template or template reference) or a non-empty string. Works for
 * both typed (camelCase) and JSON (snake_case) configs: the caller extracts the
 * prompt from each config in its own casing.
 * @param prompts - The prompt extracted from each module configuration.
 */
export function assertConfigHasNoPrompt(prompts: unknown[]): void {
  const hasPrompt = prompts.some(prompt => prompt);
  if (hasPrompt) {
    throw new Error(
      "Cannot set 'prompt' in the request when the config already defines a prompt. Remove the prompt from the config, or omit the request-level prompt."
    );
  }
}

/**
 * @internal
 * Validates a request-level prompt's shape, independent of the config type. The
 * prompt is mutually exclusive with the deprecated `messages` field, must
 * already be parsed, and must contain at least one message.
 * @param request - The request carrying the request-level prompt.
 * @returns The validated template or template reference.
 */
export function validateRequestPromptShape(
  request: ChatCompletionRequest
): Template | TemplateRef {
  if (request.messages?.length) {
    throw new Error(
      "Cannot set both 'prompt' and 'messages' in the request. Use the request-level 'prompt' field for the current turn."
    );
  }

  const { prompt } = request;
  if (typeof prompt === 'string') {
    throw new TypeError('Request-level prompt must be parsed before use.');
  }

  if (isTemplateRef(prompt)) {
    return prompt;
  }

  if (!isTemplate(prompt) || !prompt.template?.length) {
    throw new Error(
      'The request-level prompt template must contain at least one message.'
    );
  }

  return prompt;
}

function mergePromptWithMessages(
  promptTemplating: OrchestrationModuleConfig['promptTemplating'],
  request?: ChatCompletionRequest
): Template | TemplateRef | undefined {
  // Legacy path only: the request-level prompt routes to buildRequestPromptCompletion.
  const messages = request?.messages;

  if (typeof promptTemplating.prompt === 'string') {
    throw new TypeError('Prompt must be parsed before merging with messages.');
  }

  const prompt = promptTemplating.prompt;

  // With no configured prompt, the current turn comes from `messages`; failing
  // that, a non-empty history is sent on its own with no prompt template.
  if (!prompt) {
    if (messages?.length) {
      return { template: messages };
    }
    if (request?.messagesHistory?.length) {
      return undefined;
    }
    throw new Error(
      'Either a prompt template, messages, or messagesHistory must be defined.'
    );
  }

  if (isTemplate(prompt)) {
    if (!prompt.template?.length && !messages?.length) {
      throw new Error(
        'A configured prompt template must contain at least one message.'
      );
    }
    return {
      ...prompt,
      template: [...(prompt.template || []), ...(messages || [])]
    };
  }

  return prompt as TemplateRef;
}

/**
 * @internal
 * Builds a single module configuration with an already-resolved request-level prompt.
 * @param config - The module configuration to build from.
 * @param prompt - The resolved template or template reference, or undefined to
 * omit the prompt entirely (history-only request).
 * @returns The module configuration with the prompt applied.
 */
export function buildModuleConfigs(
  config: OrchestrationModuleConfig,
  prompt?: Template | TemplateRef
): ModuleConfigs {
  const { promptTemplating, filtering, masking, grounding, translation } =
    config;
  // Drop the constructor-level prompt
  // legacy: the resolved `prompt` already incorporates it
  // new approach: it is always empty anyways
  const { prompt: _configuredPrompt, ...promptTemplatingWithoutPrompt } =
    promptTemplating;

  return {
    prompt_templating: {
      ...promptTemplatingWithoutPrompt,
      ...(prompt !== undefined && { prompt })
    },
    ...(filtering && Object.keys(filtering).length && { filtering }),
    ...(masking && Object.keys(masking).length && { masking }),
    ...(grounding && Object.keys(grounding).length && { grounding }),
    ...(translation && Object.keys(translation).length && { translation })
  };
}

/** @internal */
export function buildLegacyModuleConfigs(
  config: OrchestrationModuleConfig,
  request?: ChatCompletionRequest
): ModuleConfigs {
  return buildModuleConfigs(
    config,
    mergePromptWithMessages(config.promptTemplating, request)
  );
}

function isTemplate(template: unknown): template is Template {
  return (
    !!template && typeof template === 'object' && !('template_ref' in template)
  );
}

/** @internal */
export function isTemplateRef<T>(
  template: T
): template is Extract<T, TemplateRef> {
  return (
    !!template && typeof template === 'object' && 'template_ref' in template
  );
}
