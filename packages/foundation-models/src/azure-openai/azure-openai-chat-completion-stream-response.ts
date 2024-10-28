import type { AzureOpenAiCompletionUsage } from './client/inference/schema/index.js';
import type { ChatCompletionStream } from './azure-openai-chat-completion-stream.js';

/**
 * Azure OpenAI chat completion stream response.
 */
export class AzureOpenAiChatCompletionStreamResponse {
  private _usage: AzureOpenAiCompletionUsage | undefined;
  private _finishReason: string | undefined;
  private _stream: ChatCompletionStream | undefined;

  public get usage(): AzureOpenAiCompletionUsage {
    if (!this._usage) {
      throw new Error('Response stream is undefined.');
    }
    return this._usage;
  }

  public set usage(usage: AzureOpenAiCompletionUsage) {
    this._usage = usage;
  }

  public get finishReason(): string {
    if (!this._finishReason) {
      throw new Error('Response finish reason is undefined.');
    }
    return this._finishReason;
  }

  public set finishReason(finishReason: string) {
    this._finishReason = finishReason;
  }

  public get stream(): ChatCompletionStream {
    if (!this._stream) {
      throw new Error('Response stream is undefined.');
    }
    return this._stream;
  }

  public set stream(stream: ChatCompletionStream) {
    this._stream = stream;
  }
}
