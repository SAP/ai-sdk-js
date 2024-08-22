import { HttpRequestConfig } from '@sap-cloud-sdk/http-client';
import { CustomRequestConfig, executeRequest } from '@sap-ai-sdk/core';
import {
  DeploymentResolver,
  resolveDeployment
} from '../../utils/deployment-resolver.js';
import {
  OpenAiChatCompletionParameters,
  OpenAiEmbeddingParameters,
  OpenAiEmbeddingOutput,
  OpenAiChatCompletionOutput,
  OpenAiChatModel,
  OpenAiEmbeddingModel
} from './openai-types.js';

const apiVersion = '2024-02-01';

/**
 * OpenAI GPT Client.
 */
export class OpenAiClient {
  /**
   * Creates a completion for the chat messages.
   * @param model - The model to use for the chat completion.
   * @param data - The input parameters for the chat completion.
   * @param deploymentResolver - A deployment id or a function to retrieve it.
   * @param requestConfig - The request configuration.
   * @returns The completion result.
   */
  async chatCompletion(
    model: OpenAiChatModel,
    data: OpenAiChatCompletionParameters,
    deploymentResolver: DeploymentResolver = getDeploymentResolver(model),
    requestConfig?: CustomRequestConfig
  ): Promise<OpenAiChatCompletionOutput> {
    const deployment =
      typeof deploymentResolver === 'function'
        ? (await deploymentResolver()).id
        : deploymentResolver;
    const response = await executeRequest(
      {
        url: `/inference/deployments/${deployment}/chat/completions`,
        apiVersion
      },
      data,
      this.mergeRequestConfig(requestConfig)
    );
    return response.data;
  }
  /**
   * Creates an embedding vector representing the given text.
   * @param model - The model to use for the embedding computation.
   * @param data - The text to embed.
   * @param deploymentResolver - A deployment id or a function to retrieve it.
   * @param requestConfig - The request configuration.
   * @returns The completion result.
   */
  async embeddings(
    model: OpenAiEmbeddingModel,
    data: OpenAiEmbeddingParameters,
    deploymentResolver: DeploymentResolver = getDeploymentResolver(model),
    requestConfig?: CustomRequestConfig
  ): Promise<OpenAiEmbeddingOutput> {
    const deployment =
      typeof deploymentResolver === 'function'
        ? (await deploymentResolver()).id
        : deploymentResolver;
    const response = await executeRequest(
      { url: `/inference/deployments/${deployment}/embeddings`, apiVersion },
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
  return () =>
    resolveDeployment({
      scenarioId: 'foundation-models',
      executableId: 'azure-openai',
      modelName: model.name,
      modelVersion: model.version
    });
}
