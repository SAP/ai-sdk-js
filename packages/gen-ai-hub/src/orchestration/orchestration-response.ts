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
 * Representation of an orchestration response.
 */
export class OrchestrationResponse {
  /**
   * The completion post response.
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
   * Reason for stopping the completion.
   * @param choiceIndex - The index of the choice to parse.
   * @returns The finish reason.
   */
  getFinishReason(choiceIndex = 0): string | undefined {
    this.validateChoiceIndex(choiceIndex);
    return this.getChoices()[choiceIndex]?.finish_reason;
  }

  /**
   * Parses the orchestration response and returns the content.
   * @param choiceIndex - The index of the choice to parse.
   * @returns The message content.
   */
  getContent(choiceIndex = 0): string | undefined {
    this.validateChoiceIndex(choiceIndex);
    if (
      this.getChoices()[choiceIndex]?.message?.content === '' &&
      this.getChoices()[choiceIndex]?.finish_reason === 'content_filter'
    ) {
      throw new Error(
        'Content generated by the LLM was filtered by the output filter. Please try again with a different prompt or filter configuration.'
      );
    }
    return this.getChoices()[choiceIndex]?.message?.content;
  }

  private getChoices() {
    return this.data.orchestration_result.choices;
  }

  private validateChoiceIndex(choiceIndex: number): void {
    if (choiceIndex < 0 || choiceIndex >= this.getChoices().length) {
      logger.error(`Choice index ${choiceIndex} is out of bounds.`);
    }
  }
}
