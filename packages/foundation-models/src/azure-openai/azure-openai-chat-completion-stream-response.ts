import type { AzureOpenAiCompletionUsage } from './client/inference/schema/index.js';
import type { AzureOpenAiChatCompletionStream } from './azure-openai-chat-completion-stream.js';

/**
 * Azure OpenAI chat completion stream response.
 */
export class AzureOpenAiChatCompletionStreamResponse<T> {
  private _usage: AzureOpenAiCompletionUsage | undefined;
  private _finishReasons: Map<number, string> = new Map();
  private _stream: AzureOpenAiChatCompletionStream<T> | undefined;

  public get usage(): AzureOpenAiCompletionUsage {
    if (!this._usage) {
      throw new Error('Response stream is undefined.');
    }
    return this._usage;
  }

  public set usage(usage: AzureOpenAiCompletionUsage) {
    this._usage = usage;
  }

  public get finishReasons(): Map<number, string> {
    return this._finishReasons;
  }

  public set finishReasons(finishReasons: Map<number, string>) {
    this._finishReasons = finishReasons;
  }

  public get stream(): AzureOpenAiChatCompletionStream<T> {
    if (!this._stream) {
      throw new Error('Response stream is undefined.');
    }
    return this._stream;
  }

  public set stream(stream: AzureOpenAiChatCompletionStream<T>) {
    this._stream = stream;
  }
}
