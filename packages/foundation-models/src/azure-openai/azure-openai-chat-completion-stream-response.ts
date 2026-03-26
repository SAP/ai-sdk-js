import { createLogger, pickValueIgnoreCase } from '@sap-cloud-sdk/util';
import { type ToolCallAccumulator } from './util/index.js';
import type {
  AzureOpenAiChatCompletionMessageToolCalls,
  AzureOpenAiCompletionUsage,
  AzureOpenAiCreateChatCompletionStreamResponse
} from './client/inference/schema/index.js';
import type { AzureOpenAiChatCompletionStream } from './azure-openai-chat-completion-stream.js';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';

const logger = createLogger({
  package: 'foundation-models',
  messageContext: 'azure-openai-chat-completion-stream-response'
});

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
  private _rawResponse: HttpResponse | undefined;

  /**
   * @deprecated Since v2.9.0. Provide an HttpResponse parameter when constructing AzureOpenAiChatCompletionStreamResponse. This constructor overload will be removed in v3.0.0.
   * Creates an Azure OpenAI chat completion stream response.
   */
  constructor();

  /**
   * Creates an Azure OpenAI chat completion stream response.
   * @param rawResponse - The raw HTTP response. SSE data is not part of the immediate response.
   */
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  constructor(rawResponse: HttpResponse);

  constructor(rawResponse?: HttpResponse) {
    if (!rawResponse) {
      logger.warn(
        'Constructing AzureOpenAiChatCompletionStreamResponse without raw HTTP response is deprecated and can lead to runtime errors when accessing `rawResponse`.'
      );
      return;
    }
    this._rawResponse = rawResponse;
  }

  /**
   * Gets the raw HTTP response. SSE data is not part of the immediate response.
   * @returns The raw HTTP response.
   * @throws {Error} When constructed without a raw response parameter (deprecated).
   */
  get rawResponse(): HttpResponse {
    if (!this._rawResponse) {
      throw new Error(
        'The raw response is not available. Please provide the raw response when constructing `AzureOpenAiChatCompletionStreamResponse`.'
      );
    }
    return this._rawResponse;
  }

  /**
   * Gets the request ID from the response headers.
   * @returns The request ID, or undefined if the header is not present.
   */
  getRequestId(): string | undefined {
    return pickValueIgnoreCase(
      this._rawResponse?.headers,
      'x-aicore-request-id'
    );
  }

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
