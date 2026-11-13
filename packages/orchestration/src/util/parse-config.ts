import { RegistryControllerPromptControllerCreateUpdatePromptTemplateBody } from '@sap-ai-sdk/prompt-registry/internal.js';
import { createLogger } from '@sap-cloud-sdk/util';

import yaml from 'yaml';

import { assertIsOrchestrationModuleConfigList } from '../orchestration-types.ts';

import type { TemplatingChatMessage } from '../client/api/schema/index.ts';
import type {
  OrchestrationModuleConfig,
  OrchestrationModuleConfigList
} from '../orchestration-types.ts';

const logger = createLogger({
  package: 'orchestration',
  messageContext: 'orchestration-parse-config'
});

/**
 * Validate that a string is valid JSON.
 * @param config - The JSON string to validate.
 * @throws {Error} If the string is not valid JSON.
 * @internal
 */
export function validateJsonConfig(config: string): void {
  try {
    JSON.parse(config);
  } catch (error) {
    throw new Error(`Could not parse JSON: ${String(error)}`, {
      cause: error
    });
  }
}

/**
 * Parse and merge a YAML templating string into the config object.
 * @param config - The orchestration module configuration with templating as a string.
 * @returns The updated and merged orchestration module configuration.
 * @throws {Error} If the YAML parsing fails or the parsed object does not conform to the expected schema.
 * @internal
 */
function parseAndMergeTemplating(
  config: OrchestrationModuleConfig
): OrchestrationModuleConfig {
  let parsedObject;
  if (
    typeof config.promptTemplating.prompt === 'string' &&
    !config.promptTemplating.prompt.trim()
  ) {
    throw new Error('Templating YAML string must be non-empty.');
  }
  try {
    parsedObject = yaml.parse(config.promptTemplating.prompt as string);
  } catch (error) {
    throw new Error(`Error parsing YAML: ${String(error)}`, { cause: error });
  }

  const result =
    RegistryControllerPromptControllerCreateUpdatePromptTemplateBody.safeParse(
      parsedObject
    );
  if (!result.success) {
    throw new Error(
      `Prompt Template YAML does not conform to the defined type. Validation errors: ${result.error}`
    );
  }
  const { template, defaults, response_format, tools } = result.data.spec;
  return {
    ...config,
    promptTemplating: {
      ...config.promptTemplating,
      prompt: {
        template: template as TemplatingChatMessage,
        ...(defaults && { defaults: defaults as Record<string, string> }),
        ...(response_format && { response_format }),
        ...(tools && { tools })
      }
    }
  };
}

/**
 * Check whether a parsed module config carries a standing prompt, that is, an inline `template` or a remote `template_ref`.
 * Run this on the result of {@link parseTemplatingModule}, so a YAML-string prompt has already been expanded into an inline `template`.
 * @param config - The parsed orchestration module configuration.
 * @returns Whether `promptTemplating.prompt` resolves to a standing template or template reference.
 * @internal
 */
export function hasStandingPrompt(config: OrchestrationModuleConfig): boolean {
  const { prompt } = config.promptTemplating;
  if (!prompt || typeof prompt === 'string') {
    return false;
  }
  return 'template' in prompt || 'template_ref' in prompt;
}

/**
 * Parse a single orchestration module config, handling YAML prompt templates.
 * @param config - The orchestration module configuration.
 * @returns The parsed configuration.
 * @internal
 */
export function parseTemplatingModule<T extends OrchestrationModuleConfig>(
  config: T
): T {
  return typeof config.promptTemplating.prompt === 'string'
    ? (parseAndMergeTemplating(config) as T)
    : config;
}

/**
 * Parse and validate a list of orchestration module configs for fallback.
 * @param config - The array of configurations.
 * @returns The validated and parsed configuration list.
 * @throws {Error} If the array is empty or contains invalid elements.
 * @internal
 */
export function parseModuleConfigList(
  config: OrchestrationModuleConfigList
): OrchestrationModuleConfigList {
  // Validate and assert it's a proper config list (throws if invalid)
  assertIsOrchestrationModuleConfigList(config);

  // Parse each config in the list
  const parsedConfigs = (config as OrchestrationModuleConfig[]).map(c =>
    parseTemplatingModule(c)
  ) as OrchestrationModuleConfigList;

  // Warn about duplicate models in fallback chain
  const models = parsedConfigs.map(c => c.promptTemplating.model.name);
  const uniqueModels = new Set(models);
  if (uniqueModels.size < models.length) {
    logger.warn(
      `Fallback configurations contain duplicate models: [${models.join(', ')}]. ` +
        'Consider using different models for meaningful fallback behavior.'
    );
  }

  return parsedConfigs;
}
