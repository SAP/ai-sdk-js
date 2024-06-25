import {
  OpenAiEmbeddingOutput,
  OpenAiChatCompletionOutput
} from './openai/openai-types.js';

/**
 * Base LLM Output.
 */
export type GenAiBaseLlmOutput =
  | OpenAiChatCompletionOutput
  | OpenAiEmbeddingOutput;
