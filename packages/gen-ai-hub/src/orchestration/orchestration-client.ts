import {
  BaseLlmParameters,
  executeRequest,
  CustomRequestConfig
} from '../core/index.js';
import {
  CompletionPostRequest,
  CompletionPostResponse
} from './api/schema/index.js';

/**
 * Input Parameters for GenAI hub chat completion.
 */
export type GenAiHubCompletionParameters = BaseLlmParameters &
  Pick<CompletionPostRequest, 'orchestration_config' | 'messages_history'>;

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
      ...data,
      input_params: {}
    };
    const response = await executeRequest(
      { url: '/completion' },
      dataWithInputParams,
      requestConfig
    );
    return response.data;
  }
}
