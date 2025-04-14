import type {
  Prompt,
  Template,
  TemplatingModuleConfig,
  OrchestrationModuleConfig as OrchestrationModuleConfigWithStringTemplating
} from '@sap-ai-sdk/orchestration';
import type { BaseChatModelCallOptions } from '@langchain/core/language_models/chat_models';
import type { CustomRequestConfig } from '@sap-ai-sdk/core';

/**
 * Options for an orchestration call.
 */
export type OrchestrationCallOptions = Pick<
  BaseChatModelCallOptions,
  | 'stop'
  | 'signal'
  | 'timeout'
  | 'callbacks'
  | 'metadata'
  | 'runId'
  | 'runName'
  | 'tags'
> & {
  customRequestConfig?: CustomRequestConfig;
  tools?: Template['tools'];
  inputParams?: Prompt['inputParams'];
};

/**
 * Orchestration module configuration with string templating.
 * This type is used when the `templating` property can also be a string.
 */
export type LangchainOrchestrationModuleConfig = Omit<
  OrchestrationModuleConfigWithStringTemplating,
  'streaming' | 'templating'
> & {
  templating: TemplatingModuleConfig;
};
