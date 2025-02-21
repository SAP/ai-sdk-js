import { AIMessage } from '@langchain/core/messages';
import type { ChatMessages } from '@sap-ai-sdk/orchestration';
import type { ToolCall } from '@langchain/core/messages/tool';
import type {
  AzureOpenAiCreateChatCompletionResponse,
  AzureOpenAiChatCompletionMessageToolCalls
} from '@sap-ai-sdk/foundation-models';
import type {
  BaseMessage
} from '@langchain/core/messages';
import type { ChatResult } from '@langchain/core/outputs';

/**
 * Maps LangChain messages to Orchestration messages.
 * @param messages - The messages to map.
 * @returns The mapped messages.
 */
export function mapLangchainMessagesToOrchestrationMessages(
  messages: BaseMessage[]
): ChatMessages {
    return [];
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
