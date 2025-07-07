import { createLogger } from '@sap-cloud-sdk/util';
import { SseStream } from '@sap-ai-sdk/core';
import { OrchestrationStreamChunkResponse } from './orchestration-stream-chunk-response.js';
import { mergeModuleResults, mergeToolCallChunk, type ToolCallAccumulator } from './internal.js';
import type { CompletionPostResponseStreaming } from './client/api/schema/index.js';
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
  static async *_processToolCalls(
    stream: OrchestrationStream<OrchestrationStreamChunkResponse>,
    response?: OrchestrationStreamResponse<OrchestrationStreamChunkResponse>
  ): AsyncGenerator<OrchestrationStreamChunkResponse> {
    if (!response) {
      throw new Error('Response is required to process tool calls.');
    }
    for await (const chunk of stream) {
      chunk.data.orchestration_result?.choices.forEach(choice => {
        const choiceIndex = choice.index;
        const toolCallsChunks = chunk.getDeltaToolCalls(choiceIndex);
        if (toolCallsChunks) {
          let toolCallAccumulators = response
            ._getToolCallsAccumulators()
            .get(choiceIndex);
          if (!toolCallAccumulators) {
            toolCallAccumulators = new Map<number, ToolCallAccumulator>();
            response
              ._getToolCallsAccumulators()
              .set(choiceIndex, toolCallAccumulators);
          }
          toolCallsChunks.map(toolCallChunk => {
            const toolCallId = toolCallChunk.index;
            const toolCallAccumulator = mergeToolCallChunk(
              toolCallChunk,
              toolCallAccumulators.get(toolCallId)
            );
            toolCallAccumulators.set(toolCallId, toolCallAccumulator);
          });
        }
      });
      yield chunk;
    }
  }

  /**
   * @internal
   */
  static async *_processFinishReason(
    stream: OrchestrationStream<OrchestrationStreamChunkResponse>,
    response?: OrchestrationStreamResponse<OrchestrationStreamChunkResponse>
  ): AsyncGenerator<OrchestrationStreamChunkResponse> {
    if (!response) {
      throw new Error('Response is required to process finish reasons.');
    }
    for await (const chunk of stream) {
      chunk.data.orchestration_result?.choices.forEach(choice => {
        const choiceIndex = choice.index;
        const finishReason = chunk.getFinishReason(choiceIndex);
        if (finishReason) {
          response._getFinishReasons().set(choiceIndex, finishReason);
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
            case 'tool_calls':
            case 'function_call':
              logger.debug(`Choice ${choiceIndex}: Stream finished.`);
              break;
            default:
              logger.error(
                `Choice ${choiceIndex}: Stream finished with unknown reason '${finishReason}'.`
              );
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
    stream: OrchestrationStream<OrchestrationStreamChunkResponse>,
    response?: OrchestrationStreamResponse<OrchestrationStreamChunkResponse>
  ): AsyncGenerator<OrchestrationStreamChunkResponse> {
    if (!response) {
      throw new Error('Response is required to process token usage.');
    }
    for await (const chunk of stream) {
      const usage = chunk.getTokenUsage();
      if (usage) {
        response._setTokenUsage(usage);
        logger.debug(`Token usage: ${JSON.stringify(usage)}`);
      }
      yield chunk;
    }
  }

  /**
   * @internal
   */
  static async *_processModuleResults(
    stream: OrchestrationStream<OrchestrationStreamChunkResponse>,
    response?: OrchestrationStreamResponse<OrchestrationStreamChunkResponse>
  ): AsyncGenerator<OrchestrationStreamChunkResponse> {
    if (!response) {
      throw new Error('Response is required to process module results.');
    }
    for await (const chunk of stream) {
      const moduleResults = chunk.data.module_results;
      if (moduleResults) {
        for(const [key, value] of Object.entries(moduleResults)) {
          if (key in ['llm', 'output_unmasking']) {
            const accumulator = response._getModuleResult(key);
            const result = mergeModuleResults(value, accumulator.get(key));
            response._setModuleResult(key, result);
          } else {
            response._setModuleResult(key, value);
          }
        }
      }
      yield chunk;
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
