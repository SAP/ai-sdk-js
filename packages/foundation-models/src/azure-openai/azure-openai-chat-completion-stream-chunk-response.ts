import { createLogger } from '@sap-cloud-sdk/util';

const logger = createLogger({
  package: 'foundation-models',
  messageContext: 'azure-openai-chat-completion-stream-chunk-response'
});

/**
 * Azure OpenAI chat completion stream chunk response.
 */
export class AzureOpenAiChatCompletionStreamChunkResponse {
  constructor(public readonly chunk: any) {
    this.chunk = chunk;
  }

  /**
   * Usage of tokens in the chunk response.
   * @returns Token usage.
   */
  getTokenUsage(): this['chunk']['usage'] {
    return this.chunk.usage;
  }

  /**
   * Reason for stopping the completion stream chunk.
   * @param choiceIndex - The index of the choice to parse.
   * @returns The finish reason.
   */
  getFinishReason(
    choiceIndex = 0
  ): this['chunk']['choices'][0]['finish_reason'] {
    return this.chunk.choices[choiceIndex]?.finish_reason;
  }

  /**
   * Parses the chunk response and returns the delta content.
   * @param choiceIndex - The index of the choice to parse.
   * @returns The message delta content.
   */
  getDeltaContent(choiceIndex = 0): string | undefined | null {
    return this.chunk.choices[choiceIndex]?.delta?.content;
  }
}
