import type {
  AzureOpenAiChatModel as CoreAzureOpenAiChatModel,
  AzureOpenAiEmbeddingModel as CoreAzureOpenAiEmbeddingModel
} from '@sap-ai-sdk/core';

/**
 * @internal
 */
export const apiVersion = '2024-12-01-preview';
/**
 * Azure OpenAI models for chat completion.
 */
export type AzureOpenAiChatModel = CoreAzureOpenAiChatModel;

/**
 * Azure OpenAI models for embedding.
 */
export type AzureOpenAiEmbeddingModel = CoreAzureOpenAiEmbeddingModel;
