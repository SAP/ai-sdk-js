import { AIMessage } from '@langchain/core/messages';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { v4 as uuidv4 } from 'uuid';
import { isZodSchema } from '@langchain/core/utils/types';
import type {
  StructuredToolInterface,
  StructuredTool
} from '@langchain/core/tools';
import type { ToolCall } from '@langchain/core/messages/tool';
import type {
  AzureOpenAiChatCompletionRequestUserMessage,
  AzureOpenAiChatCompletionRequestAssistantMessage,
  AzureOpenAiChatCompletionTool,
  AzureOpenAiChatCompletionRequestMessage,
  AzureOpenAiCreateChatCompletionResponse,
  AzureOpenAiCreateChatCompletionRequest,
  AzureOpenAiFunctionParameters,
  AzureOpenAiChatCompletionMessageToolCalls,
  AzureOpenAiChatCompletionRequestToolMessage,
  AzureOpenAiChatCompletionRequestFunctionMessage,
  AzureOpenAiChatCompletionRequestSystemMessage
} from '@sap-ai-sdk/foundation-models';
import type {
  BaseMessage,
  FunctionMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage
} from '@langchain/core/messages';
import type { ChatResult } from '@langchain/core/outputs';
import type { AzureOpenAiChatClient } from './chat.js';
import type { AzureOpenAiChatCallOptions } from './types.js';

/**
 * Maps a LangChain {@link StructuredTool} to {@link AzureOpenAiChatCompletionFunctions}.
 * @param tool - Base class for tools that accept input of any shape defined by a Zod schema.
 * @returns The OpenAI chat completion function.
 */
