import type {
  AiCoreOpenSourceChatModel,
  AwsBedrockChatModel,
  AzureOpenAiChatModel,
  GcpVertexAiChatModel
} from '@sap-ai-sdk/core';

/**
 * Supported chat models for orchestration.
 */
export type ChatModel =
  | AzureOpenAiChatModel
  | GcpVertexAiChatModel
  | AwsBedrockChatModel
  | AiCoreOpenSourceChatModel;
