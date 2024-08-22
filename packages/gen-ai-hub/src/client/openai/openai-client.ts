import { HttpRequestConfig } from '@sap-cloud-sdk/http-client';
import { CustomRequestConfig, executeRequest } from '@sap-ai-sdk/core';
import {
  DeploymentResolver,
  FoundationModel,
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
    model: OpenAiChatModel | { name: OpenAiChatModel; version: string },
    data: OpenAiChatCompletionParameters,
    deploymentResolver?: DeploymentResolver,
    requestConfig?: CustomRequestConfig
  ): Promise<OpenAiChatCompletionOutput> {
    const deployment = await resolveOpenAiDeployment(model, deploymentResolver);
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
    model: OpenAiEmbeddingModel | { name: OpenAiEmbeddingModel; version: string },
    data: OpenAiEmbeddingParameters,
    deploymentResolver?: DeploymentResolver,
    requestConfig?: CustomRequestConfig
  ): Promise<OpenAiEmbeddingOutput> {
    const deployment = await resolveOpenAiDeployment(model, deploymentResolver);
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

async function resolveOpenAiDeployment(model: string | { name: string; version: string }, resolver?: DeploymentResolver) {
  if (typeof resolver === 'string') {
    return resolver;
  }
  const llm = typeof model === 'string' ? { name: model, version: 'latest' } : model;
  return (await resolveDeployment({
          scenarioId: 'foundation-models',
          executableId: 'azure-openai',
          model: llm
        })
      ).id;
}
