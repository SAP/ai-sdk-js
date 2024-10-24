import { createLogger } from "@sap-cloud-sdk/util";
import { AzureOpenAiChatCompletionStreamResponse } from "./azure-openai-chat-completion-stream-response.js";
import { Stream } from "./azure-openai-streaming.js";
import { HttpResponse } from "@sap-cloud-sdk/http-client";
import { AzureOpenAiChatCompletionStreamChunkResponse } from "./azure-openai-chat-completion-stream-chunk-response.js";

const logger = createLogger({
  package: 'foundation-models',
  messageContext: 'azure-openai-chat-completion-stream'
});

export class ChatCompletionStream extends Stream<any> {
  constructor(public iterator: () => AsyncIterator<any>) {
    super(iterator);
  }

  static fromSSEResponse(response: HttpResponse): ChatCompletionStream {
    const stream = Stream.fromSSEResponse<any>(response);
    return new ChatCompletionStream(stream.iterator);
  }

  pipe<T>(pipeFn: (stream: ChatCompletionStream, response: AzureOpenAiChatCompletionStreamResponse) => AsyncIterator<any, any, any>, response: AzureOpenAiChatCompletionStreamResponse): ChatCompletionStream {
    return new ChatCompletionStream(() => pipeFn(this, response));
  }
  
  static async * processChunk(stream: ChatCompletionStream, response: AzureOpenAiChatCompletionStreamResponse) {
    for await (const chunk of stream) {
      yield new AzureOpenAiChatCompletionStreamChunkResponse(chunk);
    };
  }

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

  static async * processTokenUsage(stream: ChatCompletionStream, response: AzureOpenAiChatCompletionStreamResponse) {
    for await (const chunk of stream) {
      const usage = chunk.getTokenUsage();
      if (usage) {
        response.usage = usage;
      }
      yield chunk;
    }
  }
}