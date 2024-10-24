import { createLogger } from '@sap-cloud-sdk/util';
import type { Stream } from './azure-openai-streaming.js';
import type { AzureOpenAiCompletionUsage } from './client/inference/schema/completion-usage.js';

const logger = createLogger({
  package: 'foundation-models',
  messageContext: 'azure-openai-chat-completion-stream-response'
});

/**
 * Azure OpenAI chat completion stream response.
 */
export class AzureOpenAiChatCompletionStreamResponse {
  private _usage: AzureOpenAiCompletionUsage | undefined;
  private _finishReason: string | undefined;
  private _stream: Stream<any> | undefined;

  public get usage() {
    if (!this._usage) {
      throw new Error('Response stream is undefined.');
    }
    return this._usage;
  }

  public set usage(usage: AzureOpenAiCompletionUsage) {
    this._usage = usage;
  }

  public get finishReason() {
    if (!this._finishReason) {
      throw new Error('Response finish reason is undefined.');
    }
    return this._finishReason;
  }

  public set finishReason(finishReason: string) {
    this._finishReason = finishReason;
  }

  public get stream(): Stream<any> {
    if (!this._stream) {
      throw new Error('Response stream is undefined.');
    }
    return this._stream;
  }

  public set stream(stream: Stream<any>) {
    this._stream = stream;
  }
}
