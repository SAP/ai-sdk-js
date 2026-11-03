import { createLogger } from '@sap-cloud-sdk/util';

import type {
  FilteringStreamOptions,
  ModuleConfigs,
  OrchestrationConfig,
  OutputFilteringConfig,
  PromptTemplatingModuleConfig
} from '../client/api/schema/index.ts';
import type {
  StreamOptions,
  ModuleStreamOptions
} from '../orchestration-types.ts';

const logger = createLogger({
  package: 'orchestration',
  messageContext: 'orchestration-utils'
});

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

  const modules = configs.map((config, index) =>
    addStreamOptionsToSingleModuleConfig(
      config,
      getStreamOptionsForItem(streamOptions, index)
    )
  );

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
 * Wraps module configurations in an orchestration config, enabling streaming when requested.
 * @param moduleConfigurations - Single or array of module configurations.
 * @param stream - Whether to enable streaming.
 * @param streamOptions - Stream options with optional per-config overrides.
 * @returns The orchestration config, with streaming enabled when requested.
 */
export function addStreamIfEnabled(
  moduleConfigurations: ModuleConfigs | ModuleConfigs[],
  stream?: boolean,
  streamOptions?: StreamOptions
): OrchestrationConfig {
  return !stream
    ? { modules: moduleConfigurations }
    : addStreamOptions(moduleConfigurations, streamOptions);
}
