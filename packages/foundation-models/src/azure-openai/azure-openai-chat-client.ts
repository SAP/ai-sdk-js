import { type CustomRequestConfig, executeRequest } from '@sap-ai-sdk/core';
import {
  getDeploymentId,
  getResourceGroup,
  type ModelDeployment
} from '@sap-ai-sdk/ai-api/internal.js';
import { apiVersion, type AzureOpenAiChatModel } from './model-types.js';
import { AzureOpenAiChatCompletionResponse } from './azure-openai-chat-completion-response.js';
import { Stream } from './azure-openai-streaming.js';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';
import type { AzureOpenAiCreateChatCompletionRequest } from './client/inference/schema/index.js';
import { createLogger } from '@sap-cloud-sdk/util';
import { AzureOpenAiChatCompletionStreamChunkResponse } from './azure-openai-chat-completion-stream-chunk-response.js';
import { AzureOpenAiChatCompletionStreamResponse } from './azure-openai-chat-completion-stream-response.js';

const logger = createLogger({
  package: 'foundation-models',
  messageContext: 'azure-openai-chat-client'
});

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

  private async fromSSEResponse(
    data: AzureOpenAiCreateChatCompletionRequest,
    requestConfig?: CustomRequestConfig
  ): Promise<Stream<any>> {
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
    return Stream.fromSSEResponse(response, new AbortController());
  }

  private async * pipeString(stream: Stream<any>) {
    for await (const chunk of stream) {
      // Process each item here
      const deltaContent = chunk.getDeltaContent();
      if (!deltaContent) {
        continue;
      }
      yield deltaContent;
    }
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
  ): Promise<Stream<any>> {
    const stream1 = await this.fromSSEResponse(data, requestConfig);
    const stream2 = new Stream<any>(() => this.pipeFinishReason(stream1), new AbortController());
    const stream3 = new Stream<any>(() => this.pipeTokenUsage(stream2), new AbortController());;
    return stream3;
  }

  /**
   * Creates a completion stream of the delta string for the chat messages.
   * @param data - The input parameters for the chat completion.
   * @param requestConfig - The request configuration.
   * @returns The completion stream of the delta string.
   */
  async streamString(
    data: AzureOpenAiCreateChatCompletionRequest,
    requestConfig?: CustomRequestConfig
  ): Promise<Stream<String>> {
    const stream1 = await this.stream(data, requestConfig);
    const stream2 = new Stream<String>(() => this.pipeString(stream1), new AbortController());
    return stream2;
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

  private async * pipeFinishReason(stream: Stream<any>) {
    for await (const chunk of stream) {
      const finishReason = chunk.getFinishReason();
      if (finishReason) {
        // streamResponse.finishReason = finishReason;
        // Do some callback maybe
        switch (finishReason) {
          case 'content_filter':
            throw new Error('Stream finished with content filter hit.');
          case 'length':
            throw new Error('Stream finished with token length exceeded.');
          case 'stop':
            logger.debug('Stream finished.');
            break;
          default:
            throw new Error(`Stream finished with unknown reason '${finishReason}'.`);
        }
      }
      yield chunk;
    }
  }

  private async * pipeTokenUsage(stream: Stream<any>) {
    for await (const chunk of stream) {
      const usage = chunk.getTokenUsage();
      if (usage) {
        // streamResponse.usage = usage;
        // Do some callback maybe
      }
      yield chunk;
    }
  }
}
