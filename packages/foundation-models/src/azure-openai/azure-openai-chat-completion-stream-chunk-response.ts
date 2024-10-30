/**
 * Azure OpenAI chat completion stream chunk response.
 */
export class AzureOpenAiChatCompletionStreamChunkResponse {
  constructor(public readonly data: any) {
    // TODO: Change `any` to `CreateChatCompletionStreamResponse` once the preview spec becomes stable.
    this.data = data;
  }

  /**
   * Usage of tokens in the chunk response.
   * @returns Token usage.
   */
  getTokenUsage(): this['data']['usage'] {
    return this.data.usage;
  }

  /**
   * Reason for stopping the completion stream chunk.
   * @param choiceIndex - The index of the choice to parse.
   * @returns The finish reason.
   */
  getFinishReason(
    choiceIndex = 0
  ): this['data']['choices'][0]['finish_reason'] {
    return this.data.choices[choiceIndex]?.finish_reason;
  }

  /**
   * Parses the chunk response and returns the delta content.
   * @param choiceIndex - The index of the choice to parse.
   * @returns The message delta content.
   */
  getDeltaContent(choiceIndex = 0): string | undefined | null {
    return this.data.choices[choiceIndex]?.delta?.content;
  }
}
