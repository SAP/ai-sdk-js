import type { BaseLLMParams } from '@langchain/core/language_models/llms';
import type {
  BaseChatModelCallOptions,
  BaseChatModelParams,
  BindToolsInput
} from '@langchain/core/language_models/chat_models';
import type {
  AzureOpenAiChatCompletionParameters,
  AzureOpenAiChatModel,
  AzureOpenAiEmbeddingModel
} from '@sap-ai-sdk/foundation-models';
import type { CustomRequestConfig } from '@sap-ai-sdk/core';
import type { ModelConfig, ResourceGroupConfig } from '@sap-ai-sdk/ai-api';
import type {
  AzureOpenAiChatCompletionsRequestCommon,
  AzureOpenAiChatCompletionTool
} from '@sap-ai-sdk/foundation-models/internal.js';

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
> & {
  /**
   * Whether the model supports the `strict` argument when passing in tools.
   * If `undefined` the `strict` argument will not be passed to OpenAI.
   */
  supportsStrictToolCalling?: boolean;
  /**
   * Whether the model should automatically stream responses when using `invoke()`.
   * If {@link disableStreaming} is set to `true`, this option will be ignored.
   * If {@link streaming} is explicitly set to `false`, {@link disableStreaming} will be set to `true`.
   */
  streaming?: boolean;
} & BaseChatModelParams &
  ModelConfig<AzureOpenAiChatModel> &
  ResourceGroupConfig;

/**
 * Tool type for LangChain Azure OpenAI client.
 */
export type ChatAzureOpenAIToolType =
  | AzureOpenAiChatCompletionTool
  | BindToolsInput;

/**
 * Call options for the {@link AzureOpenAiChatClient}.
 */
export type AzureOpenAiChatCallOptions = BaseChatModelCallOptions &
  Pick<
    AzureOpenAiChatCompletionParameters,
    | 'data_sources'
    | 'n'
    | 'seed'
    | 'logprobs'
    | 'top_logprobs'
    | 'response_format'
    | 'tool_choice'
    | 'functions'
    | 'function_call'
  > & {
    strict?: boolean;
    tools?: ChatAzureOpenAIToolType[];
    promptIndex?: number;
    requestConfig?: CustomRequestConfig;
  };

/**
 * Input type for {@link AzureOpenAiEmbeddingClient} initialization.
 */
export type AzureOpenAiEmbeddingModelParams =
  ModelConfig<AzureOpenAiEmbeddingModel> & ResourceGroupConfig & BaseLLMParams;
