import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import { CustomRequestConfig } from '@sap-cloud-sdk/http-client';
import { DefaultApi } from './api/default-api.js';
import {
  CompletionPostRequest,
  CompletionPostResponse
} from './api/schema/index.js';

/**
 * Input Parameters for GenAI hub chat completion.
 */
export type GenAiHubCompletionParameters = Pick<
  CompletionPostRequest,
  'orchestration_config' | 'return_module_results'
>;

/**
 * Get the orchestration client.
 */
export class GenAiHubClient {
  destination: HttpDestination;
  constructor(destination: HttpDestination) {
    this.destination = destination;
  }
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
    this.destination = {
      ...this.destination,
      headers: {
        'ai-resource-group': 'default',
        ...this.destination?.headers
      }
    };
    return DefaultApi.orchestrationV1EndpointsCreate({
      ...data,
      input_params: {}
      })
      .skipCsrfTokenFetching()
      .addCustomHeaders(requestConfig?.headers ?? {})
      .execute(this.destination);
  }
}
