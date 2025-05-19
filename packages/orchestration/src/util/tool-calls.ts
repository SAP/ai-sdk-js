import type {
  MessageToolCall,
  ToolCallChunk
} from '../client/api/schema/index.js';

// —— Define a custom “growing” accumulator type —— //
type ToolCallAccumulator = {
  id?: string;
  type?: 'function';
  function?: {
    name?: string;
    arguments?: string;
  } & Record<string, any>;
} & Record<string, any>;

/**
 * Merge a stream of ToolCallChunk into a single MessageToolCall.
 * @throws If the final object is missing required fields.
 * @internal
 */
export function mergeToolCallChunks(chunks: ToolCallChunk[]): MessageToolCall {
  // Start with an empty accumulator that can grow.
  const acc: ToolCallAccumulator = {
    function: {}
  };

  for (const chunk of chunks) {
    // — Top‐level: id & type — //
    if (chunk.id) {
      acc.id = chunk.id;
    }
    if (chunk.type) {
      acc.type = chunk.type;
    }

    // — Merge any extra top‐level props — //
    for (const key of Object.keys(chunk)) {
      if (!['index', 'id', 'type', 'function'].includes(key)) {
        acc[key] = chunk[key];
      }
    }

    // — Function object — //
    if (chunk.function) {
      // Ensure acc.function exists
      if (!acc.function) {
        acc.function = {};
      }

      const fnAcc = acc.function!;

      if (chunk.function.name) {
        fnAcc.name = chunk.function.name;
      }

      if (chunk.function.arguments) {
        fnAcc.arguments = (fnAcc.arguments || '') + chunk.function.arguments;
      }

      // Merge any extra function‐scoped fields
      for (const key of Object.keys(chunk.function)) {
        if (!['name', 'arguments'].includes(key)) {
          fnAcc[key] = (chunk.function as any)[key];
        }
      }
    }
  }

  // —— Final validation —— //
  if (
    !acc.id ||
    acc.type !== 'function' ||
    !acc.function ||
    !acc.function.name ||
    acc.function.arguments === undefined
  ) {
    throw new Error(
      `Incomplete tool call after merging: ${JSON.stringify(acc)}`
    );
  }

  // Now that we know all required fields are present, cast to MessageToolCall
  return acc as MessageToolCall;
}
