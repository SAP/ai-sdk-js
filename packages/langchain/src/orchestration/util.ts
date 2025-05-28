import { v4 as uuidv4 } from 'uuid';
import { isZodSchema } from '@langchain/core/utils/types';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { AIMessage, AIMessageChunk } from '@langchain/core/messages';
import type {
  FunctionDefinition,
  ToolDefinition
} from '@langchain/core/language_models/base';
import type { ChatOrchestrationToolType } from './types.js';
import type { ChatResult } from '@langchain/core/outputs';
import type {
  AssistantChatMessage,
  ChatCompletionTool,
  ChatMessage,
  ChatMessageContent,
  CompletionPostResponse,
  FunctionObject,
  FunctionParameters,
  MessageToolCalls,
  SystemChatMessage,
  Template,
  ToolChatMessage,
  UserChatMessage,
  TemplatingModuleConfig,
  TemplateRef,
  ToolCallChunk as OrchestrationToolCallChunk,
  OrchestrationStreamChunkResponse,
  TokenUsage
} from '@sap-ai-sdk/orchestration';
import type { ToolCall, ToolCallChunk } from '@langchain/core/messages/tool';
import type {
  BaseMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage
} from '@langchain/core/messages';
import { url } from 'inspector';

/**
 * Maps a {@link ChatOrchestrationToolType} to {@link FunctionObject}.
 * @param tool - Base class for tools that accept input of any shape defined by a Zod schema.
 * @param strict - Whether to enforce strict mode for the function call.
 * @returns The Orchestration chat completion function.
 * @internal
 */
