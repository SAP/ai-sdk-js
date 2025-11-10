import type {
  AiCoreOpenSourceChatModel,
  AwsBedrockChatModel,
  AzureOpenAiChatModel,
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
