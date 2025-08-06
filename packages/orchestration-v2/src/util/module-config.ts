import { createLogger } from '@sap-cloud-sdk/util';
import type {
  Prompt,
  StreamOptions,
  OrchestrationModuleConfig
} from '../orchestration-types.js';
import type {
  CompletionPostRequest,
  FilteringStreamOptions,
  ModuleConfigs,
  OrchestrationConfig,
  OutputFilteringConfig,
  GlobalStreamOptions,
  Template,
  PromptTemplatingModuleConfig,
  TemplateRef
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
  prompt?: Prompt,
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
    placeholder_values: prompt?.placeholder_values || {},
    config
  };
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
 */
export function addStreamOptions(
  moduleConfigs: ModuleConfigs,
  streamOptions?: StreamOptions
): OrchestrationConfig {
  const { prompt_templating, filtering } = moduleConfigs;
  const outputFiltering = streamOptions?.outputFiltering;
  const globalStreamOptions = streamOptions?.global;

  if (!moduleConfigs?.filtering?.output && outputFiltering) {
    logger.warn(
      'Output filter stream options are not applied because filtering module is not configured.'
    );
  }

  return {
    stream: {
      ...(globalStreamOptions || {}),
      enabled: true
    },
    modules: {
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
    }
  };
}

/**
 * @internal
 */
export function constructCompletionPostRequest(
  config: OrchestrationModuleConfig,
  prompt?: Prompt,
  stream?: boolean,
  streamOptions?: StreamOptions
): CompletionPostRequest {
  const { promptTemplating, filtering, masking, grounding, translation } =
    config;

  // Templating is not a string here as it is already parsed in `parseAndMergeTemplating` method
  const promptTemplate = {
    ...(promptTemplating.prompt as Template | TemplateRef)
  };

  // If promptTemplating.prompt is not defined, we initialize it with an empty Template object
  promptTemplating.prompt = promptTemplating.prompt || { template: [] };

  if (isTemplate(promptTemplate)) {
    if (!promptTemplate.template?.length && !prompt?.messages?.length) {
      throw new Error('Either a prompt template or messages must be defined.');
    }
    promptTemplate.template = [
      ...(promptTemplate.template || []),
      ...(prompt?.messages || [])
    ];
  }

  const moduleConfigurations: ModuleConfigs = {
    prompt_templating: {
      ...promptTemplating,
      prompt: promptTemplate
    },
    ...(filtering && Object.keys(filtering).length && { filtering }),
    ...(masking && Object.keys(masking).length && { masking }),
    ...(grounding && Object.keys(grounding).length && { grounding }),
    ...(translation && Object.keys(translation).length && { translation })
  };

  return {
    config: stream
      ? addStreamOptions(
          moduleConfigurations,
          mergeStreamOptions(config.streaming, streamOptions)
        )
      : { modules: moduleConfigurations },
    ...(prompt?.placeholder_values && {
      placeholder_values: prompt.placeholder_values
    }),
    ...(prompt?.messagesHistory && {
      messages_history: prompt.messagesHistory
    })
  };
}

function mergeStreamOptions(
  globalOptions?: GlobalStreamOptions,
  streamOptions?: StreamOptions
): StreamOptions {
  return {
    ...streamOptions,
    ...((globalOptions || streamOptions?.global) && {
      global: {
        ...globalOptions,
        ...streamOptions?.global
      }
    })
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
