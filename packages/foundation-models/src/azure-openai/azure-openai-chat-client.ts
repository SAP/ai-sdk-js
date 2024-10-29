import { type CustomRequestConfig, executeRequest } from '@sap-ai-sdk/core';
import {
  getDeploymentId,
  getResourceGroup,
  type ModelDeployment
} from '@sap-ai-sdk/ai-api/internal.js';
import { apiVersion, type AzureOpenAiChatModel } from './model-types.js';
import { AzureOpenAiChatCompletionResponse } from './azure-openai-chat-completion-response.js';
import { AzureOpenAiChatCompletionStreamResponse } from './azure-openai-chat-completion-stream-response.js';
import { AzureOpenAiChatCompletionStream } from './azure-openai-chat-completion-stream.js';
import type { AzureOpenAiChatCompletionStreamChunkResponse } from './azure-openai-chat-completion-stream-chunk-response.js';
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
  constructor(private modelDeployment: ModelDeployment<AzureOpenAiChatModel>) {}

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

  /**
   * Creates a completion stream for the chat messages.
   * @param data - The input parameters for the chat completion.
   * @param requestConfig - The request configuration.
   * @returns The completion stream.
   */
  async stream(
    data: AzureOpenAiCreateChatCompletionRequest,
    requestConfig?: CustomRequestConfig
  ): Promise<
    AzureOpenAiChatCompletionStreamResponse<AzureOpenAiChatCompletionStreamChunkResponse>
  > {
    const response =
      new AzureOpenAiChatCompletionStreamResponse<AzureOpenAiChatCompletionStreamChunkResponse>();
    response.stream = (await this.createStream(data, requestConfig))
      .pipe(AzureOpenAiChatCompletionStream.processChunk)
      .pipe(AzureOpenAiChatCompletionStream.processFinishReason, response)
      .pipe(AzureOpenAiChatCompletionStream.processTokenUsage, response);
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
  ): Promise<AzureOpenAiChatCompletionStreamResponse<string>> {
    const response = new AzureOpenAiChatCompletionStreamResponse<string>();
    response.stream = (await this.createStream(data, requestConfig))
      .pipe(AzureOpenAiChatCompletionStream.processChunk)
      .pipe(AzureOpenAiChatCompletionStream.processFinishReason, response)
      .pipe(AzureOpenAiChatCompletionStream.processTokenUsage, response)
      .pipe(AzureOpenAiChatCompletionStream.processContent, response);
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

  private async createStream(
    data: AzureOpenAiCreateChatCompletionRequest,
    requestConfig?: CustomRequestConfig
  ): Promise<AzureOpenAiChatCompletionStream<any>> {
    const response = await this.executeRequest(
      {
        ...data,
        stream: true,
        stream_options: {
          include_usage: true
        }
      },
      {
        ...requestConfig,
        responseType: 'stream'
      }
    );
    return AzureOpenAiChatCompletionStream.create(response);
  }
}
