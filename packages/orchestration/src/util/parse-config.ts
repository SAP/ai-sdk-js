import { RegistryControllerPromptControllerCreateUpdatePromptTemplateBody } from '@sap-ai-sdk/prompt-registry/internal.js';
import { createLogger } from '@sap-cloud-sdk/util';

import yaml from 'yaml';

import { assertIsOrchestrationModuleConfigList } from '../orchestration-types.ts';

import type { TemplatingChatMessage } from '../client/api/schema/index.ts';
import type {
  OrchestrationModuleConfig,
  OrchestrationModuleConfigList,
  OrchestrationConfigWithTemplate,
  OrchestrationConfigWithoutTemplate
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
 * Check whether a module config carries a standing prompt, that is, an inline `template`, a remote `template_ref`, or a YAML string (which always expands to an inline `template`).
 * This is a type guard that keys off exactly the shape the `config` overloads distinguish, so the compile-time gate and the runtime branch stay in lockstep: a config is prompt-less ({@link OrchestrationConfigWithoutTemplate}) only when `promptTemplating.prompt` is absent or an object with neither `template` nor `template_ref`.
 * Run it on the raw, unparsed config, before {@link parseTemplatingModule} expands a YAML-string prompt.
 * @param config - A module configuration without a standing prompt, or with one (inline, remote, or YAML).
 * @returns Whether `promptTemplating.prompt` is (or resolves to) a standing template or template reference.
 * @internal
 */
export function hasStandingPrompt(
  config: OrchestrationConfigWithTemplate | OrchestrationConfigWithoutTemplate
): config is OrchestrationConfigWithTemplate {
  const { prompt } = config.promptTemplating;
  if (!prompt) {
    return false;
  }

  return (
    typeof prompt === 'string' ||
    'template' in prompt ||
    'template_ref' in prompt
  );
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
