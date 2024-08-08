import { executeRequest, CustomRequestConfig } from '../core/index.js';
import { CompletionPostRequest } from './api/schema/index.js';
import {
  GenAiHubCompletionParameters,
  GenAiHubCompletionResponse
} from './orchestration-types.js';

/**
 * Get the orchestration client.
 */
export class GenAiHubClient {
  /**
   * Creates a completion for the chat messages.
   * @param data - The input parameters for the chat completion.
   * @param optionalModuleConfig - Additional optional orchestration module configuration.
   * @param requestConfig - Request configuration.
   * @returns The completion result.
   */
  async chatCompletion(
    data: GenAiHubCompletionParameters,
    requestConfig?: CustomRequestConfig
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
  const result: CompletionPostRequest = {
    orchestration_config: {
      module_configurations: {
        templating_module_config: {
          template: input.prompt.template
        },
        llm_module_config: input.llmConfig
      },
      ...(input?.filterConfig && {
        filtering_module_config: input.filterConfig
      }),
      ...(input.prompt.template_params && {
        input_params: input.prompt.template_params
      }),
      ...(input.prompt.messages_history && {
        messages_history: input.prompt.messages_history
      })
    }
  };
  return result;
}
