import { executeRequest, CustomRequestConfig } from '../core/index.js';
import { CompletionPostRequest, Filter } from './api/schema/index.js';
import {
  FilterConfig,
  FilterModuleConfig,
  FilterServiceProvider,
  filterServiceProviders,
  GenAiHubCompletionParameters,
  GenAiHubCompletionResponse,
  MaskingModuleConfig
} from './orchestration-types.js';

/**
 * Get the orchestration client.
 */
export class GenAiHubClient {
  /**
   * Creates a completion for the chat messages.
   * @param data - The input parameters for the chat completion.
   * @param requestConfig - Request configuration.
   * @returns The completion result.
   */
  async chatCompletion(
    data: GenAiHubCompletionParameters,
    requestConfig?: CustomRequestConfig,
    ...varags: [FilterModuleConfig | MaskingModuleConfig]
  ): Promise<GenAiHubCompletionResponse> {
    const dataWithInputParams = {
      deploymentConfiguration: data.deploymentConfiguration,
      ...constructCompletionPostRequest(data)
    };

    const response = await executeRequest(
      { url: '/completion' },
      dataWithInputParams,
      requestConfig
    );
    return response.data;
  }
}

/**
 * @internal
 */
export function constructCompletionPostRequest(
  input: GenAiHubCompletionParameters
): CompletionPostRequest {
  return {
    orchestration_config: {
      module_configurations: {
        templating_module_config: {
          template: input.prompt.template
        },
        llm_module_config: input.llmConfig
      },
      ...(input.filterConfig &&
        input.filterConfig?.input &&
        input.filterConfig?.output &&
        buildFilterConfig(input.filterConfig)),
      ...(input.prompt.template_params && {
        input_params: input.prompt.template_params
      }),
      ...(input.prompt.messages_history && {
        messages_history: input.prompt.messages_history
      })
    }
  };
}

function buildFilterConfig(config: FilterConfig) {
  const inputFilters = createFilters(config?.input);
  const outputFilters = createFilters(config?.output);
  if (inputFilters.length === 0 && outputFilters.length === 0) {
    return;
  }
  return {
    filtering_module_config: {
      ...(inputFilters.length > 0 && { input: { filters: inputFilters } }),
      ...(outputFilters.length > 0 && { output: { filters: outputFilters } })
    }
  };
}

function createFilters(config: FilterServiceProvider | undefined): Filter[] {
  return config
    ? Object.entries(config).map(([key, value]) => ({
        type: filterServiceProviders[key],
        config: value
      }))
    : [];
}
