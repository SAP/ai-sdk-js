import type {
  AzureOpenAiChatCompletionMessageToolCall,
  AzureOpenAiChatCompletionMessageToolCallChunk
} from '../client/inference/schema/index.js';

/**
 * @internal
 */
export type ToolCallAccumulator = {
  id?: string;
  type: 'function';
  function: {
    name?: string;
    arguments?: string;
  } & Record<string, any>;
} & Record<string, any>;

/**
 * @internal
 * Check if the accumulator is a AzureOpenAiChatCompletionMessageToolCall.
 */
export function isMessageToolCall(
  acc: ToolCallAccumulator
): acc is AzureOpenAiChatCompletionMessageToolCall {
  return (
    typeof acc.id === 'string' &&
    typeof acc.function.name === 'string' &&
    typeof acc.function.arguments === 'string'
  );
}

/**
 * Merge a stream of AzureOpenAiChatCompletionMessageToolCallChunk into a single AzureOpenAiChatCompletionMessageToolCall.
 * @throws If the final object is missing required fields.
 * @internal
 */
export function mergeToolCallChunk(
  chunk: AzureOpenAiChatCompletionMessageToolCallChunk,
  acc?: ToolCallAccumulator
): ToolCallAccumulator {
  const accumulator: ToolCallAccumulator = acc
    ? { ...acc }
    : {
        type: 'function',
        function: {}
      };

  if (chunk.id) {
    accumulator.id = chunk.id;
  }

  // Merge any extra top‐level props
  for (const key of Object.keys(chunk)) {
    if (!['index', 'id', 'type', 'function'].includes(key)) {
      accumulator[key] = chunk[key];
    }
  }

  if (chunk.function) {
    if (chunk.function.name) {
      accumulator.function.name = chunk.function.name;
    }

    if (chunk.function.arguments) {
      accumulator.function.arguments =
        (accumulator.function.arguments || '') + chunk.function.arguments;
    }

    // Merge any extra function‐scoped fields
    for (const key of Object.keys(chunk.function)) {
      if (!['name', 'arguments'].includes(key)) {
        accumulator.function[key] = (chunk.function as any)[key];
      }
    }
  }

  return accumulator;
}
