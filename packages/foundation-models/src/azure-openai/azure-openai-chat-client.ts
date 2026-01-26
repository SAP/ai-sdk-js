import { type CustomRequestConfig, executeRequest } from '@sap-ai-sdk/core';
import {
  getFoundationModelDeploymentId,
  getResourceGroup
} from '@sap-ai-sdk/ai-api/internal.js';
import { apiVersion, type AzureOpenAiChatModel } from './model-types.js';
import { AzureOpenAiChatCompletionResponse } from './azure-openai-chat-completion-response.js';
import { AzureOpenAiChatCompletionStreamResponse } from './azure-openai-chat-completion-stream-response.js';
import { AzureOpenAiChatCompletionStream } from './azure-openai-chat-completion-stream.js';
import type { AzureOpenAiChatCompletionParameters } from './azure-openai-chat-completion-types.js';
import type { ModelDeployment } from '@sap-ai-sdk/ai-api';
import type { AzureOpenAiChatCompletionStreamChunkResponse } from './azure-openai-chat-completion-stream-chunk-response.js';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

/**
 * Azure OpenAI client for chat completion.
 */
export class AzureOpenAiChatClient {
  /**
   * Creates an instance of the Azure OpenAI chat client.
   * @param modelDeployment - This configuration is used to retrieve a deployment. Depending on the configuration use either the given deployment ID or the model name to retrieve matching deployments. If model and deployment ID are given, the model is verified against the deployment.
   * @param destination - The destination to use for the request.
   */
  constructor(
    private modelDeployment: ModelDeployment<AzureOpenAiChatModel>,
    private destination?: HttpDestinationOrFetchOptions
  ) {}

  /**
   * Creates a completion for the chat messages.
   * @param request - Request containing chat completion input parameters.
   * @param requestConfig - The request configuration.
   * @returns The completion result.
   */
  async run(
    request: AzureOpenAiChatCompletionParameters,
    requestConfig?: CustomRequestConfig
  ): Promise<AzureOpenAiChatCompletionResponse> {
    const response = await this.executeRequest(request, requestConfig);
    return new AzureOpenAiChatCompletionResponse(response);
  }

  /**
   * Creates a completion stream for the chat messages.
   * @param request - Request containing chat completion input parameters.
   * @param signal - The abort signal.
   * @param requestConfig - The request configuration.
   * @returns A response containing the chat completion stream.
   */
  async stream(
    request: AzureOpenAiChatCompletionParameters,
    signal?: AbortSignal,
    requestConfig?: CustomRequestConfig
  ): Promise<
    AzureOpenAiChatCompletionStreamResponse<AzureOpenAiChatCompletionStreamChunkResponse>
  > {
    const controller = new AbortController();
    if (signal) {
      signal.addEventListener('abort', () => {
        controller.abort();
      });
    }
    const response =
      new AzureOpenAiChatCompletionStreamResponse<AzureOpenAiChatCompletionStreamChunkResponse>();
    response.stream = (
      await this.createStream(request, controller, requestConfig)
    )
      ._pipe(AzureOpenAiChatCompletionStream._processChunk)
      ._pipe(AzureOpenAiChatCompletionStream._processToolCalls, response)
      ._pipe(AzureOpenAiChatCompletionStream._processFinishReason, response)
      ._pipe(AzureOpenAiChatCompletionStream._processTokenUsage, response);
    return response;
  }

  private async executeRequest(
    request: AzureOpenAiChatCompletionParameters,
    requestConfig?: CustomRequestConfig
  ): Promise<HttpResponse> {
    const deploymentId = await getFoundationModelDeploymentId(
      this.modelDeployment,
      'azure-openai',
      this.destination
    );
    const resourceGroup = getResourceGroup(this.modelDeployment);
    return executeRequest(
      {
        url: `/inference/deployments/${deploymentId}/chat/completions`,
        apiVersion,
        resourceGroup
      },
      request,
      requestConfig,
      this.destination
    );
  }

  private async createStream(
    request: AzureOpenAiChatCompletionParameters,
    controller: AbortController,
    requestConfig?: CustomRequestConfig
  ): Promise<AzureOpenAiChatCompletionStream<any>> {
    const response = await this.executeRequest(
      {
        ...request,
        stream: true,
        stream_options: {
          include_usage: true
        }
      },
      {
        ...requestConfig,
        responseType: 'stream',
        signal: controller.signal
      }
    );
    return AzureOpenAiChatCompletionStream._create(response, controller);
  }
}
