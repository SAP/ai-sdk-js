import type { Prompt, Template } from '@sap-ai-sdk/orchestration';
import type { BaseChatModelCallOptions } from '@langchain/core/language_models/chat_models';
import type { CustomRequestConfig } from '@sap-ai-sdk/core';

/**
 * TODO: Add docs.
 */
export type OrchestrationCallOptions = Pick<
  BaseChatModelCallOptions,
  'stop' | 'signal' | 'maxConcurrency' | 'timeout'
> & {
  customRequestConfig?: CustomRequestConfig;
  tools?: Template['tools'];
  inputParams?: Prompt['inputParams'];
};
