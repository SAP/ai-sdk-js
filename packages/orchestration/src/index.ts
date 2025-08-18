export type {
  OrchestrationModuleConfig,
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
  LlamaGuardCategory,
  AzureContentFilter,
  AzureFilterThreshold,
  TranslationConfigParams,
  AzureContentSafety,
  AzureContentSafetyFilterConfig,
  OrchestrationErrorResponse,
  LlamaGuardFilterConfig,
  DocumentGroundingConfig,
  DpiMaskingProviderConfig,
  TranslationConfig
} from './orchestration-types.js';
export { OrchestrationStreamResponse } from './orchestration-stream-response.js';
export { OrchestrationStreamChunkResponse } from './orchestration-stream-chunk-response.js';
export { OrchestrationStream } from './orchestration-stream.js';
export { OrchestrationClient } from './orchestration-client.js';
export { OrchestrationResponse } from './orchestration-response.js';
export type { ChatModel } from './model-types.js';

export {
  buildAzureContentSafetyFilter,
  buildLlamaGuardFilter,
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
  FunctionObject,
  ModuleResultsStreaming,
  LlmChoiceStreaming,
  ModuleResults,
  LlmChoice
} from './client/api/schema/index.js';
