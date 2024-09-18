import { HttpResponse } from '@sap-cloud-sdk/http-client';
import { createLogger } from '@sap-cloud-sdk/util';
import type { AzureOpenAiCreateChatCompletionResponse } from './client/inference/schema/index.js';

const logger = createLogger({
  package: 'gen-ai-hub',
  messageContext: 'azure-openai-response'
});

/**
 * Azure OpenAI chat completion response.
 */
export class AzureOpenAiChatCompletionResponse {
  /**
   * The chat completion response.
   */
  public readonly data: AzureOpenAiCreateChatCompletionResponse;
  constructor(public readonly rawResponse: HttpResponse) {
    this.data = rawResponse.data;
  }

  /**
   * Usage of tokens in the response.
   * @returns Token usage.
   */
  getTokenUsage(): this['data']['usage'] {
    return this.data.usage;
  }

  /**
   * Reason for stopping the completion.
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
   * Parses the Azure OpenAI response and returns the content.
   * @param choiceIndex - The index of the choice to parse.
   * @returns The message content.
   */
  getContent(choiceIndex = 0): string | undefined | null {
    this.logInvalidChoiceIndex(choiceIndex);
    return this.data.choices[choiceIndex]?.message?.content;
  }

  private logInvalidChoiceIndex(choiceIndex: number): void {
    if (choiceIndex < 0 || choiceIndex >= this.data.choices.length) {
      logger.error(`Choice index ${choiceIndex} is out of bounds.`);
    }
  }
}
