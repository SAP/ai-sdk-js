import { AIMessage } from '@langchain/core/messages';
import { OrchestrationMessageChunk } from './orchestration-message-chunk.js';
import type { ChatResult } from '@langchain/core/outputs';
import type {
  ChatDelta,
  ChatMessage,
  CompletionPostResponse,
  CompletionPostResponseStreaming,
  Template,
  ToolCallChunk as OrchestrationToolCallChunk
} from '@sap-ai-sdk/orchestration';
import type { ToolCall, ToolCallChunk } from '@langchain/core/messages/tool';
import type { AzureOpenAiChatCompletionMessageToolCalls } from '@sap-ai-sdk/foundation-models';
import type {
  BaseMessage,
  BaseMessageChunk,
  HumanMessage,
  SystemMessage
} from '@langchain/core/messages';

/**
 * Checks if the object is a {@link Template}.
 * @param object - The object to check.
 * @returns True if the object is a {@link Template}.
 * @internal
 */
export function isTemplate(object: Record<string, any>): object is Template {
  return 'template' in object;
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
      return mapAiMessageToAzureOpenAiAssistantMessage(message);
    case 'human':
      return mapHumanMessageToChatMessage(message);
    case 'system':
      return mapSystemMessageToAzureOpenAiSystemMessage(message);
    // TODO: As soon as tool messages are supported by orchestration, create mapping function similar to our azure mapping function.
    case 'function':
    case 'tool':
    default:
      throw new Error(`Unsupported message type: ${message.getType()}`);
  }
}

/**
 * Maps LangChain's {@link AIMessage} to Azure OpenAI's {@link AzureOpenAiChatCompletionRequestAssistantMessage}.
 * @param message - The {@link AIMessage} to map.
 * @returns The Azure OpenAI {@link AzureOpenAiChatCompletionRequestAssistantMessage}.
 */
function mapAiMessageToAzureOpenAiAssistantMessage(
  message: AIMessage
): ChatMessage {
  /* TODO: Tool calls are currently bugged in orchestration, pass these fields as soon as orchestration supports it.
  const tool_calls =
    mapLangchainToolCallToAzureOpenAiToolCall(message.tool_calls) ??
    message.additional_kwargs.tool_calls;
  */
  return {
    /* TODO: Tool calls are currently bugged in orchestration, pass these fields as soon as orchestration supports it.
    ...(tool_calls?.length ? { tool_calls } : {}),
    function_call: message.additional_kwargs.function_call,
    */
    content: message.content,
    role: 'assistant'
  } as ChatMessage;
}

function mapHumanMessageToChatMessage(message: HumanMessage): ChatMessage {
  return {
    role: 'user',
    content: message.content
  } as ChatMessage;
}

function mapSystemMessageToAzureOpenAiSystemMessage(
  message: SystemMessage
): ChatMessage {
  // TODO: Remove as soon as image_url is a supported input for system messages in orchestration.
  if (
    typeof message.content !== 'string' &&
    message.content.some(content => content.type === 'image_url')
  ) {
    throw new Error(
      'System messages with image URLs are not supported by the Orchestration Client.'
    );
  }
  return {
    role: 'system',
    content: message.content
  } as ChatMessage;
}

/**
 * Maps LangChain messages to orchestration messages.
 * @param messages - The LangChain messages to map.
 * @returns The orchestration messages mapped from LangChain messages.
 * @internal
 */
export function mapLangchainMessagesToOrchestrationMessages(
  messages: BaseMessage[]
): ChatMessage[] {
  return messages.map(mapBaseMessageToChatMessage);
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
 * Maps {@link OrchestrationToolCallChunk} to LangChain's {@link ToolCallChunk}.
 * @param toolCallChunks - The {@link OrchestrationToolCallChunk} in a stream response chunk.
 * @returns An array of LangChain {@link ToolCallChunk}.
 */
function mapOrchestrationToLangchainToolCallChunk(
  toolCallChunks: OrchestrationToolCallChunk[]
): ToolCallChunk[] {
  const tool_call_chunks: ToolCallChunk[] = [];
  for (const chunk of toolCallChunks) {
    tool_call_chunks.push({
      name: chunk.function?.name,
      args: chunk.function?.arguments,
      id: chunk.id,
      index: chunk.index,
      type: 'tool_call_chunk'
    });
  }
  return tool_call_chunks;
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
        tool_calls: mapAzureOpenAiToLangchainToolCall(
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

/**
 * Converts orchestration stream chunk to an appropriate message chunk based on role.
 * @param chunkData - The content of the message.
 * @param delta - The delta content from the chunk.
 * @param defaultRole - The default role to use if not specified in the delta.
 * @returns A message chunk of the appropriate type based on the role.
 * @internal
 */
export function _convertOrchestrationChunkToMessageChunk(
  chunkData: CompletionPostResponseStreaming,
  delta: ChatDelta,
  defaultRole?: string
): BaseMessageChunk {
  const { module_results, request_id } = chunkData;
  const role = delta.role ?? defaultRole ?? 'assistant';
  const content = delta.content ?? '';

  // Handle additional kwargs for function and tool calls
  const additional_kwargs: Record<string, unknown> = {};

  // Handle tool calls
  if (delta.tool_calls && delta.tool_calls.length > 0) {
    additional_kwargs.tool_calls = delta.tool_calls;
  }

  // Create tool call chunks if present
  let tool_call_chunks: ToolCallChunk[] = [];
  if (Array.isArray(delta.tool_calls)) {
    tool_call_chunks = mapOrchestrationToLangchainToolCallChunk(
      delta.tool_calls
    );
  }
  const toolCallId = delta.tool_calls?.[0]?.id ?? undefined;
  // Use OrchestrationMessageChunk to represent message chunks for roles like 'tool' and 'user' too
  return new OrchestrationMessageChunk(
    { content, additional_kwargs, tool_call_chunks },
    module_results ?? {},
    request_id,
    { role, ...(toolCallId && { tool_call_id: toolCallId }) }
  );
}
