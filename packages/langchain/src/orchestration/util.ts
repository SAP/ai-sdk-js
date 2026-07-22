import { randomUUID } from 'node:crypto';
import { isInteropZodSchema } from '@langchain/core/utils/types';
import { toJsonSchema } from '@langchain/core/utils/json_schema';
import { AIMessage, AIMessageChunk } from '@langchain/core/messages';
import type { Xor } from '@sap-cloud-sdk/util';
import type { ToolDefinition } from '@langchain/core/language_models/base';
import type { ChatOrchestrationToolType } from './types.js';
import type { ChatResult } from '@langchain/core/outputs';
import type {
  OrchestrationStreamChunkResponse,
  PromptTemplate
} from '@sap-ai-sdk/orchestration';
import type {
  AssistantChatMessage,
  CacheControl,
  ChatCompletionTool,
  ChatMessage,
  ChatMessageContent,
  CompletionPostResponse,
  DeveloperChatMessage,
  FunctionObject,
  MessageToolCalls,
  SystemChatMessage,
  TokenUsage,
  ToolChatMessage,
  UserChatMessage,
  TemplateRef,
  ToolCallChunk as OrchestrationToolCallChunk
} from '@sap-ai-sdk/orchestration/internal.js';
import type { ToolCall, ToolCallChunk } from '@langchain/core/messages/tool';
import type {
  BaseMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage
} from '@langchain/core/messages';

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
        // Notice that LangChain ToolDefinition does not have strict property.
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
    parameters: isInteropZodSchema(tool.schema)
      ? toJsonSchema(tool.schema)
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
 * Checks if the object is a {@link TemplateRef}.
 * @param object - The object to check.
 * @returns True if the object is a {@link TemplateRef}.
 * @internal
 */
export function isTemplateRef(
  object: Xor<PromptTemplate, TemplateRef>
): object is TemplateRef {
  return object && typeof object === 'object' && 'template_ref' in object;
}

/**
 * Maps {@link BaseMessage} to {@link ChatMessage}.
 * @param message - The message to map.
 * @returns The {@link ChatMessage}.
 */
// TODO: Add mapping of refusal property, once LangChain base class supports it natively.
function mapBaseMessageToChatMessage(message: BaseMessage): ChatMessage {
  switch (message.type) {
    case 'ai':
      return mapAiMessageToOrchestrationAssistantMessage(message as AIMessage);
    case 'human':
      return mapHumanMessageToChatMessage(message as HumanMessage);
    case 'system':
      return mapSystemMessageToOrchestrationSystemMessage(
        message as SystemMessage
      );
    case 'tool':
      return mapToolMessageToOrchestrationToolMessage(message as ToolMessage);
    default:
      throw new Error(`Unsupported message type: ${message.type}`);
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
      id: toolCall.id || randomUUID(),
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
    content: cloneMessageContent(message.content),
    role: 'assistant'
  } as AssistantChatMessage;
}

function cloneMessageContent<TContent>(content: TContent): TContent {
  if (!Array.isArray(content)) {
    return content;
  }

  // Shallow-clone blocks so cache_control mutations never touch caller-owned messages.
  return content.map(block =>
    block && typeof block === 'object' ? { ...block } : block
  ) as TContent;
}

