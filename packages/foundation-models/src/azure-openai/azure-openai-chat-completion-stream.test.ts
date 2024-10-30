import { parseFileToString } from "../../../../test-util/mock-http.js";
import { AzureOpenAiChatCompletionStream } from "../../internal.js";
import { LineDecoder } from "./azure-openai-line-decoder.js";
import { SSEDecoder } from "./azure-openai-sse-decoder.js";

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
    const rawLines: string[] = lineDecoder.decode(Buffer.from(rawChunksString, 'utf-8'));

    sseChunks = rawLines
      .map((chunk) => sseDecoder.decode(chunk))
      .filter((sse) => sse !== null)
      .filter((sse) => !sse.data.startsWith('[DONE]'))
      .map((sse) => JSON.parse(sse.data));

    async function *iterator(): AsyncGenerator<any> {
      for (let sseChunk of sseChunks) {
          yield sseChunk;
      }
    }
    originalChatCompletionStream = new AzureOpenAiChatCompletionStream(iterator);
  });

  it('should wrap the raw chunk', async () => {
    for await (const chunk of AzureOpenAiChatCompletionStream.processChunk(originalChatCompletionStream)) {
      expect(chunk).toBeDefined();
      console.log(chunk.getDeltaContent());
    }
  });
});
