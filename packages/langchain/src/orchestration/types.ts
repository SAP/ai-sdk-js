import type { BaseLLMParams } from '@langchain/core/language_models/llms';
import type {
  BaseChatModelCallOptions
} from '@langchain/core/language_models/chat_models';
import type {
  AzureOpenAiCreateChatCompletionRequest,
  AzureOpenAiEmbeddingModel
} from '@sap-ai-sdk/foundation-models';
import type { CustomRequestConfig } from '@sap-ai-sdk/core';
import type { ModelConfig, ResourceGroupConfig } from '@sap-ai-sdk/ai-api';

/**
 * Call options for the {@link AzureOpenAiChatClient}.
 */
export type AzureOpenAiChatCallOptions = BaseChatModelCallOptions &
  Pick<
    AzureOpenAiCreateChatCompletionRequest,
    | 'data_sources'
    | 'n'
    | 'seed'
    | 'logprobs'
    | 'top_logprobs'
    | 'response_format'
    | 'tool_choice'
    | 'functions'
    | 'function_call'
    | 'tools'
  > & {
    requestConfig?: CustomRequestConfig;
  };

/**
 * Input type for {@link AzureOpenAiEmbeddingClient} initialization.
 */
export type AzureOpenAiEmbeddingModelParams =
  ModelConfig<AzureOpenAiEmbeddingModel> & ResourceGroupConfig & BaseLLMParams;
