import { createLogger } from '@sap-cloud-sdk/util';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';
import type { AzureOpenAiCreateChatCompletionResponse } from './client/inference/schema/index.js';

const logger = createLogger({
  package: 'foundation-models',
  messageContext: 'azure-openai-chat-completion-stream-response'
});

/**
 * Azure OpenAI chat completion stream response.
 */
export class AzureOpenAiChatCompletionStreamResponse {
  /**
   * The chat completion stream response.
   */
  constructor(public readonly data: any) {
    this.data = data;
  }

  /**
   * Reason for stopping the completion stream.
   * @param choiceIndex - The index of the choice to parse.
   * @returns The finish reason.
   */
  getFinishReason(
    choiceIndex = 0
  ): this['data']['choices'][0]['finish_reason'] {
    this.logInvalidChoiceIndex(choiceIndex);
    return this.data.choices[choiceIndex]?.finish_reason;
  }

  /**
   * Parses the Azure OpenAI response and returns the delta content.
   * @param choiceIndex - The index of the choice to parse.
   * @returns The message delta content.
   */
  getDeltaContent(choiceIndex = 0): string | undefined | null {
    this.logInvalidChoiceIndex(choiceIndex);
    return this.data.choices[choiceIndex]?.delta?.content;
  }

  private logInvalidChoiceIndex(choiceIndex: number): void {
    if (choiceIndex < 0 || choiceIndex >= this.data.choices.length) {
      logger.error(`Choice index ${choiceIndex} is out of bounds.`);
    }
  }
}
