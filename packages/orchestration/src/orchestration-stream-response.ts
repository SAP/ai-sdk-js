import { createLogger } from '@sap-cloud-sdk/util';
import type {
  LlmModuleResult,
  ModuleResults,
  TokenUsage
} from './client/api/schema/index.js';
import type { OrchestrationStream } from './orchestration-stream.js';

const logger = createLogger({
  package: 'orchestration',
  messageContext: 'orchestration-stream-response'
});

/**
 * Orchestration stream response.
 */
export class OrchestrationStreamResponse<T> {
  public openStream = true;
  private moduleResults: ModuleResults | undefined;
  private orchestrationResult: LlmModuleResult | undefined;
  private _stream: OrchestrationStream<T> | undefined;

  /**
   * Gets the token usage for the response.
   * @returns The token usage for the response.
   */
  public getTokenUsage(): TokenUsage | undefined {
    if(this.orchestrationResult) {
      return this.orchestrationResult.usage;
    }
    logger.warn(
      'The stream is still open, the token usage is not available yet.'
    );
  }

  /**
   * Gets the finish reason for a specific choice index.
   * @param choiceIndex - The index of the choice to get the finish reason for.
   * @returns The finish reason for the specified choice index.
   */
  public getFinishReason(choiceIndex = 0): string | undefined {
    if(!this.openStream) {
      return this.findChoiceByIndex(choiceIndex)?.finish_reason;
    }
    logger.warn(
      'The stream is still open, the finish reason is not available yet.'
    );
  }

  get stream(): OrchestrationStream<T> {
    if (!this._stream) {
      throw new Error('Response stream is undefined.');
    }
    return this._stream;
  }

  public getModuleResults(): ModuleResults | undefined {
    if (!this.openStream) {
      return this.moduleResults;
    }
    logger.warn(
      'The stream is still open, module results are not available yet.'
    );
  }

  private getChoices() {
    return this.orchestrationResult?.choices ?? [];
  }

  private findChoiceByIndex(index: number) {
    return this.getChoices().find(
      (c: { index: number }) => c.index === index
    );
  }

  /**
   * @internal
   */
  set stream(stream: OrchestrationStream<T>) {
    this._stream = stream;
  }
}
