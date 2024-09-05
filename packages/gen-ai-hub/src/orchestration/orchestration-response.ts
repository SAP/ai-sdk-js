import { HttpResponse } from '@sap-cloud-sdk/http-client';
import { createLogger } from '@sap-cloud-sdk/util';
import {
  CompletionPostResponse,
  TokenUsage
} from './client/api/schema/index.js';

const logger = createLogger({
  package: 'gen-ai-hub',
  messageContext: 'orchestration-response'
});
/**
 * Respresentation of Orchestration response.
 */
export class OrchestrationResponse {
  /**
   * Get the typed Completion Post Response.
   */
  public readonly data: CompletionPostResponse;
  constructor(public readonly rawResponse: HttpResponse) {
    this.data = rawResponse.data;
  }

  /**
   * Usage of tokens in the response.
   * @returns Token usage.
   */
  getTokenUsage(): TokenUsage {
    return this.data.orchestration_result.usage;
  }
  /**
   * Reason for stopping the model.
   * @param choiceIndex - The index of the choice to parse.
   * @returns The finish reason.
   */
  getFinishReason(choiceIndex: number = 0): string | undefined {
    const choices = this.data.orchestration_result.choices;
    if (choiceIndex < 0 || choiceIndex >= choices.length) {
      logger.error(`${choiceIndex} is not a valid choice index.`);
      return;
    }
    return choices[choiceIndex].finish_reason;
  }

  /**
   * Parses the orchestration response and returns the content.
   * @param choiceIndex - The index of the choice to parse.
   * @returns The message content.
   */
  getContent(choiceIndex: number = 0): string | undefined {
    const choices = this.data.orchestration_result.choices;
    if (choiceIndex < 0 || choiceIndex >= choices.length) {
      logger.error(`${choiceIndex} is not a valid choice index.`);
      return;
    }
    if (
      choices[choiceIndex].message.content === '' &&
      choices[choiceIndex].finish_reason === 'content_filter'
    ) {
      throw new Error(
        'Content generated by LLM was filtered by the Output Filter. Please try again with a different prompt or filter configuration.'
      );
    }
    return choices[choiceIndex].message.content;
  }
}