import { SseStream } from '@sap-ai-sdk/core';
import { OrchestrationStreamChunkResponse } from './orchestration-stream-chunk-response.js';
import { mergeStreamResponse } from './util/index.js';
import type {
  CompletionPostResponseStreaming
} from './client/api/schema/index.js';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';
import type { OrchestrationStreamResponse } from './orchestration-stream-response.js';

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

  static async *_processOrchestrationStreamChunkResponse(
    stream: OrchestrationStream<OrchestrationStreamChunkResponse>,
    response?: OrchestrationStreamResponse<OrchestrationStreamChunkResponse>
  ): AsyncGenerator<OrchestrationStreamChunkResponse> {
    if (!response) {
      throw new Error('Response is required to process completion post response streaming.');
    }
    for await (const chunk of stream) {
      mergeStreamResponse(chunk.data, response);
      yield chunk;
    }
  }

  static async *_processStreamEnd(
    stream: OrchestrationStream<OrchestrationStreamChunkResponse>,
    response?: OrchestrationStreamResponse<OrchestrationStreamChunkResponse>
  ): AsyncGenerator<OrchestrationStreamChunkResponse> {
    if (!response) {
      throw new Error('Response is required to process stream end.');
    }
    for await (const chunk of stream) {
      yield chunk;
    }

    response._openStream = false;
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
