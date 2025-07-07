import { createLogger } from '@sap-cloud-sdk/util';
import { SseStream } from '@sap-ai-sdk/core';
import { AzureOpenAiChatCompletionStreamChunkResponse } from './azure-openai-chat-completion-stream-chunk-response.js';
import { isMessageToolCall, mergeToolCallChunk } from './util/index.js';
import type { ToolCallAccumulator } from './util/index.js';
import type {
  AzureOpenAiChatCompletionMessageToolCalls,
  AzureOpenAiCreateChatCompletionStreamResponse
} from './client/inference/schema/index.js';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';
import type { AzureOpenAiChatCompletionStreamResponse } from './azure-openai-chat-completion-stream-response.js';

const logger = createLogger({
  package: 'foundation-models',
  messageContext: 'azure-openai-chat-completion-stream'
});

/**
 * Chat completion stream containing post-processing functions.
 */
export class AzureOpenAiChatCompletionStream<Item> extends SseStream<Item> {
  /**
   * Create a chat completion stream based on the http response.
   * @param response - Http response.
   * @returns Chat completion stream.
   * @internal
   */
  public static _create(
    response: HttpResponse,
    controller: AbortController
  ): AzureOpenAiChatCompletionStream<AzureOpenAiCreateChatCompletionStreamResponse> {
    const stream =
      SseStream.transformToSseStream<AzureOpenAiCreateChatCompletionStreamResponse>(
        response,
        controller
      );
    return new AzureOpenAiChatCompletionStream(stream.iterator, controller);
  }

  /**
   * Wrap raw chunk data with chunk response class to provide helper functions.
   * @param stream - Chat completion stream.
   * @internal
   */
  static async *_processChunk(
    stream: AzureOpenAiChatCompletionStream<AzureOpenAiCreateChatCompletionStreamResponse>
  ): AsyncGenerator<AzureOpenAiChatCompletionStreamChunkResponse> {
    for await (const chunk of stream) {
      yield new AzureOpenAiChatCompletionStreamChunkResponse(chunk);
    }
  }

  /**
   * @internal
   */
  static async *_processToolCalls(
    stream: AzureOpenAiChatCompletionStream<AzureOpenAiChatCompletionStreamChunkResponse>,
    response?: AzureOpenAiChatCompletionStreamResponse<AzureOpenAiChatCompletionStreamChunkResponse>
  ): AsyncGenerator<AzureOpenAiChatCompletionStreamChunkResponse> {
    if (!response) {
      throw new Error('Response is required to process tool calls.');
    }
    for await (const chunk of stream) {
      chunk.data.choices.forEach(choice => {
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

    for (const [
      choiceIndex,
      toolCallsAccumulators
    ] of response._getToolCallsAccumulators()) {
      const toolCalls: AzureOpenAiChatCompletionMessageToolCalls = [];
      for (const [id, acc] of toolCallsAccumulators.entries()) {
        if (isMessageToolCall(acc)) {
          toolCalls.push(acc);
        } else {
          logger.error(
            `Error while parsing tool calls for choice index ${choiceIndex}: Tool call with id ${id} was incomplete.`
          );
        }
      }
      response._setToolCalls(choiceIndex, toolCalls);
    }
  }

  /**
   * @internal
   */
  static async *_processFinishReason(
    stream: AzureOpenAiChatCompletionStream<AzureOpenAiChatCompletionStreamChunkResponse>,
    response?: AzureOpenAiChatCompletionStreamResponse<AzureOpenAiChatCompletionStreamChunkResponse>
  ): AsyncGenerator<AzureOpenAiChatCompletionStreamChunkResponse> {
    for await (const chunk of stream) {
      chunk.data.choices.forEach(choice => {
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
        }
      });
      yield chunk;
    }
  }

  /**
   * @internal
   */
  static async *_processTokenUsage(
    stream: AzureOpenAiChatCompletionStream<AzureOpenAiChatCompletionStreamChunkResponse>,
    response?: AzureOpenAiChatCompletionStreamResponse<AzureOpenAiChatCompletionStreamChunkResponse>
  ): AsyncGenerator<AzureOpenAiChatCompletionStreamChunkResponse> {
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
    stream: AzureOpenAiChatCompletionStream<AzureOpenAiChatCompletionStreamChunkResponse>,
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
      stream: AzureOpenAiChatCompletionStream<Item>,
      response?: AzureOpenAiChatCompletionStreamResponse<any>
    ) => AsyncIterator<TReturn>,
    response?: AzureOpenAiChatCompletionStreamResponse<any>
  ): AzureOpenAiChatCompletionStream<TReturn> {
    if (response) {
      return new AzureOpenAiChatCompletionStream(
        () => processFn(this, response),
        this.controller
      );
    }
    return new AzureOpenAiChatCompletionStream(
      () => processFn(this),
      this.controller
    );
  }

  public toContentStream(
    this: AzureOpenAiChatCompletionStream<AzureOpenAiChatCompletionStreamChunkResponse>,
    choiceIndex?: number
  ): AzureOpenAiChatCompletionStream<string> {
    return new AzureOpenAiChatCompletionStream(
      () =>
        AzureOpenAiChatCompletionStream._processContentStream(
          this,
          choiceIndex
        ),
      this.controller
    );
  }
}
