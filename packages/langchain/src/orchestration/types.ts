import type {
  Prompt,
  TemplatingModuleConfig,
  OrchestrationModuleConfig as OrchestrationModuleConfigWithStringTemplating,
  ChatCompletionTool,
  StreamOptions
} from '@sap-ai-sdk/orchestration';
import type {
  BaseChatModelCallOptions,
  BindToolsInput
} from '@langchain/core/language_models/chat_models';
import type { CustomRequestConfig } from '@sap-ai-sdk/core';

/**
 * Tool type for LangChain Orchestration client.
 */
export type ChatOrchestrationToolType = ChatCompletionTool | BindToolsInput;

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
  strict?: boolean;
  tools?: ChatOrchestrationToolType[];
  promptIndex?: number;
  inputParams?: Prompt['inputParams'];
  streamOptions?: StreamOptions;
};

/**
 * Orchestration module configuration for LangChain.
 */
export type LangChainOrchestrationModuleConfig = Omit<
  OrchestrationModuleConfigWithStringTemplating,
  'templating'
> & {
  templating?: TemplatingModuleConfig;
};

/**
 * Orchestration module configuration for LangChain.
 * @deprecated Use `LangChainOrchestrationModuleConfig` instead.
 */
export type LangchainOrchestrationModuleConfig =
  LangChainOrchestrationModuleConfig;
