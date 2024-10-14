import { createLogger } from '@sap-cloud-sdk/util';
import { jest } from '@jest/globals';
import { parseMockResponse } from '../../../../test-util/mock-http.js';
import { AzureOpenAiEmbeddingResponse } from './azure-openai-embedding-response.js';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';
import type { AzureOpenAiEmbeddingOutput } from './azure-openai-embedding-types.js';

describe('Azure OpenAI embedding response', () => {
  let embeddingResponse: AzureOpenAiEmbeddingResponse;
  let rawResponse: HttpResponse;
  let mockedData: AzureOpenAiEmbeddingOutput;
  beforeAll(async () => {
    mockedData = await parseMockResponse<AzureOpenAiEmbeddingOutput>(
      'foundation-models',
      'azure-openai-embeddings-success-response.json'
    );

    rawResponse = {
      data: mockedData,
      status: 200,
      headers: {},
      request: {}
    };
    embeddingResponse = new AzureOpenAiEmbeddingResponse(rawResponse);
  });

  it('should return the embedding response', () => {
    expect(embeddingResponse.data).toStrictEqual(mockedData);
  });

  it('should return raw response', () => {
    expect(embeddingResponse.rawResponse).toBe(rawResponse);
  });

  it('should return the first embedding', () => {
    expect(embeddingResponse.getEmbedding()).toEqual(
      mockedData.data[0].embedding
    );
  });

  it('should return undefined when convenience function is called with incorrect index', () => {
    const logger = createLogger({
      package: 'foundation-models',
      messageContext: 'azure-openai-embedding-response'
    });
    const errorSpy = jest.spyOn(logger, 'error');
    expect(embeddingResponse.getEmbedding(2)).toBeUndefined();
    expect(errorSpy).toHaveBeenCalledWith('Data index 2 is out of bounds.');
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('should return all embeddings', () => {
    expect(embeddingResponse.getEmbeddings()).toEqual([
      mockedData.data[0].embedding,
      mockedData.data[1]?.embedding
    ]);
  });
});
