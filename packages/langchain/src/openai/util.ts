import { AIMessage, AIMessageChunk } from '@langchain/core/messages';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { v4 as uuidv4 } from 'uuid';
import { isZodSchema } from '@langchain/core/utils/types';
import type { ToolCall, ToolCallChunk } from '@langchain/core/messages/tool';
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
  AzureOpenAiChatCompletionRequestSystemMessage,
  AzureOpenAiFunctionObject,
  AzureOpenAiChatCompletionStreamChunkResponse,
  AzureOpenAiChatCompletionMessageToolCallChunk,
  AzureOpenAiCompletionUsage,
  AzureOpenAiCreateChatCompletionStreamResponse
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
import type {
  AzureOpenAiChatCallOptions,
  ChatAzureOpenAIToolType
} from './types.js';
import type {
  FunctionDefinition,
  ToolDefinition
} from '@langchain/core/language_models/base';
import { NewTokenIndices } from '@langchain/core/callbacks/base';

/**
 * Maps a {@link ChatAzureOpenAIToolType} to {@link AzureOpenAiFunctionObject}.
 * @param tool - Base class for tools that accept input of any shape defined by a Zod schema.
 * @param strict - Whether to enforce strict mode for the function call.
 * @returns The OpenAI chat completion function.
 * @internal
 */
export function mapToolToOpenAiFunction(
  tool: ChatAzureOpenAIToolType,
  strict?: boolean
): AzureOpenAiFunctionObject {
  if (isToolDefinitionLike(tool)) {
    return {
      name: tool.function.name,
      description: tool.function.description,
      parameters: tool.function.parameters ?? {
        type: 'object',
        properties: {}
      },
      ...// If strict defined in kwargs
      ((strict !== undefined && { strict }) ||
        // If strict defined in Azure OpenAI function, e.g., set previously when calling `bindTools()`.
        // Notice that LangChain ToolDeifnition does not have strict property.
        ('strict' in tool.function &&
          tool.function.strict !== undefined && {
          strict: tool.function.strict
        }))
    };
  }
  // StructuredTool like object
  return {
    name: tool.name,
    description: tool.description,
    parameters: isZodSchema(tool.schema)
      ? zodToJsonSchema(tool.schema)
      : tool.schema,
    ...(strict !== undefined && { strict })
  };
}

/**
 * Maps a LangChain {@link ChatAzureOpenAIToolType} to {@link AzureOpenAiChatCompletionTool}.
 * @param tool - Base class for tools that accept input of any shape defined by a Zod schema.
 * @param strict - Whether to enforce strict mode for the function call.
 * @returns The OpenAI chat completion tool.
 * @internal
 */
export function mapToolToOpenAiTool(
  tool: ChatAzureOpenAIToolType,
  strict?: boolean
): AzureOpenAiChatCompletionTool {
  return {
    type: 'function',
    function: mapToolToOpenAiFunction(tool, strict)
  };
}

/**
 * Maps {@link AzureOpenAiChatCompletionMessageToolCalls} to LangChain's {@link ToolCall} array.
 * @param toolCalls - The {@link AzureOpenAiChatCompletionMessageToolCalls} response.
 * @returns The LangChain {@link ToolCall}.
 */
