import { parseMockResponse } from '../../../../test-util/mock-http.js';
import { AzureOpenAiEmbeddingResponse } from './azure-openai-embedding-response.js';

describe('Azure OpenAI embedding response', () => {
  const mockResponse = parseMockResponse<AzureOpenAiEmbeddingResponse>(
    'foundation-models',
    'azure-openai-embeddings-success-response.json'
  );
  const rawResponse = {
    data: mockResponse,
    status: 200,
    headers: {},
    request: {}
  };
  const response = new AzureOpenAiEmbeddingResponse(rawResponse);

  it('should return the embedding response', () => {
    // TODO: Add zod schema check here once embedding response is generated from spec
    expect(response.data).toStrictEqual(mockResponse);
  });
});
