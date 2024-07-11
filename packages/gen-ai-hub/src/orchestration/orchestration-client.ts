import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import { DefaultApi } from './api/default-api.js';
import { CompletionPostRequest, CompletionPostResponse } from './api/schema/index.js';
import { CustomRequestConfig } from '../core/http-client.js';

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
  async chatCompletion(
    body: GenAiHubCompletionParameters,
    requestConfig: CustomRequestConfig
  ): Promise<CompletionPostResponse> {
    return DefaultApi.orchestrationV1EndpointsCreate({
      ...body,
      input_params: {}
    })
    .addCustomRequestConfiguration(requestConfig)
    .execute(this.destination,);
  }
}
