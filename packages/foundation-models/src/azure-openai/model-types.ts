import type {
  AzureOpenAiChatModel as CoreAzureOpenAiChatModel,
  AzureOpenAiEmbeddingModel as CoreAzureOpenAiEmbeddingModel
} from '@sap-ai-sdk/core';

/**
 * @internal
 */
export const apiVersion = '2024-06-01';
/**
 * Azure OpenAI models for chat completion.
 */
export type AzureOpenAiChatModel = CoreAzureOpenAiChatModel;

/**
 * Azure OpenAI models for embedding.
 */
export type AzureOpenAiEmbeddingModel = CoreAzureOpenAiEmbeddingModel;
