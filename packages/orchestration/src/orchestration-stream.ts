import { createLogger } from '@sap-cloud-sdk/util';
import { SseStream } from '@sap-ai-sdk/core';
import { OrchestrationStreamChunkResponse } from './orchestration-stream-chunk-response.js';
import type {
  CompletionPostResponseStreaming,
  LlmChoiceStreaming
} from './client/api/schema/index.js';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';
import type { OrchestrationStreamResponse } from './orchestration-stream-response.js';

const logger = createLogger({
  package: 'orchestration',
  messageContext: 'orchestration-chat-completion-stream'
});

/**
 * Orchestration stream containing post-processing functions.
 */
export class OrchestrationStream<Item> extends SseStream<Item> {
  /**
   * Create an orchestration stream based on the http response.
   * @param response - Http response.
   * @returns An orchestration stream.
   * @internal
   */
  public static _create(
    response: HttpResponse,
    controller: AbortController
  ): OrchestrationStream<CompletionPostResponseStreaming> {
    const stream =
      SseStream.transformToSseStream<CompletionPostResponseStreaming>(
        response,
        controller
      );
    return new OrchestrationStream(stream.iterator, controller);
  }

  /**
   * Wrap raw chunk data with chunk response class to provide helper functions.
   * @param stream - Orchestration stream.
   * @internal
   */
  static async *_processChunk(
    stream: OrchestrationStream<CompletionPostResponseStreaming>
  ): AsyncGenerator<OrchestrationStreamChunkResponse> {
    for await (const chunk of stream) {
      yield new OrchestrationStreamChunkResponse(chunk);
    }
  }

  /**
   * @internal
   */
  static async *_processFinishReason(
    stream: OrchestrationStream<OrchestrationStreamChunkResponse>,
    response?: OrchestrationStreamResponse<OrchestrationStreamChunkResponse>
  ): AsyncGenerator<OrchestrationStreamChunkResponse> {
    for await (const chunk of stream) {
      chunk.data.orchestration_result?.choices.forEach(
        (choice: LlmChoiceStreaming) => {
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
                case 'tool_calls':
                  logger.error(
                    `Choice ${choiceIndex}: Stream finished with tool calls exceeded.`
                  );
                  break;
                case 'function_call':
                  logger.error(
                    `Choice ${choiceIndex}: Stream finished with function call exceeded.`
                  );
                  break;
                default:
                  logger.error(
                    `Choice ${choiceIndex}: Stream finished with unknown reason '${finishReason}'.`
                  );
              }
            }
          }
        }
      );
      yield chunk;
    }
  }

  /**
   * @internal
   */
  static async *_processTokenUsage(
    stream: OrchestrationStream<OrchestrationStreamChunkResponse>,
    response?: OrchestrationStreamResponse<OrchestrationStreamChunkResponse>
  ): AsyncGenerator<OrchestrationStreamChunkResponse> {
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
   * @param stream - Orchestration stream.
   * @param choiceIndex - The index of the choice to parse.
   * @internal
   */
  static async *_processContentStream(
    stream: OrchestrationStream<OrchestrationStreamChunkResponse>
  ): AsyncGenerator<string> {
    for await (const chunk of stream) {
      const deltaContent = chunk.getDeltaContent();
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
   * @param response - The `OrchestrationStreamResponse` object for process function to store finish reason, token usage, etc.
   * @returns The output stream containing processed items.
   * @internal
   */
  _pipe<TReturn>(
    processFn: (
      stream: OrchestrationStream<Item>,
      response?: OrchestrationStreamResponse<OrchestrationStreamChunkResponse>
    ) => AsyncIterator<TReturn>,
    response?: OrchestrationStreamResponse<OrchestrationStreamChunkResponse>
  ): OrchestrationStream<TReturn> {
    if (response) {
      return new OrchestrationStream(
        () => processFn(this, response),
        this.controller
      );
    }
    return new OrchestrationStream(() => processFn(this), this.controller);
  }

  /**
   * Transform the stream of chunks into a stream of content strings.
   * @param this - Orchestration stream.
   * @returns A stream of content strings.
   */
  public toContentStream(
    this: OrchestrationStream<OrchestrationStreamChunkResponse>
  ): OrchestrationStream<string> {
    return new OrchestrationStream(
      () => OrchestrationStream._processContentStream(this),
      this.controller
    );
  }
}
