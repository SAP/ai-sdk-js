import { type HttpRequestConfig } from '@sap-cloud-sdk/http-client';
import { type CustomRequestConfig, executeRequest } from '@sap-ai-sdk/core';
import { mergeIgnoreCase, pickValueIgnoreCase } from '@sap-cloud-sdk/util';
import {
  type ModelDeployment,
  type FoundationModel,
  type Model,
  isDeploymentIdConfiguration,
  resolveDeployment
} from '../../utils/deployment-resolver.js';
import {
  type OpenAiChatCompletionParameters,
  type OpenAiEmbeddingParameters,
  type OpenAiEmbeddingOutput,
  type OpenAiChatCompletionOutput,
  type OpenAiChatModel,
  type OpenAiEmbeddingModel
} from './openai-types.js';

const apiVersion = '2024-02-01';

/**
 * OpenAI Client.
 */
export class OpenAiClient {
  /**
   * Creates a completion for the chat messages.
   * @param data - The input parameters for the chat completion.
   * @param deploymentConfig - This configuration is used to retrieve a deployment. Depending on the configuration use either the given deployment ID or the model name to retrieve matching deployments. If model and deployment ID are given, the model is verified against the deployment.
   * @param requestConfig - The request configuration.
   * @returns The completion result.
   */
  async chatCompletion(
    data: OpenAiChatCompletionParameters,
    deploymentConfig: ModelDeployment<OpenAiChatModel>,
    requestConfig?: CustomRequestConfig
  ): Promise<OpenAiChatCompletionOutput> {
    const deploymentId = await getDeploymentId(deploymentConfig, requestConfig);
    const response = await executeRequest(
      {
        url: `/inference/deployments/${deploymentId}/chat/completions`,
        apiVersion
      },
      data,
      mergeRequestConfig(requestConfig)
    );
    return response.data;
  }

  /**
   * Creates an embedding vector representing the given text.
   * @param data - The text to embed.
   * @param deploymentConfig - This configuration is used to retrieve a deployment. Depending on the configuration use either the given deployment ID or the model name to retrieve matching deployments. If model and deployment ID are given, the model is verified against the deployment.
   * @param requestConfig - The request configuration.
   * @returns The completion result.
   */
  async embeddings(
    data: OpenAiEmbeddingParameters,
    deploymentConfig: ModelDeployment<OpenAiEmbeddingModel>,
    requestConfig?: CustomRequestConfig
  ): Promise<OpenAiEmbeddingOutput> {
    const deploymentId = await getDeploymentId(deploymentConfig);
    const response = await executeRequest(
      { url: `/inference/deployments/${deploymentId}/embeddings`, apiVersion },
      data,
      mergeRequestConfig(requestConfig)
    );
    return response.data;
  }
}

async function getDeploymentId(
  deploymentConfig: ModelDeployment,
  requestConfig?: CustomRequestConfig
) {
  if (isDeploymentIdConfiguration(deploymentConfig)) {
    return deploymentConfig.deploymentId;
  }

  return (
    await resolveDeployment({
      scenarioId: 'foundation-models',
      executableId: 'azure-openai',
      model: translateToFoundationModel(deploymentConfig),
      groupId: pickValueIgnoreCase(requestConfig?.headers, 'ai-resource-group')
    })
  ).id;
}

function translateToFoundationModel(modelConfig: Model): FoundationModel {
  if (typeof modelConfig === 'string') {
    return { name: modelConfig };
  }

  return {
    name: modelConfig.modelName,
    ...(modelConfig.modelVersion && { version: modelConfig.modelVersion })
  };
}

function mergeRequestConfig(
  requestConfig?: CustomRequestConfig
): HttpRequestConfig {
  return {
    method: 'POST',
    ...requestConfig,
    headers: mergeIgnoreCase(
      {
        'content-type': 'application/json'
      },
      requestConfig?.headers
    ),
    params: mergeIgnoreCase(
      { 'api-version': apiVersion },
      requestConfig?.params
    )
  };
}
