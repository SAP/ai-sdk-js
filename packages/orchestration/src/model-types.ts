import type {
  AiCoreOpenSourceChatModel,
  AiCoreOpenSourceEmbeddingModel,
  AwsBedrockChatModel,
  AwsBedrockEmbeddingModel,
  AzureOpenAiChatModel,
  AzureOpenAiEmbeddingModel,
  GcpVertexAiChatModel,
  PerplexityChatModel
} from '@sap-ai-sdk/core';

/**
 * Supported chat models for orchestration.
 */
export type ChatModel =
  | AzureOpenAiChatModel
  | GcpVertexAiChatModel
  | AwsBedrockChatModel
  | PerplexityChatModel
  | AiCoreOpenSourceChatModel;

/**
 * Supported embedding models for orchestration.
 */
export type EmbeddingModel =
  | AzureOpenAiEmbeddingModel
  | AwsBedrockEmbeddingModel
  | AiCoreOpenSourceEmbeddingModel;
