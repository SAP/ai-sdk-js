import { type CustomRequestConfig, executeRequest } from '@sap-ai-sdk/core';
import {
  getDeploymentId,
  type ModelDeployment
} from '../../utils/deployment-resolver.js';
import type {
  OpenAiChatCompletionParameters,
  OpenAiEmbeddingParameters,
  OpenAiEmbeddingOutput,
  OpenAiChatModel,
  OpenAiEmbeddingModel
} from './openai-types.js';
import { OpenAiChatCompletionResponse } from './openai-response.js';

const apiVersion = '2024-02-01';

/**
 * OpenAI Client.
 */
export class OpenAiClient {
  /**
   * Creates a completion for the chat messages.
   * @param data - The input parameters for the chat completion.
   * @param modelDeployment - This configuration is used to retrieve a deployment. Depending on the configuration use either the given deployment ID or the model name to retrieve matching deployments. If model and deployment ID are given, the model is verified against the deployment.
   * @param requestConfig - The request configuration.
   * @returns The completion result.
   */
  async chatCompletion(
    data: OpenAiChatCompletionParameters,
    modelDeployment: ModelDeployment<OpenAiChatModel>,
    requestConfig?: CustomRequestConfig
  ): Promise<OpenAiChatCompletionResponse> {
    const deploymentId = await getDeploymentId(
      modelDeployment,
      'azure-openai',
      requestConfig
    );
    const response = await executeRequest(
      {
        url: `/inference/deployments/${deploymentId}/chat/completions`,
        apiVersion
      },
      data,
      requestConfig
    );
    return new OpenAiChatCompletionResponse(response);
  }

  /**
   * Creates an embedding vector representing the given text.
   * @param data - The text to embed.
   * @param modelDeployment - This configuration is used to retrieve a deployment. Depending on the configuration use either the given deployment ID or the model name to retrieve matching deployments. If model and deployment ID are given, the model is verified against the deployment.
   * @param requestConfig - The request configuration.
   * @returns The completion result.
   */
  async embeddings(
    data: OpenAiEmbeddingParameters,
    modelDeployment: ModelDeployment<OpenAiEmbeddingModel>,
    requestConfig?: CustomRequestConfig
  ): Promise<OpenAiEmbeddingOutput> {
    const deploymentId = await getDeploymentId(
      modelDeployment,
      'azure-openai',
      requestConfig
    );
    const response = await executeRequest(
      { url: `/inference/deployments/${deploymentId}/embeddings`, apiVersion },
      data,
      requestConfig
    );
    return response.data;
  }
}
