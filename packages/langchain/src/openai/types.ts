import type { BaseChatModelParams } from '@langchain/core/language_models/chat_models';
import { BaseLLMParams } from '@langchain/core/language_models/llms';
import type { OpenAiChatCompletionParameters, OpenAiEmbeddingParameters } from '@sap-ai-sdk/foundation-models';
import type {
  AzureOpenAiChatModel
} from '@sap-ai-sdk/core';
import type { ModelConfiguration, ResourceGroupConfiguration } from '@sap-ai-sdk/ai-api';

/**
 * Input type for OpenAI chat models.
 */
export type OpenAiChatModelInput = Omit<OpenAiChatCompletionParameters, 'messages'> &
  BaseChatModelParams &
  ModelConfiguration<AzureOpenAiChatModel> &
  ResourceGroupConfiguration;

/**
 * Chat model call options for OpenAI.
 */
export interface OpenAiChatCallOptions
  extends Omit<OpenAiChatCompletionParameters, 'messages'>, BaseChatModelParams {};

/**
 * Input type for OpenAI embedding models.
 */
export type OpenAiEmbeddingInput = ModelConfiguration<AzureOpenAiChatModel> &
  ResourceGroupConfiguration &
  OpenAiEmbeddingParameters &
  BaseLLMParams;
