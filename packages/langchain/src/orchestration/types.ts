import type {
  OrchestrationModuleConfig as OrchestrationModuleConfigWithStringTemplating,
  PromptTemplate,
  PromptTemplatingModule,
  StreamOptions
} from '@sap-ai-sdk/orchestration';
import type {
  CacheControl,
  ChatCompletionTool,
  ResponseFormatJsonObject,
  ResponseFormatJsonSchema,
  ResponseFormatText,
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
  | 'ls_structured_output_format'
> & {
  customRequestConfig?: CustomRequestConfig;
  strict?: boolean;
  tools?: ChatOrchestrationToolType[];
  promptIndex?: number;
  placeholderValues?: Record<string, string>;
  streamOptions?: StreamOptions;
  responseFormat?:
    | ResponseFormatText
    | ResponseFormatJsonObject
    | ResponseFormatJsonSchema;
  /**
   * Cache control configuration for prompt caching. When provided, a cache
   * breakpoint is automatically applied to the last cacheable text block of
   * the last message so the breakpoint advances naturally as the conversation
   * grows. This removes the need to place `cache_control` on individual
   * content blocks manually.
   *
   * Only applies to models that support `cache_control` through orchestration
   * (Anthropic Claude and Amazon Nova model families). Other models will
   * ignore the directive. See the
   * {@link https://help.sap.com/docs/sap-ai-core/generative-ai/prompt-caching | SAP AI Core prompt caching docs}
   * for supported models and breakpoint limits.
   */
  cache_control?: CacheControl;
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

/**
 * Non-empty list of orchestration module configurations for module fallback.
 * The orchestration service will try each configuration in order until one succeeds.
 * @example
 * const fallbackConfig: OrchestrationModuleConfigList = [
 *   {
 *     promptTemplating: {
 *       model: { name: 'gpt-5.4', timeout: 5 }
 *     }
 *   },
 *   {
 *     promptTemplating: {
 *       model: { name: 'gpt-5.4-nano' }
 *     }
 *   }
 * ];
 */
export type LangChainOrchestrationModuleConfigList = [
  LangChainOrchestrationModuleConfig,
  ...LangChainOrchestrationModuleConfig[]
];
