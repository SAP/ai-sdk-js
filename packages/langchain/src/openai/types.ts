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
 * Type that enforces mutual exclusivity between max_tokens and max_completion_tokens.
 * Only one of these properties can be specified, not both.
 */
type ExclusiveTokenParams =
  | ({ max_tokens: number } & { max_completion_tokens?: never })
  | ({ max_completion_tokens: number | null } & { max_tokens?: never })
  | { max_tokens?: never; max_completion_tokens?: never };

/**
 * Input type for {@link AzureOpenAiChatClient} initialization.
 */
export type AzureOpenAiChatModelParams = Pick<
  AzureOpenAiChatCompletionsRequestCommon,
  | 'temperature'
  | 'top_p'
  | 'stop'
  | 'presence_penalty'
  | 'frequency_penalty'
  | 'logit_bias'
  | 'user'
> &
  ExclusiveTokenParams & {
    /**
     * Whether the model supports the `strict` argument when passing in tools.
     * If `undefined` the `strict` argument will not be passed to OpenAI.
     */
    supportsStrictToolCalling?: boolean;
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
