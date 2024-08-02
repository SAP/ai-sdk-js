import { HttpRequestConfig } from '@sap-cloud-sdk/http-client';
import {
  CustomRequestConfig,
  DeploymentResolver,
  executeRequest,
  resolveDeployment
} from '../../core/index.js';
import {
  OpenAiChatCompletionParameters,
  OpenAiEmbeddingParameters,
  OpenAiEmbeddingOutput,
  OpenAiChatCompletionOutput,
  OpenAiChatModel,
  OpenAiEmbeddingModel
} from './openai-types.js';
import { get } from 'http';

const apiVersion = '2024-02-01';

/**
 * OpenAI GPT Client.
 */
export class OpenAiClient {
  /**
   * Creates a completion for the chat messages.
   * @param data - The input parameters for the chat completion.
   * @param requestConfig - The request configuration.
   * @returns The completion result.
   */
  async chatCompletion(
    model: OpenAiChatModel,
    data: OpenAiChatCompletionParameters,
    deploymentResolver: DeploymentResolver = getDeploymentResolver(model),
    requestConfig?: CustomRequestConfig
  ): Promise<OpenAiChatCompletionOutput> {
    const deployment = typeof deploymentResolver === 'function' ? await deploymentResolver() : deploymentResolver;
    const response = await executeRequest(
      { deploymentId: deployment.id, path: '/chat/completions' },
      data,
      this.mergeRequestConfig(requestConfig)
    );
    return response.data;
  }
  /**
   * Creates an embedding vector representing the given text.
   * @param data - The input parameters for the chat completion.
   * @param requestConfig - The request configuration.
   * @returns The completion result.
   */
  async embeddings(
    model: OpenAiEmbeddingModel,
    data: OpenAiEmbeddingParameters,
    deploymentResolver: DeploymentResolver = getDeploymentResolver(model),
    requestConfig?: CustomRequestConfig
  ): Promise<OpenAiEmbeddingOutput> {
    const deployment =  typeof deploymentResolver === 'function' ? await deploymentResolver() : deploymentResolver;
    const response = await executeRequest(
      { deploymentId: deployment.id, path: '/embeddings' },
      data,
      this.mergeRequestConfig(requestConfig)
    );
    return response.data;
  }

  mergeRequestConfig(requestConfig?: CustomRequestConfig): HttpRequestConfig {
    return {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      params: { 'api-version': apiVersion },
      ...requestConfig
    };
  }
}

function getDeploymentResolver(model: OpenAiChatModel | OpenAiEmbeddingModel) {
  return  () => resolveDeployment({ scenarioId: 'foundation-models', executableId: 'azure-openai', modelName: model.name, modelVersion: model.version });
} 