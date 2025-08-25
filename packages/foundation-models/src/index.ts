export type {
  AzureOpenAiChatModel,
  AzureOpenAiChatCompletionParameters,
  AzureOpenAiEmbeddingModel,
  AzureOpenAiEmbeddingParameters
} from './azure-openai/index.js';

export {
  AzureOpenAiChatClient,
  AzureOpenAiEmbeddingClient,
  AzureOpenAiChatCompletionResponse,
  AzureOpenAiEmbeddingResponse,
  AzureOpenAiChatCompletionStreamChunkResponse,
  AzureOpenAiChatCompletionStreamResponse,
  AzureOpenAiChatCompletionStream
} from './azure-openai/index.js';

/**
 * Exporting frequently used types.
 * In case of breaking changes, create wrappers.
 * Explicitly export the wrapper also in `internal.ts`.
 */
export type {
  AzureOpenAiChatCompletionTool,
  AzureOpenAiFunctionObject,
  AzureOpenAiChatCompletionRequestMessage,
  AzureOpenAiChatCompletionRequestSystemMessage,
  AzureOpenAiChatCompletionRequestUserMessage,
  AzureOpenAiChatCompletionRequestAssistantMessage,
  AzureOpenAiChatCompletionRequestToolMessage
} from './azure-openai/client/inference/schema/index.js';
