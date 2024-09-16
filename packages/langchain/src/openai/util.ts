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
  OpenAiChatCompletionOutput,
  OpenAiChatCompletionParameters
} from '@sap-ai-sdk/foundation-models';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { OpenAiChatClient } from './chat.js';
import { OpenAiChatCallOptions } from './types.js';

/**
 * Maps a LangChain {@link StructuredTool} to {@link OpenAiChatCompletionFunction}.
 * @param tool - Base class for Tools that accept input of any shape defined by a Zod schema.
 * @returns The OpenAI Chat Completion Function.
 * @internal
 */
export function mapToolToOpenAiFunction(
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
 * @internal
 */
export function mapToolToOpenAiTool(
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
 * @internal
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
      return (message as ChatMessage).role as OpenAiChatMessage['role'];
    default:
      throw new Error(`Unknown message type: ${message._getType()}`);
  }
}

/**
 * Maps OpenAI messages to LangChain's {@link ChatResult}.
 * @param res - The OpenAI Chat Completion Output.
 * @returns The LangChain Chat Result.
 * @internal
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
 * @internal
 */
export function mapBaseMessageToOpenAiChatMessage(
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
 * @internal
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
 * Maps the langchain's input interface to our own client's input interface
 * @param client The Langchain OpenAI client
 * @param options The Langchain call options
 * @param messages The messages to be send
 * @returns A AI SDK compatibile request
 * @internal
 */
export function mapLangchainToAiClient(
  client: OpenAiChatClient,
  options: OpenAiChatCallOptions,
  messages: BaseMessage[]
): OpenAiChatCompletionParameters {
  return {
    messages: messages.map(mapBaseMessageToOpenAiChatMessage),
    max_tokens: client.maxTokens === -1 ? undefined : client.maxTokens,
    temperature: client.temperature,
    top_p: client.topP,
    logit_bias: client.logitBias,
    n: client.n,
    stop: options?.stop ?? client.stop,
    presence_penalty: client.presencePenalty,
    frequency_penalty: client.frequencyPenalty,
    functions: isStructuredToolArray(options?.functions)
      ? options?.functions.map(mapToolToOpenAiFunction)
      : options?.functions,
    tools: isStructuredToolArray(options?.tools)
      ? options?.tools.map(mapToolToOpenAiTool)
      : options?.tools,
    tool_choice: options?.tool_choice,
    response_format: options?.response_format,
    seed: options?.seed,
    ...client.modelKwargs
  };
}
