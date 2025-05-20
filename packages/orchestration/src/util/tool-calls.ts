import type {
  MessageToolCall,
  ToolCallChunk
} from '../client/api/schema/index.js';

type ToolCallAccumulator = {
  id?: string;
  type: 'function';
  function: {
    name?: string;
    arguments?: string;
  } & Record<string, any>;
} & Record<string, any>;

function validateToolCallAccumulator(acc: ToolCallAccumulator): boolean {
  return (
    !!acc.id &&
    acc.type === 'function' &&
    !!acc.function &&
    typeof acc.function.name === 'string' &&
    typeof acc.function.arguments === 'string'
  );
}

/**
 * Merge a stream of ToolCallChunk into a single MessageToolCall.
 * @throws If the final object is missing required fields.
 * @internal
 */
export function mergeToolCallChunks(chunks: ToolCallChunk[]): MessageToolCall {
  const acc: ToolCallAccumulator = {
    type: 'function',
    function: {}
  };

  for (const chunk of chunks) {
    if (chunk.id) {
      acc.id = chunk.id;
    }

    // Merge any extra top‐level props
    for (const key of Object.keys(chunk)) {
      if (!['index', 'id', 'type', 'function'].includes(key)) {
        acc[key] = chunk[key];
      }
    }

    if (chunk.function) {
      if (chunk.function.name) {
        acc.function.name = chunk.function.name;
      }

      if (chunk.function.arguments) {
        acc.function.arguments =
          (acc.function.arguments || '') + chunk.function.arguments;
      }

      // Merge any extra function‐scoped fields
      for (const key of Object.keys(chunk.function)) {
        if (!['name', 'arguments'].includes(key)) {
          acc.function[key] = (chunk.function as any)[key];
        }
      }
    }
  }

  if (validateToolCallAccumulator(acc)) {
    return acc as MessageToolCall;
  }

  throw new Error(`Invalid tool call after merging: ${JSON.stringify(acc)}`);
}
