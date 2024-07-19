import {
  BaseLlmParameters,
  executeRequest,
  CustomRequestConfig
} from '../core/index.js';
import {
  ChatMessages,
  CompletionPostResponse,
  CompletionPostRequest,
  InputParamsEntry
} from './api/schema/index.js';

/**
 * Input Parameters for Orchestration completion.
 */
export interface OrchestrationCompletionParameters {
  /**
   * The model name.
   */
  model_name: string;
  /**
   * The max tokens.
   */
  max_tokens?: number;
  /**
   * The temperature.
   */
  temperature?: number;
  /**
   * The model version.
   */
  model_version?: string;
  /**
   * The template.// Todo: refer llm_document.
   */
  prompt_templates: ChatMessages;
  /**
   * The model name.// Todo: refer llm_document.
   */
  template_params?: Record<string, InputParamsEntry>;
  /**
   * The model name.// Todo: refer llm_document.
   */
  messages_history?: ChatMessages;
}
/**
 * Input Parameters for GenAI hub chat completion.
 */
export type GenAiHubCompletionParameters = BaseLlmParameters &
  OrchestrationCompletionParameters;

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
    requestConfig?: CustomRequestConfig
  ): Promise<CompletionPostResponse> {
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
          template: input.prompt_templates
        },
        llm_module_config: {
          model_name: input.model_name,
          model_params: {
            ...(input?.max_tokens && { max_tokens: input.max_tokens }),
            ...(input?.temperature && { temperature: input.temperature })
          },
          ...(input?.model_version && { model_version: input.model_version })
        }
      }
    },
    input_params: input?.template_params,
    messages_history: input.messages_history
  };
}
