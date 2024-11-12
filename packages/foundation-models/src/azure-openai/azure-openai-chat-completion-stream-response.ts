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
  _setTokenUsage(usage: AzureOpenAiCompletionUsage) {
    this._usage = usage;
  }

  public getFinishReason(choiceIndex = 0): string | undefined | null {
    return this._finishReasons.get(choiceIndex);
  }

  /**
   * @internal
   */
  _getFinishReasons() {
    return this._finishReasons;
  }

  /**
   * @internal
   */
  _setFinishReasons(finishReasons: Map<number, string>) {
    this._finishReasons = finishReasons;
  }

  getStream(): AzureOpenAiChatCompletionStream<T> {
    if (!this._stream) {
      throw new Error('Response stream is undefined.');
    }
    return this._stream;
  }

  /**
   * @internal
   */
  _setStream(stream: AzureOpenAiChatCompletionStream<T>) {
    this._stream = stream;
  }
}
