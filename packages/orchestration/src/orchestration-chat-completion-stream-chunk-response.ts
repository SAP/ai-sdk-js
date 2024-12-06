import type { CompletionPostResponseStreaming } from './client/api/schema/index.js';
import type { TokenUsage } from './index.js';

/**
 * Azure OpenAI chat completion stream chunk response.
 */
export class OrchestrationChatCompletionStreamChunkResponse {
  constructor(public readonly data: CompletionPostResponseStreaming) {
    this.data = data;
  }

  /**
   * Usage of tokens in the chunk response.
   * @returns Token usage.
   */
  getTokenUsage(): TokenUsage | undefined {
    return this.data.orchestration_result?.usage;
  }

  /**
   * Reason for stopping the completion stream chunk.
   * @param choiceIndex - The index of the choice to parse.
   * @returns The finish reason.
   */
  getFinishReason(choiceIndex = 0): string | undefined {
    return this.data.orchestration_result?.choices.find((c: any) => c.index === choiceIndex)
      ?.finish_reason;
  }

  /**
   * Parses the chunk response and returns the delta content.
   * @param choiceIndex - The index of the choice to parse.
   * @returns The message delta content.
   */
  getDeltaContent(choiceIndex = 0): string | undefined {
    return this.data.orchestration_result?.choices.find((c: any) => c.index === choiceIndex)?.delta
      .content;
  }
}
