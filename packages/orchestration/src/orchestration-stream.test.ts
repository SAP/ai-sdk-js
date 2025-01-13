import { createLogger } from '@sap-cloud-sdk/util';
import { jest } from '@jest/globals';
import { LineDecoder, SSEDecoder } from '@sap-ai-sdk/core';
import { parseFileToString } from '../../../test-util/mock-http.js';
import { OrchestrationStream } from './orchestration-stream.js';
import type { CompletionPostResponseStreaming } from './client/api/schema/index.js';

describe('Orchestration chat completion stream', () => {
  let sseChunks: string[];
  let originalChatCompletionStream: OrchestrationStream<CompletionPostResponseStreaming>;

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
      messageContext: 'orchestration-chat-completion-stream'
    });
    const debugSpy = jest.spyOn(logger, 'debug');
    const asyncGeneratorChunk = OrchestrationStream._processChunk(
      originalChatCompletionStream
    );
    const asyncGeneratorFinishReason = OrchestrationStream._processFinishReason(
      new OrchestrationStream(() => asyncGeneratorChunk, new AbortController())
    );

    for await (const chunk of asyncGeneratorFinishReason) {
      expect(chunk).toBeDefined();
    }
    expect(debugSpy).toHaveBeenCalledWith('Choice 0: Stream finished.');
  });

  it('should process the token usage', async () => {
    const logger = createLogger({
      package: 'orchestration',
      messageContext: 'orchestration-chat-completion-stream'
    });
    const debugSpy = jest.spyOn(logger, 'debug');
    const asyncGeneratorChunk = OrchestrationStream._processChunk(
      originalChatCompletionStream
    );
    const asyncGeneratorTokenUsage = OrchestrationStream._processTokenUsage(
      new OrchestrationStream(() => asyncGeneratorChunk, new AbortController())
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
});
