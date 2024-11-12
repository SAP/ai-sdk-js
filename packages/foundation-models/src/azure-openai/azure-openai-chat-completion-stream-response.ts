import type { AzureOpenAiCompletionUsage } from './client/inference/schema/index.js';
import type { AzureOpenAiChatCompletionStream } from './azure-openai-chat-completion-stream.js';

/**
 * Azure OpenAI chat completion stream response.
 */
export class AzureOpenAiChatCompletionStreamResponse<T> {
  private _usage: AzureOpenAiCompletionUsage | undefined;
  private _finishReasons: Map<number, string> = new Map();
  private _stream: AzureOpenAiChatCompletionStream<T> | undefined;

  public getTokenUsage(): AzureOpenAiCompletionUsage | undefined {
    return this._usage;
  }

  /**
   * @internal
   */
  _setTokenUsage(usage: AzureOpenAiCompletionUsage): void {
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

  get stream(): AzureOpenAiChatCompletionStream<T> {
    if (!this._stream) {
      throw new Error('Response stream is undefined.');
    }
    return this._stream;
  }

  /**
   * @internal
   */
  set stream(stream: AzureOpenAiChatCompletionStream<T>) {
    this._stream = stream;
  }
}
