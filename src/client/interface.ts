import { BaseLlmParameters, CustomRequestConfig } from '../core/http-client.js';
import { GenAiBaseLlmOutput } from './types.js';

/**
 * The base client interface for all provider specific clients.
 */
export interface BaseClient<T extends BaseLlmParameters> {
  /**
   * Creates a completion for the chat messages.
   * @param deploymentConfig - The deployment ID of the model to use.
   * @param body - The input parameters for the chat completion.
   * @param requestConfig - The request configuration.
   * @returns The completion result.
   */
  chatCompletion(
    data: T,
    requestConfig?: CustomRequestConfig
  ): Promise<GenAiBaseLlmOutput>;
  /**
   * Creates an embedding vector representing the given text.
   * @param deploymentConfig - The deployment ID of the model to use.
   * @param body - The input parameters for the chat completion.
   * @param requestConfig - The request configuration.
   * @returns The completion result.
   */
  embeddings(
    data: T,
    requestConfig?: CustomRequestConfig
  ): Promise<GenAiBaseLlmOutput>;
}
