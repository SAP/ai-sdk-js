import type { TokenUsage } from './client/api/schema/index.js';
import type { OrchestrationChatCompletionStream } from './orchestration-chat-completion-stream.js';

/**
 * Orchestration chat completion stream response.
 */
export class OrchestrationChatCompletionStreamResponse<T> {
  private _usage: TokenUsage | undefined;
  /**
   * Finish reasons for all choices.
   */
  private _finishReasons: Map<number, string> = new Map();
  private _stream: OrchestrationChatCompletionStream<T> | undefined;

  public getTokenUsage(): TokenUsage | undefined {
    return this._usage;
  }

  /**
   * @internal
   */
  _setTokenUsage(usage: TokenUsage): void {
    this._usage = usage;
  }

  public getFinishReason(choiceIndex = 0): string | undefined | null {
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

  get stream(): OrchestrationChatCompletionStream<T> {
    if (!this._stream) {
      throw new Error('Response stream is undefined.');
    }
    return this._stream;
  }

  /**
   * @internal
   */
  set stream(stream: OrchestrationChatCompletionStream<T>) {
    this._stream = stream;
  }
}
