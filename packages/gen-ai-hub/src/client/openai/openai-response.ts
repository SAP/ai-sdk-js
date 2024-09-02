import { HttpResponse } from "@sap-cloud-sdk/http-client";
import { OpenAiChatCompletionOutput } from "./openai-types.js";

/**
 * Open AI chat completion response.
 */
export class OpenAiChatCompletionResponse {
  public data: OpenAiChatCompletionOutput
  constructor(private rawResponse: HttpResponse,) {
    this.data = rawResponse.data;
  }

  /**
   * Usage of tokens in the response.
   */
  get usage() {
    return this.data.usage;
  }
  /**
   * Reason for stopping the model.
   */
  get finish_reason() {
    return this.data.choices[0].finish_reason;
  }

  /**
* Parses the Open AI response and returns the content.
* @param response - The  Open AI response.
* @param choiceIndex - The index of the choice to parse.
* @returns The message content.
*/
  getContent(choiceIndex: number = 0): string | null {
    const choices = this.data.choices;
    if (choiceIndex < 0 || choiceIndex >= choices.length) {
      throw new Error('Invalid choice index.');
    }
    return choices[choiceIndex].message.content
  }

  /**
   * Get the raw HttpResponse.
   * @returns HttpResponse.
   */
  getRawResponse(): HttpResponse {
    return this.rawResponse;
  }
}