function mapToolToOpenAiFunction(tool: StructuredTool): {
  description?: string;
  name: string;
  parameters: AzureOpenAiFunctionParameters;
} & Record<string, any> {
  return {
    name: tool.name,
    description: tool.description,
    parameters: isZodSchema(tool.schema)
      ? zodToJsonSchema(tool.schema)
      : tool.schema
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
 * Maps {@link AzureOpenAiChatCompletionMessageToolCalls} to LangChain's {@link ToolCall}.
 * @param toolCalls - The {@link AzureOpenAiChatCompletionMessageToolCalls} response.
 * @returns The LangChain {@link ToolCall}.
 */
function mapAzureOpenAiToLangchainToolCall(
  toolCalls?: AzureOpenAiChatCompletionMessageToolCalls
): ToolCall[] | undefined {
  if (toolCalls) {
    return toolCalls.map(toolCall => ({
      id: toolCall.id,
      name: toolCall.function.name,
      args: JSON.parse(toolCall.function.arguments),
      type: 'tool_call'
    }));
  }
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
    generations: completionResponse.choices.map(choice => ({
      text: choice.message.content ?? '',
      message: new AIMessage({
        content: choice.message.content ?? '',
        tool_calls: mapAzureOpenAiToLangchainToolCall(
          choice.message.tool_calls
        ),
        additional_kwargs: {
          finish_reason: choice.finish_reason,
          index: choice.index,
          function_call: choice.message.function_call,
          tool_calls: choice.message.tool_calls
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
        completionTokens: completionResponse.usage?.completion_tokens ?? 0,
        promptTokens: completionResponse.usage?.prompt_tokens ?? 0,
        totalTokens: completionResponse.usage?.total_tokens ?? 0
      }
    }
  };
}

/**
 * Maps LangChain's {@link ToolCall} to Azure OpenAI's {@link AzureOpenAiChatCompletionMessageToolCalls}.
 * @param toolCalls - The {@link ToolCall} to map.
 * @returns The Azure OpenAI {@link AzureOpenAiChatCompletionMessageToolCalls}.
 */
function mapLangchainToolCallToAzureOpenAiToolCall(
  toolCalls?: ToolCall[]
): AzureOpenAiChatCompletionMessageToolCalls | undefined {
  if (toolCalls) {
    return toolCalls.map(toolCall => ({
      id: toolCall.id || uuidv4(),
      type: 'function',
      function: {
        name: toolCall.name,
        arguments: JSON.stringify(toolCall.args)
      }
    }));
  }
}

/**
 * Maps LangChain's {@link AIMessage} to Azure OpenAI's {@link AzureOpenAiChatCompletionRequestAssistantMessage}.
 * @param message - The {@link AIMessage} to map.
 * @returns The Azure OpenAI {@link AzureOpenAiChatCompletionRequestAssistantMessage}.
 */
function mapAiMessageToAzureOpenAiAssistantMessage(
  message: AIMessage
): AzureOpenAiChatCompletionRequestAssistantMessage {
  const tool_calls =
    mapLangchainToolCallToAzureOpenAiToolCall(message.tool_calls) ??
    message.additional_kwargs.tool_calls;
  return {
    name: message.name,
    ...(tool_calls?.length ? { tool_calls } : {}),
    function_call: message.additional_kwargs.function_call,
    content:
      message.content as AzureOpenAiChatCompletionRequestAssistantMessage['content'],
    role: 'assistant'
  };
}

function mapHumanMessageToAzureOpenAiUserMessage(
  message: HumanMessage
): AzureOpenAiChatCompletionRequestUserMessage {
  return {
    role: 'user',
    content:
      message.content as AzureOpenAiChatCompletionRequestUserMessage['content'],
    name: message.name
  };
}

function mapToolMessageToAzureOpenAiToolMessage(
  message: ToolMessage
): AzureOpenAiChatCompletionRequestToolMessage {
  return {
    role: 'tool',
    content:
      message.content as AzureOpenAiChatCompletionRequestToolMessage['content'],
    tool_call_id: message.tool_call_id
  };
}

function mapFunctionMessageToAzureOpenAiFunctionMessage(
  message: FunctionMessage
): AzureOpenAiChatCompletionRequestFunctionMessage {
  return {
    role: 'function',
    content:
      message.content as AzureOpenAiChatCompletionRequestFunctionMessage['content'],
    name: message.name || 'default'
  };
}

function mapSystemMessageToAzureOpenAiSystemMessage(
  message: SystemMessage
): AzureOpenAiChatCompletionRequestSystemMessage {
  return {
    role: 'system',
    content:
      message.content as AzureOpenAiChatCompletionRequestSystemMessage['content'],
    name: message.name
  };
}

/**
 * Maps {@link BaseMessage} to {@link AzureOpenAiChatMessage}.
 * @param message - The message to map.
 * @returns The {@link AzureOpenAiChatMessage}.
 */
// TODO: Add mapping of refusal property, once LangChain base class supports it natively.
function mapBaseMessageToAzureOpenAiChatMessage(
  message: BaseMessage
): AzureOpenAiChatCompletionRequestMessage {
  switch (message.getType()) {
    case 'ai':
      return mapAiMessageToAzureOpenAiAssistantMessage(message);
    case 'human':
      return mapHumanMessageToAzureOpenAiUserMessage(message);
    case 'system':
      return mapSystemMessageToAzureOpenAiSystemMessage(message);
    case 'function':
      return mapFunctionMessageToAzureOpenAiFunctionMessage(message);
    case 'tool':
      return mapToolMessageToAzureOpenAiToolMessage(message as ToolMessage);
    default:
      throw new Error(`Unsupported message type: ${message.getType()}`);
  }
}

function isStructuredToolArray(tools?: unknown[]): tools is StructuredTool[] {
  return !!tools?.every(
    tool =>
      tool !== undefined &&
      Array.isArray((tool as StructuredToolInterface).lc_namespace)
  );
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
  messages: BaseMessage[],
  options?: AzureOpenAiChatCallOptions & { promptIndex?: number }
): AzureOpenAiCreateChatCompletionRequest {
  return removeUndefinedProperties<AzureOpenAiCreateChatCompletionRequest>({
    messages: messages.map(mapBaseMessageToAzureOpenAiChatMessage),
    max_tokens: client.max_tokens === -1 ? undefined : client.max_tokens,
    presence_penalty: client.presence_penalty,
    frequency_penalty: client.frequency_penalty,
    temperature: client.temperature,
    top_p: client.top_p,
    logit_bias: client.logit_bias,
    user: client.user,
    data_sources: options?.data_sources,
    n: options?.n,
    response_format: options?.response_format,
    seed: options?.seed,
    logprobs: options?.logprobs,
    top_logprobs: options?.top_logprobs,
    function_call: options?.function_call,
    stop: options?.stop ?? client.stop,
    functions: isStructuredToolArray(options?.functions)
      ? options?.functions.map(mapToolToOpenAiFunction)
      : options?.functions,
    tools: isStructuredToolArray(options?.tools)
      ? options?.tools.map(mapToolToOpenAiTool)
      : options?.tools,
    tool_choice: options?.tool_choice
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
