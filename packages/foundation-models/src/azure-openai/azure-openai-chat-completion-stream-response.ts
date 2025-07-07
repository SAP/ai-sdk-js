import { type ToolCallAccumulator } from './util/index.js';
import type {
  AzureOpenAiChatCompletionMessageToolCalls,
  AzureOpenAiCompletionUsage,
  AzureOpenAiCreateChatCompletionStreamResponse
} from './client/inference/schema/index.js';
import type { AzureOpenAiChatCompletionStream } from './azure-openai-chat-completion-stream.js';

/**
 * Azure OpenAI chat completion stream response.
 */
export class AzureOpenAiChatCompletionStreamResponse<T> {
  private _usage: AzureOpenAiCompletionUsage | undefined;
  /**
   * Finish reasons for all choices.
   */
  private _finishReasons: Map<
    number,
    AzureOpenAiCreateChatCompletionStreamResponse['choices'][0]['finish_reason']
  > = new Map();
  private _toolCallsAccumulators: Map<
    number,
    Map<number, ToolCallAccumulator>
  > = new Map();
  private _toolCalls: Map<number, AzureOpenAiChatCompletionMessageToolCalls> =
    new Map();
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

  public getFinishReason(
    choiceIndex = 0
  ):
    | AzureOpenAiCreateChatCompletionStreamResponse['choices'][0]['finish_reason']
    | undefined {
    return this._finishReasons.get(choiceIndex);
  }

  /**
   * @internal
   */
  _getFinishReasons(): Map<
    number,
    AzureOpenAiCreateChatCompletionStreamResponse['choices'][0]['finish_reason']
  > {
    return this._finishReasons;
  }

  /**
   * @internal
   */
  _setFinishReasons(
    finishReasons: Map<
      number,
      AzureOpenAiCreateChatCompletionStreamResponse['choices'][0]['finish_reason']
    >
  ): void {
    this._finishReasons = finishReasons;
  }

  /**
   * Gets the tool calls for a specific choice index.
   * @param choiceIndex - The index of the choice to get the tool calls for.
   * @returns The tool calls for the specified choice index.
   */
  public getToolCalls(
    choiceIndex = 0
  ): AzureOpenAiChatCompletionMessageToolCalls | undefined {
    return this._toolCalls.get(choiceIndex);
  }

  /**
   * @internal
   */
  _setToolCalls(
    choiceIndex: number,
    toolCalls: AzureOpenAiChatCompletionMessageToolCalls
  ): void {
    this._toolCalls.set(choiceIndex, toolCalls);
  }

  /**
   * @internal
   */
  _getToolCallsAccumulators(): Map<number, Map<number, ToolCallAccumulator>> {
    return this._toolCallsAccumulators;
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
