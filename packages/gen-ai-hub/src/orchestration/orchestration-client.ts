import { CustomRequestConfig } from '@sap-cloud-sdk/http-client';
import { BaseLlmParameters, executeRequest } from '../core/index.js';
import {
  CompletionPostRequest,
  CompletionPostResponse
} from './api/schema/index.js';

/**
 * Input Parameters for GenAI hub chat completion.
 */
export type GenAiHubCompletionParameters = BaseLlmParameters & Pick<
  CompletionPostRequest,
  'orchestration_config'
>;

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
    const response = await executeRequest(
      { url: '/completion' },
      data,
      requestConfig
    );
    return response.data;
  }
}
