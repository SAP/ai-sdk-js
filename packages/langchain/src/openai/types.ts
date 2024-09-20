import type {
  BaseChatModelCallOptions,
  BaseChatModelParams
} from '@langchain/core/language_models/chat_models';
import { BaseLLMParams } from '@langchain/core/language_models/llms';
import type {
  AzureOpenAiCreateChatCompletionRequest,
  AzureOpenAiChatModel
} from '@sap-ai-sdk/foundation-models';
import type { CustomRequestConfig } from '@sap-ai-sdk/core';
import type { ModelConfig, ResourceGroupConfig } from '@sap-ai-sdk/ai-api';

/**
 * Input type for {@link AzureOpenAiChatClient} initialization.
 */
export type AzureOpenAiChatModelParams = Omit<
  AzureOpenAiCreateChatCompletionRequest,
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
 * Call options for the {@link AzureOpenAiChatClient}.
 */
export type AzureOpenAiChatCallOptions = BaseChatModelCallOptions &
  Pick<
    AzureOpenAiCreateChatCompletionRequest,
    'response_format' | 'seed' | 'functions' | 'tools' | 'tool_choice'
  > & {
    requestConfig?: CustomRequestConfig;
  };

/**
 * Input type for {@link AzureOpenAiEmbeddingClient} initialization.
 */
export type AzureOpenAiEmbeddingModelParams =
  ModelConfig<AzureOpenAiChatModel> & ResourceGroupConfig & BaseLLMParams;
