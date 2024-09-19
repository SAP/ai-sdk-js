import { AIMessage, BaseMessage, ToolMessage } from '@langchain/core/messages';
import { ChatResult } from '@langchain/core/outputs';
import { StructuredTool } from '@langchain/core/tools';
import type {
  AzureOpenAiChatCompletionFunction,
  AzureOpenAiChatCompletionTool,
  AzureOpenAiChatCompletionRequestMessage,
  AzureOpenAiCreateChatCompletionResponse,
  AzureOpenAiCreateChatCompletionRequest,
  AzureOpenAiChatCompletionFunctionParameters
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
): {
  description?: string;
  name: string;
  parameters: AzureOpenAiChatCompletionFunctionParameters;
} & Record<string, any> {
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
): AzureOpenAiChatCompletionRequestMessage['role'] {
  const messageTypeToRoleMap = new Map<string, AzureOpenAiChatCompletionRequestMessage['role']>([
    ['human', 'user'],
    ['ai', 'assistant'],
    ['system', 'system'],
    ['function', 'function'],
    ['tool', 'tool']
  ]);

  const messageType = message._getType();
  const role = messageTypeToRoleMap.get(messageType);
  if(!role) {
    throw new Error(`Unsupported message type: ${messageType}`);
  }
  return role;
}

/**
 * Maps {@link AzureOpenAiCreateChatCompletionResponse} to LangChain's {@link ChatResult}.
 * @param completionResponse - The {@link AzureOpenAiCreateChatCompletionResponse} response.
 * @returns The LangChain {@link ChatResult}
 * @internal
 */
export function mapOutputToChatResult(
  completionResponse: AzureOpenAiCreateChatCompletionResponse
): ChatResult {
  return {
    generations: completionResponse.choices.map((choice: typeof completionResponse['choices'][0]) => ({
      text: choice.message?.content || '',
      message: new AIMessage({
        content: choice.message?.content || '',
        additional_kwargs: {
          finish_reason: choice.finish_reason,
          index: choice.index,
          function_call: choice.message?.function_call,
          tool_calls: choice.message?.tool_calls,
          tool_call_id: ''
        }
      }),
      generationInfo: {
        finish_reason: choice.finish_reason,
        index: choice.index,
        function_call: choice.message?.function_call,
        tool_calls: choice.message?.tool_calls
      }
    })),
    llmOutput: {
      created: completionResponse.created,
      id: completionResponse.id,
      model: completionResponse.model,
      object: completionResponse.object,
      tokenUsage: {
        completionTokens: completionResponse.usage?.completion_tokens || 0,
        promptTokens: completionResponse.usage?.prompt_tokens || 0,
        totalTokens: completionResponse.usage?.total_tokens || 0
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
): AzureOpenAiChatCompletionRequestMessage {
  // TODO: remove type casting, improve message.content handling
  return removeUndefinedProperties<AzureOpenAiChatCompletionRequestMessage>({
    name: message.name,
    content: message.content,
    role: mapBaseMessageToRole(message),
    function_call: message.additional_kwargs.function_call,
    tool_calls: message.additional_kwargs.tool_calls,
    tool_call_id: mapToolCallId(message)
  });
}

function mapBaseMessageToContent(baseMessage: BaseMessage): AzureOpenAiChatCompletionRequestMessage['content'] {
  if (typeof baseMessage.content === 'object' && ('text' in baseMessage.content || 'image_url' in baseMessage.content)) {
    const { text, image_url, ...rest } = baseMessage.content;
    if (rest) {
      return;
    }
  }
  return baseMessage.content as AzureOpenAiChatCompletionRequestMessage['content'];
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
): AzureOpenAiCreateChatCompletionRequest {
  return removeUndefinedProperties<AzureOpenAiCreateChatCompletionRequest>({
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
