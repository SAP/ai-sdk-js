import { createLogger } from '@sap-cloud-sdk/util';
import { jest } from '@jest/globals';
import { parseFileToString } from '../../../../test-util/mock-http.js';
import { AzureOpenAiChatCompletionStream } from './azure-openai-chat-completion-stream.js';
import { LineDecoder } from './stream/line-decoder.js';
import { SSEDecoder } from './stream/sse-decoder.js';

describe('OpenAI chat completion stream', () => {
  let sseChunks: string[];
  let originalChatCompletionStream: AzureOpenAiChatCompletionStream<any>;

  beforeEach(async () => {
    const rawChunksString = await parseFileToString(
      'foundation-models',
      'azure-openai-chat-completion-stream-chunks.txt'
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
    originalChatCompletionStream = new AzureOpenAiChatCompletionStream(
      iterator,
      new AbortController()
    );
  });

  it('should wrap the raw chunk', async () => {
    let output = '';
    const asnycGenerator = AzureOpenAiChatCompletionStream._processChunk(
      originalChatCompletionStream
    );
    for await (const chunk of asnycGenerator) {
      expect(chunk).toBeDefined();
      chunk.getDeltaContent() ? (output += chunk.getDeltaContent()) : null;
    }
    expect(output).toEqual('The capital of France is Paris.');
  });

  it('should process the finish reasons', async () => {
    const logger = createLogger({
      package: 'foundation-models',
      messageContext: 'azure-openai-chat-completion-stream'
    });
    const debugSpy = jest.spyOn(logger, 'debug');
    const asyncGeneratorChunk = AzureOpenAiChatCompletionStream._processChunk(
      originalChatCompletionStream
    );
    const asyncGeneratorFinishReason =
      AzureOpenAiChatCompletionStream._processFinishReason(
        new AzureOpenAiChatCompletionStream(() => asyncGeneratorChunk, new AbortController())
      );

    for await (const chunk of asyncGeneratorFinishReason) {
      expect(chunk).toBeDefined();
    }
    expect(debugSpy).toHaveBeenCalledWith(`Choice 0: Stream finished.`);
  });

  it('should process the token usage', async () => {
    const logger = createLogger({
      package: 'foundation-models',
      messageContext: 'azure-openai-chat-completion-stream'
    });
    const debugSpy = jest.spyOn(logger, 'debug');
    const asyncGeneratorChunk = AzureOpenAiChatCompletionStream._processChunk(
      originalChatCompletionStream
    );
    const asyncGeneratorTokenUsage =
      AzureOpenAiChatCompletionStream._processTokenUsage(
        new AzureOpenAiChatCompletionStream(() => asyncGeneratorChunk, new AbortController())
      );

    for await (const chunk of asyncGeneratorTokenUsage) {
      expect(chunk).toBeDefined();
    }
    expect(debugSpy).toHaveBeenCalledWith(
      expect.stringContaining('Token usage:')
    );
  });

  it('should transform the original stream to string stream', async () => {
    const asyncGeneratorChunk = AzureOpenAiChatCompletionStream._processChunk(
      originalChatCompletionStream
    );
    const chunkStream = new AzureOpenAiChatCompletionStream(
      () => asyncGeneratorChunk,
      new AbortController()
    );

    let output = '';
    for await (const chunk of chunkStream.toContentStream()) {
      expect(typeof chunk).toBe('string');
      output += chunk;
    }
    expect(output).toEqual('The capital of France is Paris.');
  });
});
