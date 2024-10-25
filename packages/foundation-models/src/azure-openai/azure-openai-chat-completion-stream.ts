import { createLogger } from '@sap-cloud-sdk/util';
import { Stream } from './azure-openai-streaming.js';
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
// TODO: The Item type `any` should actually be the type of the stream chunk response.
// But `createChatCompletionStreamResponse` is first available in Azure OpenAI spec preview version 2024-08-01.
export class ChatCompletionStream extends Stream<any> {
  /**
   * Create a chat completion stream based on the http response.
   * @param response - Http response.
   * @returns Chat completion stream.
   * @internal
   */
  static fromSSEResponse(response: HttpResponse): ChatCompletionStream {
    const stream = Stream.fromSSEResponse<any>(response);
    return new ChatCompletionStream(stream.iterator);
  }

  /**
   * Wrap raw chunk data with chunk response class to provide helper functions.
   * @param stream - Chat completion stream.
   * @internal
   */
  static async * processChunk(stream: ChatCompletionStream): AsyncGenerator<AzureOpenAiChatCompletionStreamChunkResponse, void, any> {
    for await (const chunk of stream) {
      yield new AzureOpenAiChatCompletionStreamChunkResponse(chunk);
    };
  }

  /**
   * Transform the stream chunk into string.
   * @param stream - Chat completion stream.
   * @internal
   */
  static async * processContent(stream: ChatCompletionStream): AsyncGenerator<string, void, any> {
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
  static async * processFinishReason(stream: ChatCompletionStream, response?: AzureOpenAiChatCompletionStreamResponse): AsyncGenerator<AzureOpenAiChatCompletionStreamChunkResponse, void, any> {
    for await (const chunk of stream) {
      const finishReason = chunk.getFinishReason();
      if (finishReason) {
        response!.finishReason = finishReason;
        switch (finishReason) {
          case 'content_filter':
            throw new Error('Stream finished with content filter hit.');
          case 'length':
            throw new Error('Stream finished with token length exceeded.');
          case 'stop':
            logger.debug('Stream finished.');
            break;
          default:
            throw new Error(`Stream finished with unknown reason '${finishReason}'.`);
        }
      }
      yield chunk;
    }
  }

  /**
   * @internal
   */
  static async * processTokenUsage(stream: ChatCompletionStream, response?: AzureOpenAiChatCompletionStreamResponse): AsyncGenerator<AzureOpenAiChatCompletionStreamChunkResponse, void, any> {
    for await (const chunk of stream) {
      const usage = chunk.getTokenUsage();
      if (usage) {
        response!.usage = usage;
      }
      yield chunk;
    }
  }

  constructor(public iterator: () => AsyncIterator<any>) {
    super(iterator);
  }

  /**
   * @internal
   */
  pipe(processFn: (stream: ChatCompletionStream, response?: AzureOpenAiChatCompletionStreamResponse) => AsyncIterator<any, any, any>, response?: AzureOpenAiChatCompletionStreamResponse): ChatCompletionStream {
    if (response) {
      return new ChatCompletionStream(() => processFn(this, response));
    }
    return new ChatCompletionStream(() => processFn(this));
  }
}
