import type { BaseChatModelCallOptions, BaseChatModelParams } from '@langchain/core/language_models/chat_models';
import { BaseLLMParams } from '@langchain/core/language_models/llms';
import type { OpenAiChatCompletionParameters } from '@sap-ai-sdk/foundation-models';
import type {
  AzureOpenAiChatModel,
  CustomRequestConfig
} from '@sap-ai-sdk/core';
import type { ModelConfiguration, ResourceGroupConfiguration } from '@sap-ai-sdk/ai-api';

/**
 * Input type for OpenAI chat models.
 */
export type OpenAiChatModelParams = Omit<OpenAiChatCompletionParameters, 'messages'> &
  BaseChatModelParams &
  ModelConfiguration<AzureOpenAiChatModel> &
  ResourceGroupConfiguration;

/**
 * Chat model call options for OpenAI.
 */
export interface OpenAiChatCallOptions
  extends CustomRequestConfig, BaseChatModelCallOptions {};

/**
 * Input type for OpenAI embedding models.
 */
export type OpenAiEmbeddingModelParams = ModelConfiguration<AzureOpenAiChatModel> &
  ResourceGroupConfiguration &
  BaseLLMParams;
