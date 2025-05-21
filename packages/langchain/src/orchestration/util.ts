import { AIMessage } from '@langchain/core/messages';
import { v4 as uuidv4 } from 'uuid';
import type { ChatResult } from '@langchain/core/outputs';
import type {
  AssistantChatMessage,
  ChatMessage,
  ChatMessageContent,
  CompletionPostResponse,
  MessageToolCalls,
  SystemChatMessage,
  Template,
  ToolChatMessage,
  UserChatMessage
} from '@sap-ai-sdk/orchestration';
import type { ToolCall } from '@langchain/core/messages/tool';
import type {
  BaseMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage
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
      return mapAiMessageToOrchestrationAssistantMessage(message);
    case 'human':
      return mapHumanMessageToChatMessage(message);
    case 'system':
      return mapSystemMessageToOrchestrationSystemMessage(message);
    case 'tool':
      return mapToolMessageToOrchestrationToolMessage(message as ToolMessage);
    case 'function':
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
