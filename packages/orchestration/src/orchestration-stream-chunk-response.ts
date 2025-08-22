import type {
  CompletionPostResponseStreaming,
  LlmChoiceStreaming,
  ModuleResultsStreaming,
  TokenUsage,
  ToolCallChunk
} from './client/api/schema/index.js';

/**
 * Orchestration stream chunk response.
 */
export class OrchestrationStreamChunkResponse {
  constructor(public readonly _data: CompletionPostResponseStreaming) {
    this._data = _data;
  }

  /**
   * Usage of tokens in the chunk response.
   * @returns Token usage.
   */
  getTokenUsage(): TokenUsage | undefined {
    return this._data.final_result?.usage;
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
   * Gets the intermediate results from the chunk.
   * @returns The intermediate results.
   */
  getIntermediateResults(): ModuleResultsStreaming | undefined {
    return this._data.intermediate_results;
  }

  /**
   * Parses the chunk response and returns the choice by index.
   * @param index - The index of the choice to find.
   * @returns An {@link LLMChoiceStreaming} object associated with the index.
   */
  findChoiceByIndex(index: number): LlmChoiceStreaming | undefined {
    return this.getChoices()?.find(
      (c: LlmChoiceStreaming) => c.index === index
    );
  }

  private getChoices(): LlmChoiceStreaming[] | undefined {
    return this._data.final_result?.choices;
  }
}
