import { type CustomRequestConfig, executeRequest } from '@sap-ai-sdk/core';
import {
  getDeploymentId,
  getResourceGroup,
  type ModelDeployment
} from '@sap-ai-sdk/ai-api/internal.js';
import { apiVersion, type AzureOpenAiChatModel } from './model-types.js';
import { AzureOpenAiChatCompletionResponse } from './azure-openai-chat-completion-response.js';
import { AzureOpenAiChatCompletionStreamResponse } from './azure-openai-chat-completion-stream-response.js';
import { ChatCompletionStream } from './azure-openai-chat-completion-stream.js';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';
import type { AzureOpenAiCreateChatCompletionRequest } from './client/inference/schema/index.js';

/**
 * Azure OpenAI client for chat completion.
 */
export class AzureOpenAiChatClient {
  /**
   * Creates an instance of the Azure OpenAI chat client.
   * @param modelDeployment - This configuration is used to retrieve a deployment. Depending on the configuration use either the given deployment ID or the model name to retrieve matching deployments. If model and deployment ID are given, the model is verified against the deployment.
   */
  constructor(private modelDeployment: ModelDeployment<AzureOpenAiChatModel>) { }

  /**
   * Creates a completion for the chat messages.
   * @param data - The input parameters for the chat completion.
   * @param requestConfig - The request configuration.
   * @returns The completion result.
   */
  async run(
    data: AzureOpenAiCreateChatCompletionRequest,
    requestConfig?: CustomRequestConfig
  ): Promise<AzureOpenAiChatCompletionResponse> {
    const response = await this.executeRequest(data, requestConfig);
    return new AzureOpenAiChatCompletionResponse(response);
  }

  private async createStream(
    data: AzureOpenAiCreateChatCompletionRequest,
    requestConfig?: CustomRequestConfig
  ): Promise<ChatCompletionStream> {
    // TODO: The return type `any` should actually be the type of the stream response.
    // But `createChatCompletionStreamResponse` is first available in Azure OpenAI spec preview version 2024-08-01.
    const response = await this.executeRequest({
      ...data,
      stream: true,
      stream_options: {
        include_usage: true
      }
    }, {
      ...requestConfig,
      responseType: 'stream'
    });
    return ChatCompletionStream.fromSSEResponse(response);
  }

  /**
   * Creates a completion stream for the chat messages.
   * @param data - The input parameters for the chat completion.
   * @param requestConfig - The request configuration.
   * @returns The completion stream.
   */
  async stream(
    data: AzureOpenAiCreateChatCompletionRequest,
    requestConfig?: CustomRequestConfig
  ): Promise<AzureOpenAiChatCompletionStreamResponse> {
    const response = new AzureOpenAiChatCompletionStreamResponse();
    response.stream = (await this.createStream(data, requestConfig))
      .pipe(ChatCompletionStream.processChunk, response)
      .pipe(ChatCompletionStream.processFinishReason, response)
      .pipe(ChatCompletionStream.processTokenUsage, response);
    return response;
  }

  /**
   * Creates a completion stream of the delta content for the chat messages.
   * @param data - The input parameters for the chat completion.
   * @param requestConfig - The request configuration.
   * @returns The completion stream of the delta content.
   */
  async streamContent(
    data: AzureOpenAiCreateChatCompletionRequest,
    requestConfig?: CustomRequestConfig
  ): Promise<AzureOpenAiChatCompletionStreamResponse> {
    const response = new AzureOpenAiChatCompletionStreamResponse();
    (await this.stream(data, requestConfig)).stream
      .pipe(ChatCompletionStream.processString, response);
    return response;
  }

  private async executeRequest(
    data: AzureOpenAiCreateChatCompletionRequest,
    requestConfig?: CustomRequestConfig
  ): Promise<HttpResponse> {
    const deploymentId = await getDeploymentId(
      this.modelDeployment,
      'azure-openai'
    );
    const resourceGroup = getResourceGroup(this.modelDeployment);
    return executeRequest(
      {
        url: `/inference/deployments/${deploymentId}/chat/completions`,
        apiVersion,
        resourceGroup
      },
      data,
      requestConfig
    );
  }
}
