import type { OrchestrationModuleConfig } from '@sap-ai-sdk/orchestration';
import type { CustomRequestConfig } from '@sap-ai-sdk/core';
import type { BaseChatModelCallOptions } from '@langchain/core/language_models/chat_models';

/**
 * Call options for the {@link OrchestrationClient}.
 */
export type OrchestrationCallOptions = BaseChatModelCallOptions
& OrchestrationModuleConfig &
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
   *     Private config: OrchestrationModuleConfig | string,
   * private deploymentConfig?: ResourceGroupConfig,
   * private destination?: HttpDestinationOrFetchOptions.
   */