function mapAzureOpenAiToLangChainToolCall(
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
        tool_calls: mapAzureOpenAiToLangChainToolCall(
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
      promptFilterResults: completionResponse.prompt_filter_results,
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
function mapLangChainToolCallToAzureOpenAiToolCall(
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
    mapLangChainToolCallToAzureOpenAiToolCall(message.tool_calls) ??
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
 * Maps {@link BaseMessage} to {@link AzureOpenAiChatCompletionRequestMessage}.
 * @param message - The message to map.
 * @returns The {@link AzureOpenAiChatCompletionRequestMessage}.
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

/**
 * Maps LangChain's input interface to the AI SDK client's input interface
 * @param client The LangChain Azure OpenAI client
 * @param options The {@link AzureOpenAiChatCallOptions}
 * @param messages The messages to be send
 * @returns An AI SDK compatibile request
 * @internal
 */
export function mapLangChainToAiClient(
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
    functions: options?.functions?.map(f => mapToolToOpenAiFunction(f)),
    tools: options?.tools?.map(t => mapToolToOpenAiTool(t)),
    tool_choice: options?.tool_choice
  });
}

/**
 * Converts Azure OpenAI stream chunk to a LangChain message chunk.
 * @param chunk - The Azure OpenAI stream chunk.
 * @returns An {@link AIMessageChunk}
 * @internal
 */
export function mapAzureOpenAIChunkToLangChainMessageChunk(
  chunk: AzureOpenAiChatCompletionStreamChunkResponse,
  choiceIndex: number
): AIMessageChunk {
  const { id, created, model, object, system_fingerprint } = chunk.data;
  const additional_kwargs: Record<string, unknown> = {
    id,
    created,
    model,
    object,
    system_fingerprint
  };

  const content = chunk.getDeltaContent(choiceIndex) ?? '';
  const toolCallChunks = chunk.getDeltaToolCalls(choiceIndex);

  let tool_call_chunks: ToolCallChunk[] = [];
  if (toolCallChunks) {
    tool_call_chunks = mapAzureOpenAIToLangChainToolCallChunk(toolCallChunks);
  }

  return new AIMessageChunk({ content, additional_kwargs, tool_call_chunks });
}

/**
 * Maps {@link AzureOpenAiChatCompletionMessageToolCallChunk} to LangChain's {@link ToolCallChunk}.
 * @param toolCallChunks - The {@link AzureOpenAiChatCompletionMessageToolCallChunk} in a stream response chunk.
 * @returns An array of LangChain {@link ToolCallChunk}.
 */
function mapAzureOpenAIToLangChainToolCallChunk(
  toolCallChunks: AzureOpenAiChatCompletionMessageToolCallChunk[]
): ToolCallChunk[] {
  return toolCallChunks.map(chunk => ({
    name: chunk.function?.name,
    args: chunk.function?.arguments,
    id: chunk.id,
    index: chunk.index,
    type: 'tool_call_chunk'
  }));
}

/**
 * Computes token indices for a chunk of the Azure OpenAI stream response.
 * @param chunk - A chunk of the Azure OpenAI stream response.
 * @returns An object with prompt and completion indices.
 * @internal
 */
export function computeTokenIndices(chunk: AzureOpenAiChatCompletionStreamChunkResponse, choiceIndex: number): NewTokenIndices {
  return {
    // TODO: This is wrong. We only get token for the whole response, not for each choice.
    prompt: choiceIndex,
    completion: chunk.getTokenUsage()?.total_tokens ?? 0
  };
}

/**
 * Sets finish reason on a LangChain message chunk if available.
 * @param messageChunk - The LangChain message chunk to update.
 * @param finishReason - The finish reason from the response.
 * @internal
 */
export function setFinishReason(
  messageChunk: AIMessageChunk,
  finishReason?: AzureOpenAiCreateChatCompletionStreamResponse['choices'][0]['finish_reason']
): void {
  if (finishReason) {
    messageChunk.response_metadata.finish_reason = finishReason;
  }
}

/**
 * Sets usage metadata on a message chunk if available.
 * @param messageChunk - The LangChain message chunk to update.
 * @param tokenUsage - The token usage information.
 * @internal
 */
export function setTokenUsage(
  messageChunk: AIMessageChunk,
  tokenUsage?: AzureOpenAiCompletionUsage
): void {
  if (tokenUsage) {
    messageChunk.usage_metadata = {
      input_tokens: tokenUsage.prompt_tokens,
      output_tokens: tokenUsage.completion_tokens,
      total_tokens: tokenUsage.total_tokens
    };
    messageChunk.response_metadata.token_usage = tokenUsage;
  }
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

type ToolDefinitionLike = Pick<ToolDefinition, 'type'> & {
  function: Omit<FunctionDefinition, 'parameters'> & {
    parameters?: AzureOpenAiFunctionParameters;
  };
};

/**
 * @internal
 */
export function isToolDefinitionLike(
  tool: ChatAzureOpenAIToolType
): tool is ToolDefinitionLike {
  return (
    typeof tool === 'object' &&
    tool !== null &&
    'type' in tool &&
    'function' in tool &&
    tool.function !== null &&
    'name' in tool.function
  );
}
