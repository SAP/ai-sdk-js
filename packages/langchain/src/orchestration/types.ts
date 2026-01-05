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
  BaseChatModelParams,
  BindToolsInput
} from '@langchain/core/language_models/chat_models';
import type { CustomRequestConfig } from '@sap-ai-sdk/core';

/**
 * Tool type for LangChain Orchestration client.
 */
export type ChatOrchestrationToolType = ChatCompletionTool | BindToolsInput;

/**
 * Langchain parameters for {@link OrchestrationClient} constructor `langchainOptions` argument.
 */
export type LangChainOrchestrationChatModelParams = BaseChatModelParams & {
  /**
   * Whether the model should automatically stream responses when using `invoke()`.
   * If {@link disableStreaming} is set to `true`, this option will be ignored.
   * If {@link streaming} is explicitly set to `false`, {@link disableStreaming} will be set to `true`.
   */
  streaming?: boolean;
};

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
