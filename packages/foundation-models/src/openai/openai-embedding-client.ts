import { type CustomRequestConfig, executeRequest } from '@sap-ai-sdk/core';
import {
  getDeploymentId,
  type ModelDeployment
} from '@sap-ai-sdk/ai-api/internal.js';
import type { AzureOpenAiEmbeddingModel } from '../model-types.js';
import type {
  OpenAiEmbeddingParameters,
  OpenAiEmbeddingOutput
} from './openai-types.js';

const apiVersion = '2024-02-01';

/**
 * OpenAI client for embeddings.
 */
export class OpenAiEmbeddingClient {
  /**
   * Creates an instance of the OpenAI embedding client.
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
    data: OpenAiEmbeddingParameters,
    requestConfig?: CustomRequestConfig
  ): Promise<OpenAiEmbeddingOutput> {
    const deploymentId = await getDeploymentId(
      this.modelDeployment,
      'azure-openai'
    );
    const response = await executeRequest(
      { url: `/inference/deployments/${deploymentId}/embeddings`, apiVersion },
      data,
      requestConfig
    );
    return response.data;
  }
}