function mapHumanMessageToChatMessage(message: HumanMessage): UserChatMessage {
  const content = Array.isArray(message.content)
    ? message.content.map(item => ({
        ...item,
        ...(item.type === 'image_url' && typeof item.image_url === 'string'
          ? {
              image_url: {
                url: item.image_url
              }
            }
          : {})
      }))
    : message.content;

  return {
    role: 'user',
    content
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
      'The content type of system message can only be "text" in the Orchestration Client.'
    );
  }
  return {
    role: 'system',
    content: cloneMessageContent(message.content) as ChatMessageContent
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
      'The content type of tool message can only be "text" in the Orchestration Client.'
    );
  }
  return {
    role: 'tool',
    content: cloneMessageContent(message.content) as ChatMessageContent,
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
 * Applies a cache breakpoint to the last cacheable block of the last message in place.
 * @param messages - The orchestration messages to mutate.
 * @param cacheControl - The cache control directive to apply.
 * @internal
 */
export function applyCacheControlToLastMessage(
  messages: ChatMessage[],
  cacheControl: CacheControl
): void {
  const lastMessage = messages.at(-1);
  if (!lastMessage) {
    return;
  }

  if (typeof lastMessage.content === 'string') {
    if (
      lastMessage.role === 'system' ||
      lastMessage.role === 'tool' ||
      lastMessage.role === 'developer'
    ) {
      (
        lastMessage as
          SystemChatMessage | ToolChatMessage | DeveloperChatMessage
      ).content = [
        {
          type: 'text',
          text: lastMessage.content,
          cache_control: cacheControl
        }
      ];
      return;
    }

    if (lastMessage.role === 'user') {
      (lastMessage as UserChatMessage).content = [
        {
          type: 'text',
          text: lastMessage.content,
          cache_control: cacheControl
        }
      ];
    }
    // Assistant string content has no cacheable block; leave untouched.
    return;
  }

  if (!Array.isArray(lastMessage.content)) {
    return;
  }

  const isUserMessage = lastMessage.role === 'user';
  const block = lastMessage.content.findLast(
    b =>
      b &&
      typeof b === 'object' &&
      (b.type === 'text' ||
        (isUserMessage && (b.type === 'image_url' || b.type === 'file')))
  );
  if (block) {
    (block as { cache_control?: CacheControl }).cache_control = cacheControl;
  }
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
 * Builds the LangChain `usage_metadata` shape from an orchestration {@link TokenUsage}.
 * @param usage - The orchestration token usage.
 * @returns The LangChain `usage_metadata` object.
 */
function buildUsageMetadata(usage: TokenUsage): {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  input_token_details?: { cache_read: number; cache_creation: number };
  output_token_details?: { reasoning: number };
} {
  const reasoning = usage.completion_tokens_details?.reasoning_tokens;

  return {
    input_tokens: usage.prompt_tokens,
    output_tokens: usage.completion_tokens,
    total_tokens: usage.total_tokens,
    ...(usage.prompt_tokens_details?.cached_tokens !== undefined && {
      input_token_details: {
        cache_read: usage.prompt_tokens_details.cached_tokens ?? 0,
        cache_creation: usage.prompt_tokens_details.cache_creation_tokens ?? 0
      }
    }),
    ...(reasoning !== undefined && {
      output_token_details: { reasoning }
    })
  };
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
  const { final_result, intermediate_results, request_id } = completionResponse;
  const { choices, created, id, model, object, usage, system_fingerprint } =
    final_result;
  const tokenUsage = {
    completionTokens: usage?.completion_tokens ?? 0,
    promptTokens: usage?.prompt_tokens ?? 0,
    totalTokens: usage?.total_tokens ?? 0
  };
  return {
    generations: choices.map(choice => ({
      text: choice.message.content ?? '',
      message: new AIMessage({
        content: choice.message.content ?? '',
        tool_calls: mapOrchestrationToLangChainToolCall(
          choice.message.tool_calls
        ),
        response_metadata: { tokenUsage },
        usage_metadata: usage
          ? buildUsageMetadata(usage)
          : { input_tokens: 0, output_tokens: 0, total_tokens: 0 }
      }),
      additional_kwargs: {
        tool_calls: choice.message.tool_calls,
        intermediate_results
      },
      generationInfo: {
        finish_reason: choice.finish_reason,
        index: choice.index,
        tool_calls: choice.message.tool_calls,
        request_id
      }
    })),
    llmOutput: {
      created,
      id,
      model,
      object,
      system_fingerprint,
      tokenUsage
    }
  };
}

/**
 * @internal
 */
function isToolDefinitionLike(
  tool: ChatOrchestrationToolType
): tool is ChatCompletionTool | ToolDefinition {
  return (
    typeof tool === 'object' &&
    tool !== null &&
    'type' in tool &&
    'function' in tool &&
    tool.function !== null &&
    'name' in tool.function
  );
}

/**
 * Converts orchestration stream chunk to a LangChain message chunk.
 * @param chunk - The orchestration stream chunk.
 * @returns An {@link AIMessageChunk}.
 * @internal
 */
export function mapOrchestrationChunkToLangChainMessageChunk(
  chunk: OrchestrationStreamChunkResponse
): AIMessageChunk {
  const choice = chunk._data.final_result?.choices[0];
  const content = chunk.getDeltaContent() ?? '';
  const toolCallChunks = choice?.delta.tool_calls;
  const usage = chunk.getTokenUsage();
  return new AIMessageChunk({
    content,
    additional_kwargs: {
      // TODO: Fix duplicated intermediate results when using concat() method for streaming chunks.
      intermediate_results: chunk._data.intermediate_results
    },
    ...(toolCallChunks && {
      tool_call_chunks: mapOrchestrationToLangChainToolCallChunk(toolCallChunks)
    }),
    ...(usage && { usage_metadata: buildUsageMetadata(usage) })
  });
}
