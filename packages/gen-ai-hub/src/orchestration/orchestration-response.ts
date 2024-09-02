import { HttpResponse } from "@sap-cloud-sdk/http-client";
import { CompletionPostResponse } from "./client/api/schema/index.js";

/**
 * Respresentation of Orchestration response.
 */
export class OrchestrationResponse {
  public data: CompletionPostResponse
  constructor(private rawResponse: HttpResponse,) {
    this.data = rawResponse.data;
  }

  /**
   * Usage of tokens in the response.
   */
  get usage() {
    return this.data.orchestration_result.usage;
  }
  /**
   * Reason for stopping the model.
   */
  get finish_reason() {
    return this.data.orchestration_result.choices[0].finish_reason;
  }

  /**
* Parses the orchestration response and returns the content.
* @param response - The orchestration response.
* @param choiceIndex - The index of the choice to parse.
* @returns The message content.
*/
  getContent(choiceIndex: number = 0): string {
    const choices = this.data.orchestration_result.choices;
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
