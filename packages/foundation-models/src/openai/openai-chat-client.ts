import {
  type CustomRequestConfig,
  type AzureOpenAiChatModel,
  executeRequest
} from '@sap-ai-sdk/core';
import {
  getDeploymentId,
  type ModelDeployment
} from '@sap-ai-sdk/ai-api/internal.js';
import type { OpenAiChatCompletionParameters } from './openai-types.js';
import { OpenAiChatCompletionResponse } from './openai-response.js';

const apiVersion = '2024-02-01';

/**
 * OpenAI client for chat completion.
 */
export class OpenAiChatClient {
  /**
   * Creates an instance of the OpenAI chat client.
   * @param modelDeployment - This configuration is used to retrieve a deployment. Depending on the configuration use either the given deployment ID or the model name to retrieve matching deployments. If model and deployment ID are given, the model is verified against the deployment.
   */
  constructor(private modelDeployment: ModelDeployment<AzureOpenAiChatModel>) {}

  /**
   * Creates a completion for the chat messages.
   * @param data - The input parameters for the chat completion.
   * @param requestConfig - The request configuration.
   * @returns The completion result.
   */
  async run(
    data: OpenAiChatCompletionParameters,
    requestConfig?: CustomRequestConfig
  ): Promise<OpenAiChatCompletionResponse> {
    const deploymentId = await getDeploymentId(
      this.modelDeployment,
      'azure-openai'
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
}
