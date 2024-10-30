import { createLogger } from '@sap-cloud-sdk/util';
import { Stream } from './stream/stream.js';
import { AzureOpenAiChatCompletionStreamChunkResponse } from './azure-openai-chat-completion-stream-chunk-response.js';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';
import type { AzureOpenAiChatCompletionStreamResponse } from './azure-openai-chat-completion-stream-response.js';

const logger = createLogger({
  package: 'foundation-models',
  messageContext: 'azure-openai-chat-completion-stream'
});

/**
 * Chat completion stream containing post-processing functions.
 */
export class AzureOpenAiChatCompletionStream<Item> extends Stream<Item> {
  /**
   * Create a chat completion stream based on the http response.
   * @param response - Http response.
   * @returns Chat completion stream.
   * @internal
   */
  public static create(
    response: HttpResponse
  ): AzureOpenAiChatCompletionStream<any> {
    // TODO: Change `any` to `CreateChatCompletionStreamResponse` once the preview spec becomes stable.
    const stream = Stream.fromSSEResponse<any>(response); // TODO: Change `any` to `CreateChatCompletionStreamResponse` once the preview spec becomes stable.
    return new AzureOpenAiChatCompletionStream(stream.iterator);
  }

  /**
   * Wrap raw chunk data with chunk response class to provide helper functions.
   * @param stream - Chat completion stream.
   * @internal
   */
  static async *processChunk(
    stream: AzureOpenAiChatCompletionStream<any> // TODO: Change `any` to `CreateChatCompletionStreamResponse` once the preview spec becomes stable.
  ): AsyncGenerator<AzureOpenAiChatCompletionStreamChunkResponse> {
    for await (const chunk of stream) {
      yield new AzureOpenAiChatCompletionStreamChunkResponse(chunk);
    }
  }

  /**
   * Transform the stream chunk into string.
   * @param stream - Chat completion stream.
   * @internal
   */
  static async *processContent(
    stream: AzureOpenAiChatCompletionStream<AzureOpenAiChatCompletionStreamChunkResponse>
  ): AsyncGenerator<string> {
    for await (const chunk of stream) {
      const deltaContent = chunk.getDeltaContent();
      if (!deltaContent) {
        continue;
      }
      yield deltaContent;
    }
  }

  /**
   * @internal
   */
  static async *processFinishReason(
    stream: AzureOpenAiChatCompletionStream<AzureOpenAiChatCompletionStreamChunkResponse>,
    response?: AzureOpenAiChatCompletionStreamResponse<any>
  ): AsyncGenerator<AzureOpenAiChatCompletionStreamChunkResponse> {
    for await (const chunk of stream) {
      const finishReason = chunk.getFinishReason();
      if (finishReason) {
        if (response) {
          response.finishReason = finishReason;
        }
        switch (finishReason) {
          case 'content_filter':
            logger.error('Stream finished with content filter hit.');
            break;
          case 'length':
            logger.error('Stream finished with token length exceeded.');
            break;
          case 'stop':
            logger.debug('Stream finished.');
            break;
          default:
            logger.error(
              `Stream finished with unknown reason '${finishReason}'.`
            );
        }
      }
      yield chunk;
    }
  }

  /**
   * @internal
   */
  static async *processTokenUsage(
    stream: AzureOpenAiChatCompletionStream<AzureOpenAiChatCompletionStreamChunkResponse>,
    response?: AzureOpenAiChatCompletionStreamResponse<any>
  ): AsyncGenerator<AzureOpenAiChatCompletionStreamChunkResponse> {
    for await (const chunk of stream) {
      const usage = chunk.getTokenUsage();
      if (usage) {
        if (response) {
          response.usage = usage;
        }
        logger.debug(`Token usage: ${JSON.stringify(usage)}`);
      }
      yield chunk;
    }
  }

  constructor(public iterator: () => AsyncIterator<Item>) {
    super(iterator);
  }

  /**
   * Pipe the stream through a processing function.
   * @param processFn - The function to process the input stream.
   * @param response - The `AzureOpenAiChatCompletionStreamResponse` object for process function to store finish reason, token usage, etc.
   * @returns The output stream containing processed items.
   * @internal
   */
  pipe<TReturn>(
    processFn: (
      stream: AzureOpenAiChatCompletionStream<Item>,
      response?: AzureOpenAiChatCompletionStreamResponse<any>
    ) => AsyncIterator<TReturn>,
    response?: AzureOpenAiChatCompletionStreamResponse<any>
  ): AzureOpenAiChatCompletionStream<TReturn> {
    if (response) {
      return new AzureOpenAiChatCompletionStream(() =>
        processFn(this, response)
      );
    }
    return new AzureOpenAiChatCompletionStream(() => processFn(this));
  }
}
