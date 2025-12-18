import type {
  OrchestrationModuleConfig as OrchestrationModuleConfigWithStringTemplating,
  PromptTemplate,
  PromptTemplatingModule,
  StreamOptions
} from '@sap-ai-sdk/orchestration';
import type {
  ChatCompletionTool,
  TemplateRef
} from '@sap-ai-sdk/orchestration/internal.js';
import type { Xor } from '@sap-cloud-sdk/util';
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
  stream?: boolean;
  tools?: ChatOrchestrationToolType[];
  promptIndex?: number;
  placeholderValues?: Record<string, string>;
  streamOptions?: StreamOptions;
};

/**
 * Orchestration module configuration for LangChain.
 */
export type LangChainOrchestrationModuleConfig = Omit<
  OrchestrationModuleConfigWithStringTemplating,
  'promptTemplating'
> & {
  promptTemplating: Omit<PromptTemplatingModule, 'prompt'> & {
    prompt?: Xor<PromptTemplate, TemplateRef>;
  };
};
