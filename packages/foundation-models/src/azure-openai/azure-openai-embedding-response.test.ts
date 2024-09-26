import { createLogger } from '@sap-cloud-sdk/util';
import { jest } from '@jest/globals';
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
  const embeddingResponse = new AzureOpenAiEmbeddingResponse(rawResponse);

  it('should return the embedding response', () => {
    expect(embeddingResponse.data).toStrictEqual(mockResponse);
  });

  it('should return raw response', () => {
    expect(embeddingResponse.rawResponse).toBe(rawResponse);
  });
  it('should return undefined when convenience function is called with incorrect index', () => {
    const logger = createLogger({
      package: 'foundation-models',
      messageContext: 'azure-openai-embedding-response'
    });
    const errorSpy = jest.spyOn(logger, 'error');
    expect(embeddingResponse.getEmbedding(1)).toBeUndefined();
    expect(errorSpy).toHaveBeenCalledWith('Data index 1 is out of bounds.');
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });
});
