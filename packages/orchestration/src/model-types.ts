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
  | Exclude<AzureOpenAiChatModel, 'gpt-4o-mini'>
  | GcpVertexAiChatModel
  | AwsBedrockChatModel
  | AiCoreOpenSourceChatModel;
