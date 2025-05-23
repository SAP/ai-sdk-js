import { AIMessage, AIMessageChunk } from '@langchain/core/messages';
import type { ChatResult } from '@langchain/core/outputs';
import type {
  ChatMessage,
  CompletionPostResponse,
  Template,
  ToolCallChunk as OrchestrationToolCallChunk,
  OrchestrationStreamChunkResponse,
  TokenUsage,
  TemplatingModuleConfig
} from '@sap-ai-sdk/orchestration';
import type { ToolCall, ToolCallChunk } from '@langchain/core/messages/tool';
import type { AzureOpenAiChatCompletionMessageToolCalls } from '@sap-ai-sdk/foundation-models';
import type {
  BaseMessage,
  HumanMessage,
  SystemMessage
} from '@langchain/core/messages';

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
export function mapLangChainMessagesToOrchestrationMessages(
  messages: BaseMessage[]
): ChatMessage[] {
  return messages.map(mapBaseMessageToChatMessage);
}

/**
 * Maps {@link AzureOpenAiChatCompletionMessageToolCalls} to LangChain's {@link ToolCall}.
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
        tool_calls: mapAzureOpenAiToLangChainToolCall(
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
