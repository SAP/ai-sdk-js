import { isMessageToolCall } from './util/index.js';
import type { ToolCallAccumulator } from './util/index.js';
import type {
  MessageToolCalls,
  TokenUsage
} from './client/api/schema/index.js';
import type { OrchestrationStream } from './orchestration-stream.js';

/**
 * Orchestration stream response.
 */
export class OrchestrationStreamResponse<T> {
  private _usage: TokenUsage | undefined;
  /**
   * Finish reasons for all choices.
   */
  private _finishReasons: Map<number, string> = new Map();
  private _toolCallsAccumulators: Map<
    number,
    Map<number, ToolCallAccumulator>
  > = new Map();
  private _stream: OrchestrationStream<T> | undefined;

  /**
   * Gets the token usage for the response.
   * @returns The token usage for the response.
   */
  public getTokenUsage(): TokenUsage | undefined {
    return this._usage;
  }

  /**
   * @internal
   */
  _setTokenUsage(usage: TokenUsage): void {
    this._usage = usage;
  }

  /**
   * Gets the finish reason for a specific choice index.
   * @param choiceIndex - The index of the choice to get the finish reason for.
   * @returns The finish reason for the specified choice index.
   */
  public getFinishReason(choiceIndex = 0): string | undefined {
    return this._finishReasons.get(choiceIndex);
  }

  /**
   * @internal
   */
  _getFinishReasons(): Map<number, string> {
    return this._finishReasons;
  }

  /**
   * @internal
   */
  _setFinishReasons(finishReasons: Map<number, string>): void {
    this._finishReasons = finishReasons;
  }

  /**
   * Gets the tool calls for a specific choice index.
   * @param choiceIndex - The index of the choice to get the tool calls for.
   * @returns The tool calls for the specified choice index.
   */
  public getToolCalls(choiceIndex = 0): MessageToolCalls | undefined {
    try {
      const toolCallsAccumulators =
        this._toolCallsAccumulators.get(choiceIndex);
      if (!toolCallsAccumulators) {
        return undefined;
      }
      const toolCalls: MessageToolCalls = [];
      for (const [id, acc] of toolCallsAccumulators.entries()) {
        if (isMessageToolCall(acc)) {
          toolCalls.push(acc);
        } else {
          throw new Error(`Tool call with id ${id} was incomplete.`);
        }
      }
      return toolCalls;
    } catch (error) {
      throw new Error(
        `Error while getting tool calls for choice index ${choiceIndex}: ${error}`
      );
    }
  }

  /**
   * @internal
   */
  _getToolCallsAccumulators(): Map<number, Map<number, ToolCallAccumulator>> {
    return this._toolCallsAccumulators;
  }

  get stream(): OrchestrationStream<T> {
    if (!this._stream) {
      throw new Error('Response stream is undefined.');
    }
    return this._stream;
  }

  /**
   * @internal
   */
  set stream(stream: OrchestrationStream<T>) {
    this._stream = stream;
  }
}
