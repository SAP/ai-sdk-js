export type {
  OrchestrationModuleConfig,
  OrchestrationConfigRef,
  PromptTemplatingModule,
  MaskingModule,
  GroundingModule,
  FilteringModule,
  TranslationModule,
  PromptTemplate,
  ChatCompletionRequest,
  RequestOptions,
  StreamOptions,
  DocumentGroundingServiceConfig,
  DocumentGroundingServiceFilter,
  DpiMaskingConfig,
  LlmModelParams,
  LlmModelDetails,
  LlamaGuard38BCategory,
  LlamaGuard38BFilterReturnType,
  LlamaGuard38BInputFilterConfig,
  LlamaGuard38BOutputFilterConfig,
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
  EmbeddingData
} from './orchestration-types.js';
export { isConfigReference } from './orchestration-types.js';
export { OrchestrationStreamResponse } from './orchestration-stream-response.js';
export { OrchestrationStreamChunkResponse } from './orchestration-stream-chunk-response.js';
export { OrchestrationStream } from './orchestration-stream.js';
export { OrchestrationClient } from './orchestration-client.js';
export { OrchestrationResponse } from './orchestration-response.js';
export { OrchestrationEmbeddingClient } from './orchestration-embedding-client.js';
export { OrchestrationEmbeddingResponse } from './orchestration-embedding-response.js';
export type { ChatModel, EmbeddingModel } from './model-types.js';

export {
  buildAzureContentSafetyFilter,
  buildLlamaGuard38BFilter,
  buildDocumentGroundingConfig,
  buildDpiMaskingProvider,
  buildTranslationConfig
} from './util/index.js';

/**
 * Exporting frequently used types.
 * In case of breaking changes, create wrappers in `orchestration-types.ts`.
 * Explicitly export the wrapper also in `internal.ts`.
 */
export type {
  ChatMessage,
  SystemChatMessage,
  UserChatMessage,
  AssistantChatMessage,
  ToolChatMessage,
  DeveloperChatMessage,
  ChatCompletionTool,
  FunctionObject
} from './client/api/schema/index.js';
