import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import { DefaultApi } from './api/default-api.js';
import { CompletionPostRequest } from './api/schema/index.js';
import { CustomRequestConfig } from '../core/http-client.js';

export type OrchestrationCompletionParameters = Pick<
  CompletionPostRequest,
  'orchestration_config' | 'return_module_results'
>;

/**
 * Get the orchestration client.
 */
export class OrchestrationClient {
    destination: HttpDestination;
    constructor(destination: HttpDestination) {
        this.destination = destination;
    }
  async chatCompletion(
    body: OrchestrationCompletionParameters,
    requestConfig: CustomRequestConfig
  ) {
    const response = await DefaultApi.orchestrationV1EndpointsCreate({
      ...body,
      input_params: {}
    })
    .addCustomRequestConfiguration(requestConfig)
    .execute(this.destination,);

    return response.data;
  }
}
