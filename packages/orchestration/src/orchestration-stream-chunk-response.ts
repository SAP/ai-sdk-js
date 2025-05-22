import type {
  CompletionPostResponseStreaming,
  LlmChoiceStreaming,
  TokenUsage,
  ToolCallChunk
} from './client/api/schema/index.js';

/**
 * Orchestration stream chunk response.
 */
export class OrchestrationStreamChunkResponse {
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
    return this.findChoiceByIndex(choiceIndex)?.finish_reason;
  }

  /**
   * Gets the delta tool calls for a specific choice index.
   * @param choiceIndex - The index of the choice to parse.
   * @returns The delta tool calls for the specified choice index.
   */
  getDeltaToolCalls(choiceIndex = 0): ToolCallChunk[] | undefined {
    return this.findChoiceByIndex(choiceIndex)?.delta.tool_calls;
  }

  /**
   * Parses the chunk response and returns the delta content.
   * @param choiceIndex - The index of the choice to parse.
   * @returns The message delta content.
   */
  getDeltaContent(choiceIndex = 0): string | undefined {
    return this.findChoiceByIndex(choiceIndex)?.delta.content;
  }

  /**
   * Parses the chunk response and returns the choice by index.
   * @param index - The index of the choice to find.
   * @returns An {@link LLMChoiceStreaming} object associated withe index.
   */
  findChoiceByIndex(index: number): LlmChoiceStreaming | undefined {
    return this.getChoices()?.find(
      (c: LlmChoiceStreaming) => c.index === index
    );
  }

  private getChoices(): LlmChoiceStreaming[] | undefined {
    return this.data.orchestration_result?.choices;
  }
}
