export type {
  OrchestrationModuleConfig,
  OrchestrationConfigWithoutTemplate as OrchestrationConfigWithoutPrompt,
  OrchestrationConfigWithTemplate,
  OrchestrationConfigWithInlineTemplate,
  OrchestrationConfigWithTemplateRef,
  OrchestrationModuleConfigList,
  OrchestrationConfigRef,
  OrchestrationConfigRefById,
  OrchestrationConfigRefByName,
  OrchestrationConfigRefOverride,
  OrchestrationConfigRefModules,
  PromptTemplatingModule,
  MaskingModule,
  GroundingModule,
  FilteringModule,
  TranslationModule,
  PromptTemplate,
  ChatCompletionRequest,
  OrchestrationCreateOptions,
  OrchestrationCreateOptionsWithPrompt,
  OrchestrationCreateRequestConfig,
  RequestOptions,
  DocumentGroundingServiceConfig,
  DocumentGroundingServiceFilter,
  DpiMaskingConfig,
  LlmModelParams,
  LlmModelDetails,
  LlamaGuard38BCategory,
  LlamaGuard38BFilterReturnType,
  LlamaGuard38BInputFilterConfig,
  LlamaGuard38BOutputFilterConfig,
  GraniteGuardian41Category,
  GraniteGuardian41FilterReturnType,
  GraniteGuardian41FilterOptions,
  AzureFilterThreshold,
  AzureContentSafetyFilterInputParameters,
  AzureContentSafetyFilterOutputParameters,
  AzureContentSafetyFilterParameters,
  AzureContentSafetyFilterReturnType,
  OrchestrationErrorResponse,
  DpiMaskingProviderConfig,
  TranslationConfigParams,
  TranslationInputParameters,
  TranslationOutputParameters,
  TranslationReturnType,
  TranslationInputConfig,
  TranslationOutputConfig,
  DocumentTranslationApplyToSelector,
  TranslationApplyToCategory,
  TranslationTargetLanguage,
  EmbeddingRequest,
  EmbeddingModelConfig,
  EmbeddingModelDetails,
  EmbeddingModelParams,
  EmbeddingModuleConfig,
  EmbeddingData,
  OrchestrationRequestHeaders
} from './orchestration-types.ts';
export {
  isConfigReference,
  isOrchestrationModuleConfigList
} from './orchestration-types.ts';
export type {
  StreamOptions,
  StreamOptionsWithOverrides,
  StreamOptionsWithoutOverrides,
  ModuleStreamOptions
} from './orchestration-streaming-types.ts';

export type {
  /** @deprecated Use `StreamOptionsWithoutOverrides` instead. */
  StreamOptionsWithoutOverrides as BaseStreamOptions
} from './orchestration-streaming-types.ts';

export { OrchestrationStreamResponse } from './orchestration-stream-response.ts';
export { OrchestrationStreamChunkResponse } from './orchestration-stream-chunk-response.ts';
export { OrchestrationStream } from './orchestration-stream.ts';
export { OrchestrationClient } from './orchestration-client.ts';
export { Orchestration } from './new/orchestration.ts';
export type { OrchestrationConfigRefBuilder } from './new/builders/index.ts';
export { OrchestrationResponse } from './orchestration-response.ts';
export { OrchestrationEmbeddingClient } from './orchestration-embedding-client.ts';
export { OrchestrationEmbeddingResponse } from './orchestration-embedding-response.ts';
export type { ChatModel, EmbeddingModel } from './model-types.ts';

export {
  buildAzureContentSafetyFilter,
  buildLlamaGuard38BFilter,
  buildGraniteGuardian41Filter,
  buildDocumentGroundingConfig,
  buildDpiMaskingProvider,
  buildTranslationConfig
} from './util/index.ts';

/**
 * Exporting frequently used types.
 * In case of breaking changes, create wrappers in `orchestration-types.ts`.
 * Explicitly export the wrapper also in `internal.ts`.
 */
export type {
  ChatMessage,
  ChatMessages,
  ChatMessageContent,
  SystemChatMessage,
  UserChatMessage,
  UserChatMessageContent,
  UserChatMessageContentItem,
  ImageContentUrl,
  FileContent,
  AssistantChatMessage,
  ToolChatMessage,
  DeveloperChatMessage,
  ChatCompletionTool,
  FunctionObject,
  Error as OrchestrationError,
  Citation,
  ReasoningBlock,
  OrchestrationConfig
} from './client/api/schema/index.ts';
