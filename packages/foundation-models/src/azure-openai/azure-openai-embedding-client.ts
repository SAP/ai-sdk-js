import { type CustomRequestConfig, executeRequest } from '@sap-ai-sdk/core';
import {
  getDeploymentId,
  getResourceGroup,
  type ModelDeployment
} from '@sap-ai-sdk/ai-api/internal.js';
import { AzureOpenAiEmbeddingResponse } from './azure-openai-embedding-response.js';
import type { AzureOpenAiEmbeddingParameters } from './azure-openai-embedding-types.js';
import { apiVersion, type AzureOpenAiEmbeddingModel } from './model-types.js';

/**
 * Azure OpenAI client for embeddings.
 */
export class AzureOpenAiEmbeddingClient {
  /**
   * Creates an instance of the Azure OpenAI embedding client.
   * @param modelDeployment - This configuration is used to retrieve a deployment. Depending on the configuration use either the given deployment ID or the model name to retrieve matching deployments. If model and deployment ID are given, the model is verified against the deployment.
   */

  constructor(
    private modelDeployment: ModelDeployment<AzureOpenAiEmbeddingModel>
  ) {}

  /**
   * Creates an embedding vector representing the given text.
   * @param data - The text to embed.
   * @param requestConfig - The request configuration.
   * @returns The completion result.
   */
  async run(
    data: AzureOpenAiEmbeddingParameters,
    requestConfig?: CustomRequestConfig
  ): Promise<AzureOpenAiEmbeddingResponse> {
    const deploymentId = await getDeploymentId(
      this.modelDeployment,
      'azure-openai'
    );
    const resourceGroup = getResourceGroup(this.modelDeployment);
    const response = await executeRequest(
      {
        url: `/inference/deployments/${deploymentId}/embeddings`,
        apiVersion,
        resourceGroup
      },
      data,
      requestConfig
    );
    return new AzureOpenAiEmbeddingResponse(response);
  }
}
