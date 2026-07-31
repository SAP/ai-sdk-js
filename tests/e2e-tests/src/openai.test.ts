import {
  openAiChatCompletion,
  openAiChatCompletionStream,
  openAiChatCompletionParse,
  openAiChatCompletionPerRequestModel,
  openAiComputeEmbedding,
  responsesApi,
  responsesApiStream,
  responsesApiParse,
  responsesApiStateful,
  responsesApiMultiTurn
} from '@sap-ai-sdk/sample-code';
import { loadEnv } from './utils/load-env.ts';

loadEnv();

describe('Azure OpenAI via OpenAI SDK', () => {
  it('should complete a chat', async () => {
    const result = await openAiChatCompletion();
    expect(result).toContain('Paris');
  });

  it('should stream a chat completion', async () => {
    const stream = await openAiChatCompletionStream();
    let content = '';
    for await (const chunk of stream) {
      content += chunk.choices[0]?.delta?.content ?? '';
    }
    expect(content).toEqual(expect.any(String));
    expect(content.length).toBeGreaterThan(0);
  });

  it('should parse a chat completion with structured output', async () => {
    const result = await openAiChatCompletionParse();
    expect(result).toEqual('Paris');
  });

  it('should allow setting a model per request', async () => {
    const result = await openAiChatCompletionPerRequestModel();
    expect(result).toContain('Paris');
  });

  it('should compute an embedding vector', async () => {
    const result = await openAiComputeEmbedding();
    expect(result).not.toHaveLength(0);
  });

  it('should use the Responses API', async () => {
    const result = await responsesApi();
    expect(result).toContain('Paris');
  });

  it('should stream the Responses API', async () => {
    const stream = await responsesApiStream();
    let content = '';
    for await (const event of stream) {
      if (event.type === 'response.output_text.delta') {
        content += event.delta;
      }
    }
    expect(content).toEqual(expect.any(String));
    expect(content.length).toBeGreaterThan(0);
  });

  it('should parse a Responses API response with structured output', async () => {
    const result = await responsesApiParse();
    expect(result).toEqual('Paris');
  });

  it('should use the Responses API statefulness via previous_response_id', async () => {
    const result = await responsesApiStateful();
    expect(result).toEqual(expect.any(String));
    expect(result!.length).toBeGreaterThan(0);
  });

  it('should use the Responses API statefulness via manual context', async () => {
    const result = await responsesApiMultiTurn();
    expect(result).toEqual(expect.any(String));
    expect(result!.length).toBeGreaterThan(0);
  });
});
