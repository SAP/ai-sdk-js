import type { HttpResponse } from '@sap-cloud-sdk/http-client';
import type {
  AzureOpenAiCompletionUsage,
  AzureOpenAiCreateChatCompletionResponse
} from './client/inference/schema/index.js';

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
  getTokenUsage(): AzureOpenAiCompletionUsage | undefined {
    return this.data.usage;
  }

  /**
   * Reason for stopping the completion.
   * @param choiceIndex - The index of the choice to parse.
   * @returns The finish reason.
   */
  getFinishReason(
    choiceIndex = 0
  ):
    | AzureOpenAiCreateChatCompletionResponse['choices'][0]['finish_reason']
    | undefined {
    return this.data.choices.find(c => c.index === choiceIndex)?.finish_reason;
  }

  /**
   * Parses the Azure OpenAI response and returns the content.
   * @param choiceIndex - The index of the choice to parse.
   * @returns The message content.
   */
  getContent(choiceIndex = 0): string | undefined | null {
    return this.data.choices.find(c => c.index === choiceIndex)?.message
      ?.content;
  }
}
