import type {
  Prompt,
  TemplatingModuleConfig,
  OrchestrationModuleConfig as OrchestrationModuleConfigWithStringTemplating,
  ChatCompletionTool,
} from '@sap-ai-sdk/orchestration';
import type { BaseChatModelCallOptions, BindToolsInput } from '@langchain/core/language_models/chat_models';
import type { CustomRequestConfig } from '@sap-ai-sdk/core';

/**
 * Tool type for LangChain Orchestration client.
 */
export type ChatOrchestrationToolType =
  | ChatCompletionTool
  | BindToolsInput;

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
  tools?: ChatOrchestrationToolType[];
  inputParams?: Prompt['inputParams'];
};

/**
 * Orchestration module configuration for LangChain.
 */
// TODO: Omit streaming until supported
export type LangChainOrchestrationModuleConfig = Omit<
  OrchestrationModuleConfigWithStringTemplating,
  'streaming' | 'templating'
> & {
  templating?: TemplatingModuleConfig;
};
