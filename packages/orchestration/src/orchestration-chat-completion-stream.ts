import { createLogger } from '@sap-cloud-sdk/util';
import { SseStream } from '@sap-ai-sdk/core';
import { OrchestrationChatCompletionStreamChunkResponse } from './orchestration-chat-completion-stream-chunk-response.js';
import type { CompletionPostResponseStreaming } from './client/api/schema/index.js';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';
import type { OrchestrationChatCompletionStreamResponse } from './orchestration-chat-completion-stream-response.js';

const logger = createLogger({
  package: 'foundation-models',
  messageContext: 'azure-openai-chat-completion-stream'
});

/**
 * Chat completion stream containing post-processing functions.
 */
export class OrchestrationChatCompletionStream<Item> extends SseStream<Item> {
  /**
   * Create a chat completion stream based on the http response.
   * @param response - Http response.
   * @returns Chat completion stream.
   * @internal
   */
  public static _create(
    response: HttpResponse,
    controller: AbortController
  ): OrchestrationChatCompletionStream<CompletionPostResponseStreaming> {
    const stream = SseStream.transformToSseStream<any>(response, controller);
    return new OrchestrationChatCompletionStream(stream.iterator, controller);
  }

  /**
   * Wrap raw chunk data with chunk response class to provide helper functions.
   * @param stream - Chat completion stream.
   * @internal
   */
  static async *_processChunk(
    stream: OrchestrationChatCompletionStream<CompletionPostResponseStreaming>
  ): AsyncGenerator<OrchestrationChatCompletionStreamChunkResponse> {
    for await (const chunk of stream) {
      yield new OrchestrationChatCompletionStreamChunkResponse(chunk);
    }
  }

  /**
   * @internal
   */
  static async *_processFinishReason(
    stream: OrchestrationChatCompletionStream<OrchestrationChatCompletionStreamChunkResponse>,
    response?: OrchestrationChatCompletionStreamResponse<CompletionPostResponseStreaming>
  ): AsyncGenerator<OrchestrationChatCompletionStreamChunkResponse> {
    for await (const chunk of stream) {
      chunk.data.choices.forEach((choice: any) => {
        const choiceIndex = choice.index;
        if (choiceIndex >= 0) {
          const finishReason = chunk.getFinishReason(choiceIndex);
          if (finishReason) {
            if (response) {
              response._getFinishReasons().set(choiceIndex, finishReason);
            }
            switch (finishReason) {
              case 'content_filter':
                logger.error(
                  `Choice ${choiceIndex}: Stream finished with content filter hit.`
                );
                break;
              case 'length':
                logger.error(
                  `Choice ${choiceIndex}: Stream finished with token length exceeded.`
                );
                break;
              case 'stop':
                logger.debug(`Choice ${choiceIndex}: Stream finished.`);
                break;
              default:
                logger.error(
                  `Choice ${choiceIndex}: Stream finished with unknown reason '${finishReason}'.`
                );
            }
          }
        }
      });
      yield chunk;
    }
  }

  /**
   * @internal
   */
  static async *_processTokenUsage(
    stream: OrchestrationChatCompletionStream<OrchestrationChatCompletionStreamChunkResponse>,
    response?: OrchestrationChatCompletionStreamResponse<CompletionPostResponseStreaming>
  ): AsyncGenerator<OrchestrationChatCompletionStreamChunkResponse> {
    for await (const chunk of stream) {
      const usage = chunk.getTokenUsage();
      if (usage) {
        if (response) {
          response._setTokenUsage(usage);
        }
        logger.debug(`Token usage: ${JSON.stringify(usage)}`);
      }
      yield chunk;
    }
  }

  /**
   * Transform a stream of chunks into a stream of content strings.
   * @param stream - Chat completion stream.
   * @param choiceIndex - The index of the choice to parse.
   * @internal
   */
  static async *_processContentStream(
    stream: OrchestrationChatCompletionStream<OrchestrationChatCompletionStreamChunkResponse>,
    choiceIndex = 0
  ): AsyncGenerator<string> {
    for await (const chunk of stream) {
      const deltaContent = chunk.getDeltaContent(choiceIndex);
      if (!deltaContent) {
        continue;
      }
      yield deltaContent;
    }
  }

  constructor(
    public iterator: () => AsyncIterator<Item>,
    controller: AbortController
  ) {
    super(iterator, controller);
  }

  /**
   * Pipe the stream through a processing function.
   * @param processFn - The function to process the input stream.
   * @param response - The `AzureOpenAiChatCompletionStreamResponse` object for process function to store finish reason, token usage, etc.
   * @returns The output stream containing processed items.
   * @internal
   */
  _pipe<TReturn>(
    processFn: (
      stream: OrchestrationChatCompletionStream<Item>,
      response?: OrchestrationChatCompletionStreamResponse<CompletionPostResponseStreaming>
    ) => AsyncIterator<TReturn>,
    response?: OrchestrationChatCompletionStreamResponse<CompletionPostResponseStreaming>
  ): OrchestrationChatCompletionStream<TReturn> {
    if (response) {
      return new OrchestrationChatCompletionStream(
        () => processFn(this, response),
        this.controller
      );
    }
    return new OrchestrationChatCompletionStream(
      () => processFn(this),
      this.controller
    );
  }

  public toContentStream(
    this: OrchestrationChatCompletionStream<OrchestrationChatCompletionStreamChunkResponse>,
    choiceIndex?: number
  ): OrchestrationChatCompletionStream<string> {
    return new OrchestrationChatCompletionStream(
      () =>
        OrchestrationChatCompletionStream._processContentStream(
          this,
          choiceIndex
        ),
      this.controller
    );
  }
}
