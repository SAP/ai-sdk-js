import type {
  BaseChatModelCallOptions,
  BaseChatModelParams
} from '@langchain/core/language_models/chat_models';
import { BaseLLMParams } from '@langchain/core/language_models/llms';
import type {
  AzureOpenAiCreateChatCompletionRequest,
  AzureOpenAiChatModel,
  AzureOpenAiEmbeddingModel,
  AzureOpenAiChatCompletionsRequestCommon
} from '@sap-ai-sdk/foundation-models';
import type { CustomRequestConfig } from '@sap-ai-sdk/core';
import type { ModelConfig, ResourceGroupConfig } from '@sap-ai-sdk/ai-api';

/**
 * Input type for {@link AzureOpenAiChatClient} initialization.
 */
export type AzureOpenAiChatModelParams = Pick<
  AzureOpenAiChatCompletionsRequestCommon,
  | 'temperature'
  | 'top_p'
  | 'stop'
  | 'max_tokens'
  | 'presence_penalty'
  | 'frequency_penalty'
  | 'logit_bias'
  | 'user'
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
    | 'data_sources'
    | 'n'
    | 'seed'
    | 'logprobs'
    | 'top_logprobs'
    | 'response_format'
    | 'tools'
    | 'tool_choice'
    | 'functions'
    | 'function_call'
  > & {
    requestConfig?: CustomRequestConfig;
  };

/**
 * Input type for {@link AzureOpenAiEmbeddingClient} initialization.
 */
export type AzureOpenAiEmbeddingModelParams =
  ModelConfig<AzureOpenAiEmbeddingModel> & ResourceGroupConfig & BaseLLMParams;
