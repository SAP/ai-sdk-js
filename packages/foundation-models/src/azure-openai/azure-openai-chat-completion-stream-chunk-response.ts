import type {
  AzureOpenAiCompletionUsage,
  AzureOpenAiCreateChatCompletionStreamResponse
} from './client/inference/schema/index.js';

/**
 * Azure OpenAI chat completion stream chunk response.
 */
export class AzureOpenAiChatCompletionStreamChunkResponse {
  constructor(
    public readonly data: AzureOpenAiCreateChatCompletionStreamResponse
  ) {
    this.data = data;
  }

  /**
   * Usage of tokens in the chunk response.
   * @returns Token usage.
   */
  getTokenUsage(): AzureOpenAiCompletionUsage | null {
    return this.data.usage;
  }

  /**
   * Reason for stopping the completion stream chunk.
   * @param choiceIndex - The index of the choice to parse.
   * @returns The finish reason.
   */
  getFinishReason(
    choiceIndex = 0
  ):
    | 'stop'
    | 'length'
    | 'tool_calls'
    | 'content_filter'
    | 'function_call'
    | null
    | undefined {
    return this.data.choices.find(c => c.index === choiceIndex)?.finish_reason;
  }

  /**
   * Parses the chunk response and returns the delta content.
   * @param choiceIndex - The index of the choice to parse.
   * @returns The message delta content.
   */
  getDeltaContent(choiceIndex = 0): string | undefined | null {
    return this.data.choices.find(c => c.index === choiceIndex)?.delta.content;
  }
}
