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
  AzureOpenAiChatCallOptions,
} from './types.js';

type ToolChoice =
  | 'none'
  | 'auto'
  | {
      /**
       * The type of the tool.
       */
      type: 'function';
      /**
       * Use to force the model to call a specific function.
       */
      function: {
        /**
         * The name of the function to call.
         */
        name: string;
      };
    };

type LangChainToolChoice = string | Record<string, any> | 'auto' | 'any';

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
 * Maps a {@link BaseMessage} to{@link AzureOpenAiChatMessage} message role.
 * @param message - The {@link BaseMessage} to map.
 * @returns The {@link AzureOpenAiChatMessage} message Role.
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
 * Maps {@link AzureOpenAiChatCompletionOutput} to LangChain's {@link ChatResult}.
 * @param completionResponse - The {@link AzureOpenAiChatCompletionOutput} response.
 * @returns The LangChain {@link ChatResult}
 * @internal
 */
export function mapOutputToChatResult(
  completionResponse: AzureOpenAiChatCompletionOutput
): ChatResult {
  return {
    generations: completionResponse.choices.map((choice: AzureOpenAiChatCompletionChoice) => ({
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
      created: completionResponse.created,
      id: completionResponse.id,
      model: completionResponse.model,
      object: completionResponse.object,
      tokenUsage: {
        completionTokens: completionResponse.usage.completion_tokens,
        promptTokens: completionResponse.usage.prompt_tokens,
        totalTokens: completionResponse.usage.total_tokens
      }
    }
  };
}

/**
 * Maps {@link BaseMessage} to {@link AzureOpenAiChatMessage}.
 * @param message - The message to map.
 * @returns The {@link AzureOpenAiChatMessage}.
 */
function mapBaseMessageToAzureOpenAiChatMessage(
  message: BaseMessage
): AzureOpenAiChatMessage {
  // TODO: remove type casting, improve message.content handling
  return removeUndefinedProperties<AzureOpenAiChatMessage>({
    name: message.name,
    content: message.content,
    role: mapBaseMessageToRole(message),
    function_call: message.additional_kwargs.function_call,
    tool_calls: message.additional_kwargs.tool_calls,
    tool_call_id: mapToolCallId(message)
  });
}

function mapBaseMessageToContent(baseMessage: BaseMessage): AzureOpenAiChatMessage['content'] {
  if (typeof baseMessage.content === 'object' && ('text' in baseMessage.content || 'image_url' in baseMessage.content)) {
    const { text, image_url, ...rest } = baseMessage.content;
    if (rest) {
      // log warning
      return;
    }
  }
  return baseMessage.content as AzureOpenAiChatMessage['content'];
}

function isStructuredToolArray(tools?: unknown[]): tools is StructuredTool[] {
  return !!tools?.every(tool =>
    Array.isArray((tool as StructuredTool).lc_namespace)
  );
}

function mapToolCallId(message: BaseMessage): string | undefined {
  if (message._getType() === 'tool') {
    return (message as ToolMessage).tool_call_id;
  }
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
 * Maps LangChain's input interface to the AI SDK client's input interface
 * @param client The LangChain Azure OpenAI client
 * @param options The {@link AzureOpenAiChatCallOptions}
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
