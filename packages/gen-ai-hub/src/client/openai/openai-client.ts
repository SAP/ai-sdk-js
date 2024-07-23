import {
  BaseLlmParameters,
  CustomRequestConfig,
  executeRequest
} from '../../core/index.js';
import { BaseClient } from '../interface.js';
import {
  OpenAiChatCompletionParameters,
  OpenAiEmbeddingParameters,
  OpenAiEmbeddingOutput,
  OpenAiChatCompletionOutput
} from './openai-types.js';

const apiVersion = '2024-02-01';

/**
 * OpenAI GPT Client.
 */
export class OpenAiClient implements BaseClient<BaseLlmParameters> {
  /**
   * Creates a completion for the chat messages.
   * @param data - The input parameters for the chat completion.
   * @param requestConfig - The request configuration.
   * @returns The completion result.
   */
  async chatCompletion(
    data: OpenAiChatCompletionParameters,
    requestConfig?: CustomRequestConfig
  ): Promise<OpenAiChatCompletionOutput> {
    const response = await executeRequest(
      { url: '/chat/completions', apiVersion },
      data,
      requestConfig
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
    data: OpenAiEmbeddingParameters,
    requestConfig?: CustomRequestConfig
  ): Promise<OpenAiEmbeddingOutput> {
    const response = await executeRequest(
      { url: '/embeddings', apiVersion },
      data,
      requestConfig
    );
    return response.data;
  }
}
