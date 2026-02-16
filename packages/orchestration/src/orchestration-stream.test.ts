import { createLogger } from '@sap-cloud-sdk/util';
import { jest } from '@jest/globals';
import { LineDecoder, SSEDecoder } from '@sap-ai-sdk/core';
import { parseFileToString } from '../../../test-util/mock-http.js';
import { OrchestrationStream } from './orchestration-stream.js';
import { OrchestrationStreamResponse } from './orchestration-stream-response.js';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';
import type { CompletionPostResponseStreaming } from './client/api/schema/index.js';

describe('Orchestration chat completion stream', () => {
  let sseChunks: string[];
  let originalChatCompletionStream: OrchestrationStream<CompletionPostResponseStreaming>;
  const emptyHttpResponse: HttpResponse = {
    data: {},
    status: 200,
    statusText: 'OK',
    request: {},
    headers: {},
    config: {}
  };

  beforeEach(async () => {
    const rawChunksString = await parseFileToString(
      'orchestration',
      'orchestration-chat-completion-stream-chunks.txt'
    );
    const lineDecoder = new LineDecoder();
    const sseDecoder = new SSEDecoder();
    const rawLines: string[] = lineDecoder.decode(
      Buffer.from(rawChunksString, 'utf-8')
    );

    sseChunks = rawLines
      .map(chunk => sseDecoder.decode(chunk))
      .filter(sse => sse !== null)
      .filter(sse => !sse.data.startsWith('[DONE]'))
      .map(sse => JSON.parse(sse.data));

    async function* iterator(): AsyncGenerator<any> {
      for (const sseChunk of sseChunks) {
        yield sseChunk;
      }
    }
    originalChatCompletionStream = new OrchestrationStream(
      iterator,
      new AbortController()
    );
  });

  it('should wrap the raw chunk', async () => {
    let output = '';
    const asyncGenerator = OrchestrationStream._processChunk(
      originalChatCompletionStream
    );
    for await (const chunk of asyncGenerator) {
      expect(chunk).toBeDefined();
      output += chunk.getDeltaContent() ?? '';
    }
    expect(output).toMatchSnapshot();
  });

  it('should process the finish reasons', async () => {
    const logger = createLogger({
      package: 'orchestration',
      messageContext: 'stream-util'
    });
    const debugSpy = jest.spyOn(logger, 'debug');
    const asyncGeneratorChunk = OrchestrationStream._processChunk(
      originalChatCompletionStream
    );
    const asyncGeneratorFinishReason =
      OrchestrationStream._processOrchestrationStreamChunkResponse(
        new OrchestrationStream(
          () => asyncGeneratorChunk,
          new AbortController()
        ),
        new OrchestrationStreamResponse(emptyHttpResponse)
      );

    for await (const chunk of asyncGeneratorFinishReason) {
      expect(chunk).toBeDefined();
    }
    expect(debugSpy).toHaveBeenCalledWith('Choice 0: Stream finished.');
  });

  it('should process the token usage', async () => {
    const logger = createLogger({
      package: 'orchestration',
      messageContext: 'stream-util'
    });
    const debugSpy = jest.spyOn(logger, 'debug');
    const asyncGeneratorChunk = OrchestrationStream._processChunk(
      originalChatCompletionStream
    );
    const asyncGeneratorTokenUsage =
      OrchestrationStream._processOrchestrationStreamChunkResponse(
        new OrchestrationStream(
          () => asyncGeneratorChunk,
          new AbortController()
        ),
        new OrchestrationStreamResponse(emptyHttpResponse)
      );

    for await (const chunk of asyncGeneratorTokenUsage) {
      expect(chunk).toBeDefined();
    }
    expect(debugSpy).toHaveBeenCalledWith(
      expect.stringContaining('Token usage:')
    );
  });

  it('should transform the original stream to string stream', async () => {
    const asyncGeneratorChunk = OrchestrationStream._processChunk(
      originalChatCompletionStream
    );
    const chunkStream = new OrchestrationStream(
      () => asyncGeneratorChunk,
      new AbortController()
    );

    let output = '';
    for await (const chunk of chunkStream.toContentStream()) {
      expect(typeof chunk).toBe('string');
      output += chunk;
    }
    expect(output).toMatchSnapshot();
  });

  it('should not read from the stream in any way before streaming starts', async () => {
    const mockNext = jest.fn();
    async function* mockIterator(): AsyncGenerator<any> {
      mockNext();
      for (const sseChunk of sseChunks) {
        yield sseChunk;
      }
    }

    const stream = new OrchestrationStream(mockIterator, new AbortController());

    expect(mockNext).not.toHaveBeenCalled();

    const iterator = stream[Symbol.asyncIterator]();
    await iterator.next();

    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});
