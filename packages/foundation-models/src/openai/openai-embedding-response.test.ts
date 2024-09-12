import { parseMockResponse } from '../../../../test-util/mock-http.js';
import { OpenAiChatCompletionOutput } from './openai-types.js';
import { openAiEmbeddingOutputSchema } from './openai-types-schema.js';
import { OpenAiEmbeddingResponse } from './openai-embedding-response.js';

describe('OpenAI embedding response', () => {
  const mockResponse = parseMockResponse<OpenAiChatCompletionOutput>(
    'foundation-models',
    'openai-embeddings-success-response.json'
  );
  const rawResponse = {
    data: mockResponse,
    status: 200,
    headers: {},
    request: {}
  };
  const response = new OpenAiEmbeddingResponse(
    rawResponse,
    openAiEmbeddingOutputSchema
  );

  it('should return the embedding response', () => {
    expect(response.data).toStrictEqual(mockResponse);
  });
});
