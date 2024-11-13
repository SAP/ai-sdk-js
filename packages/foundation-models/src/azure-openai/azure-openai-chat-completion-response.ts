import { createLogger } from '@sap-cloud-sdk/util';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';
import type { AzureOpenAiCreateChatCompletionResponse } from './client/inference/schema/index.js';

const logger = createLogger({
  package: 'foundation-models',
  messageContext: 'azure-openai-chat-completion-response'
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
  ): string | undefined {
    return this.data.choices.find(choice => choice.index === choiceIndex)?.finish_reason;
  }

  /**
   * Parses the Azure OpenAI response and returns the content.
   * @param choiceIndex - The index of the choice to parse.
   * @returns The message content.
   */
  getContent(choiceIndex = 0): string | undefined | null {
    return this.data.choices.find(choice => choice.index === choiceIndex)?.message?.content;
  }
}
