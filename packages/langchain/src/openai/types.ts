import type {
  BaseChatModelCallOptions,
  BaseChatModelParams
} from '@langchain/core/language_models/chat_models';
import { BaseLLMParams } from '@langchain/core/language_models/llms';
import type { AzureOpenAiChatCompletionParameters } from '@sap-ai-sdk/foundation-models';
import type {
  AzureOpenAiChatModel,
  CustomRequestConfig
} from '@sap-ai-sdk/core';
import type { ModelConfig, ResourceGroupConfig } from '@sap-ai-sdk/ai-api';

/**
 * Input type for OpenAI chat models.
 */
export type AzureOpenAiChatModelParams = Omit<
  AzureOpenAiChatCompletionParameters,
  | 'messages'
  | 'response_format'
  | 'seed'
  | 'functions'
  | 'tools'
  | 'tool_choice'
> &
  BaseChatModelParams &
  ModelConfig<AzureOpenAiChatModel> &
  ResourceGroupConfig;

/**
 * Chat model call options for OpenAI.
 */
export type AzureOpenAiChatCallOptions = BaseChatModelCallOptions &
  Pick<
    AzureOpenAiChatCompletionParameters,
    'response_format' | 'seed' | 'functions' | 'tools' | 'tool_choice'
  > & {
    requestConfig?: CustomRequestConfig;
  };

/**
 * Input type for OpenAI embedding models.
 */
export type AzureOpenAiEmbeddingModelParams =
  ModelConfig<AzureOpenAiChatModel> & ResourceGroupConfig & BaseLLMParams;
