import { createLogger } from '@sap-cloud-sdk/util';
import type {
  Prompt,
  StreamOptions,
  OrchestrationModuleConfig,
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
  let orchestration_config = { ...config };
  if (stream) {
    orchestration_config = {
      ...orchestration_config,
      stream: {
        ...(orchestration_config.stream || {}),
        enabled: true
      }
    };
  } else {
    delete orchestration_config.stream;
  }

  return {
    messages_history: prompt?.messagesHistory || [],
    input_params: prompt?.inputParams || {},
    config: orchestration_config
  };
}

/**
 * @internal
 */
export function addStreamOptionsToPromptTemplatingModuleConfig(
  promptTemplatingModuleConfig: PromptTemplatingModuleConfig,
  streamOptions?: StreamOptions
): PromptTemplatingModuleConfig {
  if (streamOptions?.prompt_templating === null) {
    return promptTemplatingModuleConfig;
  }
  return {
    ...promptTemplatingModuleConfig,
    model: {
      ...promptTemplatingModuleConfig.model,
      params: {
        ...(promptTemplatingModuleConfig.model.params || {}),
        ...(streamOptions?.prompt_templating !== null && {
          stream_options: {
            include_usage: true,
            ...(promptTemplatingModuleConfig.model.params?.stream_options || {}),
            ...(streamOptions?.prompt_templating || {})
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
      enabled: true,
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
  const { prompt_templating, filtering, masking, grounding, translation } = config;

  // Templating is not a string here as it is already parsed in `parseAndMergeTemplating` method
  const promptTemplate = { ...(prompt_templating.prompt as Template | TemplateRef) };

  // If prompt_templating.prompt is not defined, we initialize it with an empty Template object
  prompt_templating.prompt = prompt_templating.prompt || { template: [] };

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
      ...prompt_templating,
      prompt: promptTemplate,
    },
    filtering,
    masking,
    grounding,
    translation
  };

  return {
    config: stream
      ? addStreamOptions(
          moduleConfigurations,
          mergeStreamOptions(config.streaming, streamOptions)
        )
      : { modules: moduleConfigurations },
    ...(prompt?.inputParams && {
      input_params: prompt.inputParams
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
