import { getResourceGroup } from '@sap-ai-sdk/ai-api/internal.js';
import { getFoundationModelDeploymentId } from '@sap-ai-sdk/foundation-models/internal.js';
// import { apiVersion } from './model-types.js';
import { RptApi } from './index.js';
import type {
  PredictRequestPayload,
  PredictResponsePayload
} from './client/rpt/index.js';
import type { SAPRptModel } from '@sap-ai-sdk/core/internal.js';
import type { ModelDeployment } from '@sap-ai-sdk/ai-api';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

export class RptClient {
  /**
   * Creates an instance of the RPT client.
   * @param modelDeployment - This configuration is used to retrieve a deployment. Depending on the configuration use either the given deployment ID or the model name to retrieve matching deployments. If model and deployment ID are given, the model is verified against the deployment.
   * @param destination - The destination to use for the request.
   */
  constructor(
    private modelDeployment: ModelDeployment<SAPRptModel> = 'sap-rpt-1-small',
    private destination?: HttpDestinationOrFetchOptions
  ) {}

  async predict(body: PredictRequestPayload): Promise<PredictResponsePayload> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    const deploymentId = await getFoundationModelDeploymentId(
      this.modelDeployment,
      'aicore-sap',
      this.destination
    );

    // eslint-disable-next-line jsdoc/require-jsdoc
    const resourceGroup = getResourceGroup(this.modelDeployment);
    // return executeRequest(
    //   {
    //     url: `/inference/deployments/${deploymentId}/${path}`,
    //     apiVersion,
    //     resourceGroup
    //   },
    //   request,
    //   requestConfig,
    //   this.destination
    // );
    return RptApi.predict(body)
      .setBasePath(`/inference/deployments/${deploymentId}`)
      .addCustomHeaders({ 'ai-resource-group': resourceGroup || 'default' })
      .execute(this.destination);
  }

  // /**
  //  * //  * Creates a completion for the chat messages.
  //  * //  * @param request - Request containing chat completion input parameters.
  //  * //  * @param requestConfig - The request configuration.
  //  * //  * @returns The completion result.
  // //.
  //  */
  // // async run(
  // //   request: AzureOpenAiChatCompletionParameters,
  // //   requestConfig?: CustomRequestConfig
  // // ): Promise<AzureOpenAiChatCompletionResponse> {
  // //   const response = await this.executeRequest(request, requestConfig);
  // //   return new AzureOpenAiChatCompletionResponse(response);
  // // }

  // private async executeRequest(
  //   path: string,
  //   request: PredictRequestPayload,
  //   requestConfig?: CustomRequestConfig
  // ): Promise<HttpResponse> {
  //   // eslint-disable-next-line jsdoc/require-jsdoc
  //   const deploymentId = await getFoundationModelDeploymentId(
  //     this.modelDeployment,
  //     'aicore-sap',
  //     this.destination
  //   );
  //   // eslint-disable-next-line jsdoc/require-jsdoc
  //   const resourceGroup = getResourceGroup(this.modelDeployment);
  //   return executeRequest(
  //     {
  //       url: `/inference/deployments/${deploymentId}/${path}`,
  //       apiVersion,
  //       resourceGroup
  //     },
  //     request,
  //     requestConfig,
  //     this.destination
  //   );
  // }
}
