import { AIMessage, BaseMessage, ToolMessage } from '@langchain/core/messages';
import { ChatResult } from '@langchain/core/outputs';
import { StructuredTool } from '@langchain/core/tools';
import type {
  AzureOpenAiChatCompletionChoice,
  AzureOpenAiChatCompletionFunction,
  AzureOpenAiChatCompletionTool,
  AzureOpenAiChatMessage,
  AzureOpenAiChatCompletionOutput,
  AzureOpenAiChatCompletionParameters
} from '@sap-ai-sdk/foundation-models';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { AzureOpenAiChatClient } from './chat.js';
import {
  LangChainToolChoice,
  AzureOpenAiChatCallOptions,
  ToolChoice
} from './types.js';

/**
 * Maps a LangChain {@link StructuredTool} to {@link AzureOpenAiChatCompletionFunction}.
 * @param tool - Base class for tools that accept input of any shape defined by a Zod schema.
 * @returns The OpenAI chat completion function.
 */
function mapToolToOpenAiFunction(
  tool: StructuredTool
): AzureOpenAiChatCompletionFunction {
  return {
    name: tool.name,
    description: tool.description,
    parameters: zodToJsonSchema(tool.schema)
  };
}

/**
 * Maps a LangChain {@link StructuredTool} to {@link AzureOpenAiChatCompletionTool}.
 * @param tool - Base class for tools that accept input of any shape defined by a Zod schema.
 * @returns The OpenAI chat completion tool.
 */
function mapToolToOpenAiTool(
  tool: StructuredTool
): AzureOpenAiChatCompletionTool {
  return {
    type: 'function',
    function: mapToolToOpenAiFunction(tool)
  };
}

/**
 * Maps a {@link BaseMessage} to OpenAI's message role.
 * @param message - The message to map.
 * @returns The OpenAI message Role.
 */
function mapBaseMessageToRole(
  message: BaseMessage
): AzureOpenAiChatMessage['role'] {
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
    default:
      throw new Error(`Unknown message type: ${message._getType()}`);
  }
}

/**
 * Maps OpenAI messages to LangChain's {@link ChatResult}.
 * @param res - The OpenAI chat completion output.
 * @returns The LangChain chat result.
 * @internal
 */
export function mapResponseToChatResult(
  res: AzureOpenAiChatCompletionOutput
): ChatResult {
  return {
    generations: res.choices.map((choice: AzureOpenAiChatCompletionChoice) => ({
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
 * Maps {@link BaseMessage} to OpenAI messages.
 * @param message - The message to map.
 * @returns The OpenAI chat Message.
 */
function mapBaseMessageToAzureOpenAiChatMessage(
  message: BaseMessage
): AzureOpenAiChatMessage {
  // TODO: remove type casting, improve message.content handling
  return removeUndefinedProperties<AzureOpenAiChatMessage>({
    content: message.content,
    name: message.name,
    role: mapBaseMessageToRole(message),
    function_call: message.additional_kwargs.function_call,
    tool_calls: message.additional_kwargs.tool_calls,
    tool_call_id:
      message._getType() === 'tool'
        ? (message as ToolMessage).tool_call_id
        : undefined
  } as AzureOpenAiChatMessage);
}

/**
 * Checks if a given array is a structured tool array.
 * @param tools - The array to check.
 * @returns Whether the array is a structured tool array.
 */
function isStructuredToolArray(tools?: unknown[]): tools is StructuredTool[] {
  return !!tools?.every(tool =>
    Array.isArray((tool as StructuredTool).lc_namespace)
  );
}

function mapToolChoice(
  toolChoice?: LangChainToolChoice
): ToolChoice | undefined {
  if (toolChoice === 'auto' || toolChoice === 'none') {
    return toolChoice;
  }

  if (typeof toolChoice === 'string') {
    return {
      type: 'function',
      function: { name: toolChoice }
    };
  }
}

/**
 * Maps LangChain's input interface to our own client's input interface
 * @param client The LangChain OpenAI client
 * @param options The LangChain call options
 * @param messages The messages to be send
 * @returns An AI SDK compatibile request
 * @internal
 */
export function mapLangchainToAiClient(
  client: AzureOpenAiChatClient,
  options: AzureOpenAiChatCallOptions & { promptIndex?: number },
  messages: BaseMessage[]
): AzureOpenAiChatCompletionParameters {
  return removeUndefinedProperties<AzureOpenAiChatCompletionParameters>({
    messages: messages.map(mapBaseMessageToAzureOpenAiChatMessage),
    max_tokens: client.max_tokens === -1 ? undefined : client.max_tokens,
    temperature: client.temperature,
    top_p: client.top_p,
    logit_bias: client.logit_bias,
    n: client.n,
    stop: options?.stop ?? client.stop,
    functions: isStructuredToolArray(options?.functions)
      ? options?.functions.map(mapToolToOpenAiFunction)
      : options?.functions,
    tools: isStructuredToolArray(options?.tools)
      ? options?.tools.map(mapToolToOpenAiTool)
      : options?.tools,
    tool_choice: mapToolChoice(options?.tool_choice),
    response_format: options?.response_format,
    seed: options?.seed
  });
}

function removeUndefinedProperties<T extends object>(obj: T): T {
  const result = { ...obj };
  for (const key in result) {
    if (result[key as keyof T] === undefined) {
      delete result[key as keyof T];
    }
  }
  return result;
}
