import { HttpResponse } from '@sap-cloud-sdk/http-client';
import { createLogger } from '@sap-cloud-sdk/util';
import { OpenAiChatCompletionOutput, OpenAiUsage } from './openai-types.js';

const logger = createLogger({
  package: 'gen-ai-hub',
  messageContext: 'openai-response'
});

/**
 * Open AI chat completion response.
 */
export class OpenAiChatCompletionResponse {
  public readonly data: OpenAiChatCompletionOutput;
  constructor(public readonly rawResponse: HttpResponse) {
    this.data = rawResponse.data;
  }

  /**
   * Usage of tokens in the response.
   * @returns Token usage.
   */
  getTokenUsage(): OpenAiUsage {
    return this.data.usage;
  }
  /**
   * Reason for stopping the model.
   * @returns The finish reason.
   */
  getFinishReason(): string | null {
    return this.data.choices[0].finish_reason;
  }

  /**
   * Parses the Open AI response and returns the content.
   * @param choiceIndex - The index of the choice to parse.
   * @returns The message content.
   */
  getContent(choiceIndex: number = 0): string | null {
    const choices = this.data.choices;
    if (choiceIndex < 0 || choiceIndex >= choices.length) {
      logger.error(`${choiceIndex} is not a valid choice index.`);
      return null;
    }
    return choices[choiceIndex].message.content;
  }
}
