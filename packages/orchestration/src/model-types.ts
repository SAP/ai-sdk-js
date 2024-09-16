import {
  AicoreOpensourceChatModel,
  AwsBedrockChatModel,
  AzureOpenAiChatModel,
  GcpVertexAiChatModel
} from '@sap-ai-sdk/core';

/**
 * Supported chat models for orchestration.
 */
export type ChatModel = Exclude<
  | AzureOpenAiChatModel
  | GcpVertexAiChatModel
  | AwsBedrockChatModel
  | AicoreOpensourceChatModel,
  'gpt-4o-mini'
>;
