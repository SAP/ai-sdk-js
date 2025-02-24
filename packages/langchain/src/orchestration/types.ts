import type { Template } from '@sap-ai-sdk/orchestration';
import type {
  BaseChatModelCallOptions
} from '@langchain/core/language_models/chat_models';
import type {
  AzureOpenAiCreateChatCompletionRequest
} from '@sap-ai-sdk/foundation-models';
import type { CustomRequestConfig } from '@sap-ai-sdk/core';

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
 * TODO: Add docs.
 */
export type OrchestrationCallOptions = Pick<
  BaseChatModelCallOptions,
  | 'stop'
  | 'signal'
  | 'maxConcurrency'
  | 'timeout'
  > & {
    customRequestConfig?: CustomRequestConfig;
    tools?: Template['tools'];
  };

