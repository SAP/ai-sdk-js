import type {
  AzureOpenAiChatCompletionMessageToolCallChunk,
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
    | AzureOpenAiCreateChatCompletionStreamResponse['choices'][0]['finish_reason']
    | undefined {
    return this.findChoiceByIndex(choiceIndex)?.finish_reason;
  }

  /**
   * Parses the chunk response and returns the delta content.
   * @param choiceIndex - The index of the choice to parse.
   * @returns The message delta content.
   */
  getDeltaContent(choiceIndex = 0): string | undefined | null {
    return this.findChoiceByIndex(choiceIndex)?.delta.content;
  }

  /**
   * Gets the delta tool calls for a specific choice index.
   * @param choiceIndex - The index of the choice to parse.
   * @returns The delta tool calls for the specified choice index.
   */
  getDeltaToolCalls(
    choiceIndex = 0
  ): AzureOpenAiChatCompletionMessageToolCallChunk[] | undefined {
    return this.findChoiceByIndex(choiceIndex)?.delta.tool_calls;
  }

  /**
   * Parses the chunk response and returns the choice by index.
   * @param index - The index of the choice to find.
   * @returns An {@link LLMChoiceStreaming} object associated withe index.
   */
  findChoiceByIndex(
    index: number
  ): AzureOpenAiCreateChatCompletionStreamResponse['choices'][0] | undefined {
    return this.getChoices()?.find(c => c.index === index);
  }

  private getChoices() {
    return this.data.choices;
  }
}
