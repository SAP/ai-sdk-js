import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import { DefaultApi } from './api/default-api.js';
import { CompletionPostRequest } from './api/schema/index.js';

export type OrchestrationCompletionParameters = Pick<
  CompletionPostRequest,
  'orchestration_config' | 'return_module_results'
>;

/**
 * Get the orchestration client.
 */
export class OrchestrationClient {
  async chatCompletion(
    destination: HttpDestination,
    body: OrchestrationCompletionParameters
  ) {
    const response = await DefaultApi.orchestrationV1EndpointsCreate({
      ...body,
      input_params: {}
    }).execute(destination);

    return response.data;
  }
}