export function mapToolToOrchestrationFunction(
  tool: ChatOrchestrationToolType,
  strict?: boolean
): FunctionObject {
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
        // If strict defined in Orchestration tool function, e.g., set previously when calling `bindTools()`.
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
 * Maps a LangChain {@link ChatOrchestrationToolType} to {@link ChatCompletionTool}.
 * @param tool - Base class for tools that accept input of any shape defined by a Zod schema.
 * @param strict - Whether to enforce strict mode for the function call.
 * @returns The Orchestration chat completion tool.
 * @internal
 */
export function mapToolToChatCompletionTool(
  tool: ChatOrchestrationToolType,
  strict?: boolean
): ChatCompletionTool {
  return {
    type: 'function',
    function: mapToolToOrchestrationFunction(tool, strict)
  };
}
/**
 * Checks if the object is a {@link Template}.
 * @param object - The object to check.
 * @returns True if the object is a {@link Template}.
 * @internal
 */
export function isTemplate(object: TemplatingModuleConfig): object is Template {
  return 'template' in object;
}

/**
 * Checks if the object is a {@link TemplateRef}.
 * @param object - The object to check.
 * @returns True if the object is a {@link TemplateRef}.
 * @internal
 */
export function isTemplateRef(
  object: TemplatingModuleConfig
): object is TemplateRef {
  return 'template_ref' in object;
}

/**
 * Maps {@link BaseMessage} to {@link ChatMessage}.
 * @param message - The message to map.
 * @returns The {@link ChatMessage}.
 */
// TODO: Add mapping of refusal property, once LangChain base class supports it natively.
function mapBaseMessageToChatMessage(message: BaseMessage): ChatMessage {
  switch (message.getType()) {
    case 'ai':
      return mapAiMessageToOrchestrationAssistantMessage(message);
    case 'human':
      return mapHumanMessageToChatMessage(message);
    case 'system':
      return mapSystemMessageToOrchestrationSystemMessage(message);
    case 'tool':
      return mapToolMessageToOrchestrationToolMessage(message as ToolMessage);
    default:
      throw new Error(`Unsupported message type: ${message.getType()}`);
  }
}

/**
 * Maps LangChain's {@link ToolCall} to Orchestration's {@link MessageToolCalls}.
 * @param toolCalls - The {@link ToolCall} to map.
 * @returns The Orchestration {@link MessageToolCalls}.
 */
function mapLangChainToolCallToOrchestrationToolCall(
  toolCalls?: ToolCall[]
): MessageToolCalls | undefined {
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
 * Maps LangChain's {@link AIMessage} to Orchestration's {@link AssistantChatMessage}.
 * @param message - The {@link AIMessage} to map.
 * @returns The Orchestration {@link AssistantChatMessage}.
 */
function mapAiMessageToOrchestrationAssistantMessage(
  message: AIMessage
): AssistantChatMessage {
  const tool_calls =
    mapLangChainToolCallToOrchestrationToolCall(message.tool_calls) ??
    message.additional_kwargs.tool_calls;
  return {
    ...(tool_calls?.length ? { tool_calls } : {}),
    content: message.content,
    role: 'assistant'
  } as AssistantChatMessage;
}

function mapHumanMessageToChatMessage(message: HumanMessage): UserChatMessage {
  if (Array.isArray(message.content)) {
    message.content = message.content.map(content => ({
      ...content,
      ...(content.type === 'image_url' && typeof content.image_url === 'string' ? {
        image_url: {
          url: content.image_url
        }
      } : {})
    }));
  }
  return {
    role: 'user',
    content: message.content
  } as UserChatMessage;
}

function mapSystemMessageToOrchestrationSystemMessage(
  message: SystemMessage
): SystemChatMessage {
  if (
    typeof message.content !== 'string' &&
    message.content.some(content => content.type !== 'text')
  ) {
    throw new Error(
      'The content type of system message can only be "text" the Orchestration Client.'
    );
  }
  return {
    role: 'system',
    content: message.content as ChatMessageContent
  };
}

function mapToolMessageToOrchestrationToolMessage(
  message: ToolMessage
): ToolChatMessage {
  if (
    typeof message.content !== 'string' &&
    message.content.some(content => content.type !== 'text')
  ) {
    throw new Error(
      'The content type of tool message can only be "text" the Orchestration Client.'
    );
  }
  return {
    role: 'tool',
    content: message.content as ChatMessageContent,
    tool_call_id: message.tool_call_id
  };
}

/**
 * Maps LangChain messages to orchestration messages.
 * @param messages - The LangChain messages to map.
 * @returns The orchestration messages mapped from LangChain messages.
 * @internal
 */
export function mapLangChainMessagesToOrchestrationMessages(
  messages: BaseMessage[]
): ChatMessage[] {
  return messages.map(mapBaseMessageToChatMessage);
}

/**
 * Maps {@link MessageToolCalls} to LangChain's {@link ToolCall}.
 * @param toolCalls - The {@link MessageToolCalls} response.
 * @returns The LangChain {@link ToolCall}.
 */
function mapOrchestrationToLangChainToolCall(
  toolCalls?: MessageToolCalls
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
 * Maps {@link OrchestrationToolCallChunk} to LangChain's {@link ToolCallChunk}.
 * @param toolCallChunks - The {@link OrchestrationToolCallChunk} in a stream response chunk.
 * @returns An array of LangChain {@link ToolCallChunk}.
 */
function mapOrchestrationToLangChainToolCallChunk(
  toolCallChunks: OrchestrationToolCallChunk[]
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
 * Maps the completion response to a {@link ChatResult}.
 * @param completionResponse - The completion response to map.
 * @returns The mapped {@link ChatResult}.
 * @internal
 */
export function mapOutputToChatResult(
  completionResponse: CompletionPostResponse
): ChatResult {
  const { orchestration_result, module_results, request_id } =
    completionResponse;
  const { choices, created, id, model, object, usage, system_fingerprint } =
    orchestration_result;
  return {
    generations: choices.map(choice => ({
      text: choice.message.content ?? '',
      message: new AIMessage({
        content: choice.message.content ?? '',
        tool_calls: mapOrchestrationToLangChainToolCall(
          choice.message.tool_calls
        ),
        additional_kwargs: {
          finish_reason: choice.finish_reason,
          index: choice.index,
          function_call: choice.message.function_call,
          tool_calls: choice.message.tool_calls,
          module_results,
          request_id
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
      created,
      id,
      model,
      object,
      system_fingerprint,
      tokenUsage: {
        completionTokens: usage?.completion_tokens ?? 0,
        promptTokens: usage?.prompt_tokens ?? 0,
        totalTokens: usage?.total_tokens ?? 0
      }
    }
  };
}

type ToolDefinitionLike = Pick<ToolDefinition, 'type'> & {
  function: Omit<FunctionDefinition, 'parameters'> & {
    parameters?: FunctionParameters;
  };
};

/**
 * @internal
 */
export function isToolDefinitionLike(
  tool: ChatOrchestrationToolType
): tool is ToolDefinitionLike {
  return (
    typeof tool === 'object' &&
    tool !== null &&
    'type' in tool &&
    tool.type === 'function' &&
    'function' in tool &&
    tool.function !== null &&
    'name' in tool.function &&
    typeof tool.function.name === 'string' &&
    tool.function.name !== null
  );
}

/**
 * Converts orchestration stream chunk to a LangChain message chunk.
 * @param chunk - The orchestration stream chunk.
 * @returns An {@link AIMessageChunk}
 * @internal
 */
export function mapOrchestrationChunkToLangChainMessageChunk(
  chunk: OrchestrationStreamChunkResponse
): AIMessageChunk {
  const { module_results, request_id } = chunk.data;
  const content = chunk.getDeltaContent() ?? '';
  const toolCallChunks = chunk.getDeltaToolCalls();

  const additional_kwargs: Record<string, unknown> = {
    module_results,
    request_id
  };

  let tool_call_chunks: ToolCallChunk[] = [];
  if (toolCallChunks) {
    tool_call_chunks = mapOrchestrationToLangChainToolCallChunk(toolCallChunks);
  }
  // Use `AIMessageChunk` to represent message chunks for roles such as 'tool' and 'user' as well.
  // While the `ChatDelta` type can accommodate other roles in the orchestration service's stream chunk response, in realtime, we only expect messages with the 'assistant' role to be returned.
  return new AIMessageChunk({ content, additional_kwargs, tool_call_chunks });
}

/**
 * Sets finish reason on a LangChain message chunk if available.
 * @param messageChunk - The LangChain message chunk to update.
 * @param finishReason - The finish reason from the response.
 * @internal
 */
export function setFinishReason(
  messageChunk: AIMessageChunk,
  finishReason?: string
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
  tokenUsage?: TokenUsage
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

/**
 * Computes token indices for a chunk of the orchestration stream response.
 * @param chunk - A chunk of the orchestration stream response.
 * @returns An object with prompt and completion indices.
 * @internal
 */
// TODO: Remove after https://github.com/SAP/ai-sdk-js-backlog/issues/321
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function computeTokenIndices(chunk: OrchestrationStreamChunkResponse): {
  prompt: number;
  completion: number;
} {
  return {
    // Indicates the token is part of the first prompt
    prompt: 0,
    // Hardcoding to 0 as mutiple choices are not currently supported in the orchestration service.
    // TODO: Switch to `chunk.data.orchestration_result.choices[0].index` when support is added via https://github.com/SAP/ai-sdk-js-backlog/issues/321
    completion: 0
  };
}
