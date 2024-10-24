import { createLogger } from '@sap-cloud-sdk/util';
import { Stream } from './azure-openai-streaming.js';
import { AzureOpenAiChatCompletionStreamChunkResponse } from './azure-openai-chat-completion-stream-chunk-response.js';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';
import type { AzureOpenAiChatCompletionStreamResponse } from './azure-openai-chat-completion-stream-response.js';

const logger = createLogger({
  package: 'foundation-models',
  messageContext: 'azure-openai-chat-completion-stream'
});

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
   * @param response
   * @internal
   */
  static async * processChunk(stream: ChatCompletionStream, response: AzureOpenAiChatCompletionStreamResponse) {
    for await (const chunk of stream) {
      yield new AzureOpenAiChatCompletionStreamChunkResponse(chunk);
    };
  }

  /**
   * @internal
   */
  static async * processString(stream: ChatCompletionStream, response: AzureOpenAiChatCompletionStreamResponse) {
    for await (const chunk of stream) {
      // Process each item here
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
  static async * processFinishReason(stream: ChatCompletionStream, response: AzureOpenAiChatCompletionStreamResponse) {
    for await (const chunk of stream) {
      const finishReason = chunk.getFinishReason();
      if (finishReason) {
        response.finishReason = finishReason;
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
  static async * processTokenUsage(stream: ChatCompletionStream, response: AzureOpenAiChatCompletionStreamResponse) {
    for await (const chunk of stream) {
      const usage = chunk.getTokenUsage();
      if (usage) {
        response.usage = usage;
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
  pipe(processFn: (stream: ChatCompletionStream, response: AzureOpenAiChatCompletionStreamResponse) => AsyncIterator<any, any, any>, response: AzureOpenAiChatCompletionStreamResponse): ChatCompletionStream {
    return new ChatCompletionStream(() => processFn(this, response));
  }
}
