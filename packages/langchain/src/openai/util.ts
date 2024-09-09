import {
  AIMessage,
  BaseMessage,
  ChatMessage,
  ToolMessage
} from '@langchain/core/messages';
import { ChatResult } from '@langchain/core/outputs';
import { StructuredTool } from '@langchain/core/tools';
import type {
  OpenAiChatCompletionChoice,
  OpenAiChatCompletionFunction,
  OpenAiChatCompletionTool,
  OpenAiChatMessage,
  OpenAiChatCompletionOutput
} from '@sap-ai-sdk/gen-ai-hub';
import { zodToJsonSchema } from 'zod-to-json-schema';

/**
 * Maps a LangChain {@link StructuredTool} to {@link OpenAiChatCompletionFunction}.
 * @param tool - Base class for Tools that accept input of any shape defined by a Zod schema.
 * @returns The OpenAI Chat Completion Function.
 */
export function mapToolToOpenAIFunction(
  tool: StructuredTool
): OpenAiChatCompletionFunction {
  return {
    name: tool.name,
    description: tool.description,
    parameters: zodToJsonSchema(tool.schema)
  };
}

/**
 * Maps a LangChain {@link StructuredTool} to {@link OpenAiChatCompletionTool}.
 * @param tool - Base class for Tools that accept input of any shape defined by a Zod schema.
 * @returns The OpenAI Chat Completion Tool.
 */
export function mapToolToOpenAITool(
  tool: StructuredTool
): OpenAiChatCompletionTool {
  return {
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: zodToJsonSchema(tool.schema)
    }
  };
}

/**
 * Maps a {@link BaseMessage} to OpenAI's Message Role.
 * @param message - The message to map.
 * @returns The OpenAI Message Role.
 */
export function mapBaseMessageToRole(
  message: BaseMessage
): OpenAiChatMessage['role'] {
  switch (message._getType()) {
    case 'ai':
      return 'assistant';
    case 'human':
      return 'user';
    case 'system':
      return 'system';
    case 'function':
      return 'function';
    case 'tool':
      return 'tool';
    case 'generic':
      // TODO: refactor?
      return (message as ChatMessage).role as OpenAiChatMessage['role'];
    default:
      throw new Error(`Unknown message type: ${message._getType()}`);
  }
}

/**
 * Maps OpenAI messages to LangChain's {@link ChatResult}.
 * @param res - The OpenAI Chat Completion Output.
 * @returns The LangChain Chat Result.
 */
export function mapResponseToChatResult(
  res: OpenAiChatCompletionOutput
): ChatResult {
  return {
    generations: res.choices.map((choice: OpenAiChatCompletionChoice) => ({
      text: choice.message.content || '',
      message: new AIMessage({
        content: choice.message.content || '',
        additional_kwargs: {
          finish_reason: choice.finish_reason,
          index: choice.index,
          function_call: choice.message.function_call,
          tool_calls: choice.message.tool_calls,
          tool_call_id: ''
        }
      }),
      generationInfo: {
        finish_reason: choice.finish_reason,
        index: choice.index,
        function_call: choice.message.function_call,
        tool_calls: choice.message.tool_calls
      }
    })),
    llmOutput: {
      created: res.created,
      id: res.id,
      model: res.model,
      object: res.object,
      tokenUsage: {
        completionTokens: res.usage.completion_tokens,
        promptTokens: res.usage.prompt_tokens,
        totalTokens: res.usage.total_tokens
      }
    }
  };
}

/**
 * Maps {@link BaseMessage} to OpenAI Messages.
 * @param message - The message to map.
 * @returns The OpenAI Chat Message.
 */
export function mapBaseMessageToOpenAIChatMessage(
  message: BaseMessage
): OpenAiChatMessage {
  return {
    content: message.content,
    name: message.name,
    role: mapBaseMessageToRole(message),
    function_call: message.additional_kwargs.function_call,
    tool_calls: message.additional_kwargs.tool_calls,
    tool_call_id:
      message._getType() === 'tool' ? (message as ToolMessage).tool_call_id : ''
  } as OpenAiChatMessage;
}

/**
 * Checks if a given array is a structured tool array.
 * @param tools - The array to check.
 * @returns Whether the array is a structured tool array.
 */
export function isStructuredToolArray(
  tools?: unknown[]
): tools is StructuredTool[] {
  return (
    tools !== undefined &&
    tools.every(tool => Array.isArray((tool as StructuredTool).lc_namespace))
  );
}

/**
 * Chunk an array into smaller arrays of specified chunk size.
 * @param arr - Input array to be chunked.
 * @param chunkSize - Size of each chunk.
 * @returns Array of chunks.
 */
export const chunkArray = <T>(arr: T[], chunkSize: number): T[][] =>
  arr.reduce((chunks, elem, index) => {
    const chunkIndex = Math.floor(index / chunkSize);
    const chunk = chunks[chunkIndex] || [];

    chunks[chunkIndex] = chunk.concat([elem]);
    return chunks;
  }, [] as T[][]);
