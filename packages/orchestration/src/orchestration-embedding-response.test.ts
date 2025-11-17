import { parseMockResponse } from '../../../test-util/mock-http.js';
import { OrchestrationEmbeddingResponse } from './orchestration-embedding-response.js';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';
import type { EmbeddingsPostResponse } from './client/api/schema/index.js';
import type { EmbeddingData } from './orchestration-types.js';

describe('OrchestrationEmbeddingResponse', () => {
  let mockResponse: EmbeddingsPostResponse;
  let rawResponse: HttpResponse;
  let embeddingResponse: OrchestrationEmbeddingResponse;

  beforeAll(async () => {
    mockResponse = await parseMockResponse<EmbeddingsPostResponse>(
      'orchestration',
      'orchestration-embedding-simple-response.json'
    );
    rawResponse = {
      data: mockResponse,
      status: 200,
      headers: {},
      request: {}
    };
    embeddingResponse = new OrchestrationEmbeddingResponse(rawResponse);
  });

  it('should initialize with raw response', () => {
    expect(embeddingResponse.response).toBe(rawResponse);
  });

  it('should return the embedding response data', () => {
    expect(embeddingResponse._data).toStrictEqual(mockResponse);
  });

  it('should get embeddings', () => {
    const embeddings = embeddingResponse
      .getEmbeddings()
      .map(item => item.embedding);
    expect(embeddings).toEqual(expect.any(Array));
  });

  it('should get token usage', () => {
    const usage = embeddingResponse.getTokenUsage();

    expect(usage).toMatchObject({
      prompt_tokens: expect.any(Number),
      total_tokens: expect.any(Number)
    });
  });

  it('should return undefined for intermediate results when not present', () => {
    const intermediateResults = embeddingResponse.getIntermediateResults();
    expect(intermediateResults).toBeUndefined();
  });

  it('should handle response with intermediate results', async () => {
    const mockResponseWithMasking =
      await parseMockResponse<EmbeddingsPostResponse>(
        'orchestration',
        'orchestration-embedding-with-masking-response.json'
      );

    const localRawResponse = {
      data: mockResponseWithMasking,
      status: 200,
      headers: {},
      request: {}
    };

    const localEmbeddingResponse = new OrchestrationEmbeddingResponse(
      localRawResponse
    );
    const intermediateResults = localEmbeddingResponse.getIntermediateResults();

    expect(intermediateResults).toBeDefined();
    expect(intermediateResults!.input_masking).toMatchObject({
      message: expect.any(String),
      data: expect.any(Object)
    });
    expect(intermediateResults!.input_masking!.message).toBe(
      'Embedding input is masked successfully.'
    );
    expect(intermediateResults!.input_masking!.data).toMatchObject({
      masked_input: expect.any(String)
    });
  });

  it('should handle empty embedding data array', () => {
    const responseWithEmptyData: EmbeddingsPostResponse = {
      request_id: 'test-request-id',
      final_result: {
        object: 'list',
        data: [],
        model: 'text-embedding-3-small',
        usage: {
          prompt_tokens: 0,
          total_tokens: 0
        }
      }
    };

    const httpResponse: HttpResponse = {
      data: responseWithEmptyData,
      status: 200,
      headers: {},
      request: {}
    };

    const response = new OrchestrationEmbeddingResponse(httpResponse);
    const embeddings = response.getEmbeddings().map(item => item.embedding);
    const usage = response.getTokenUsage();

    expect(embeddings).toEqual([]);
    expect(usage).toMatchObject({
      prompt_tokens: 0,
      total_tokens: 0
    });
  });

  it('should handle multiple embedding vectors', () => {
    const responseWithMultipleEmbeddings: EmbeddingsPostResponse = {
      request_id: 'test-request-id',
      final_result: {
        object: 'list',
        data: [
          {
            object: 'embedding',
            embedding: [0.1, 0.2, 0.3, 0.4, 0.5],
            index: 0
          },
          {
            object: 'embedding',
            embedding: [0.6, 0.7, 0.8, 0.9, 1.0],
            index: 1
          }
        ],
        model: 'text-embedding-3-small',
        usage: {
          prompt_tokens: 15,
          total_tokens: 15
        }
      }
    };

    const httpResponse: HttpResponse = {
      data: responseWithMultipleEmbeddings,
      status: 200,
      headers: {},
      request: {}
    };

    const response = new OrchestrationEmbeddingResponse(httpResponse);
    const embeddings = response.getEmbeddings().map(item => item.embedding);
    expect(embeddings).toEqual([
      [0.1, 0.2, 0.3, 0.4, 0.5],
      [0.6, 0.7, 0.8, 0.9, 1.0]
    ]);
  });

  it('should throw error when using `getEmbeddingVectors()` for string embeddings', () => {
    const responseWithStringEmbedding: EmbeddingsPostResponse = {
      request_id: 'test-request-id',
      final_result: {
        object: 'list',
        data: [
          {
            object: 'embedding',
            embedding: 'base64-encoded-embedding-string',
            index: 0
          }
        ],
        model: 'text-embedding-3-small',
        usage: {
          prompt_tokens: 5,
          total_tokens: 5
        }
      }
    };

    const httpResponse: HttpResponse = {
      data: responseWithStringEmbedding,
      status: 200,
      headers: {},
      request: {}
    };

    const response = new OrchestrationEmbeddingResponse(httpResponse);

    const embeddings = response.getEmbeddings().map(item => item.embedding);
    expect(embeddings).toEqual(['base64-encoded-embedding-string']);
  });

  describe('getEmbeddings', () => {
    it('should return embedding data with indices for number arrays', () => {
      const responseWithMultipleEmbeddings: EmbeddingsPostResponse = {
        request_id: 'test-request-id',
        final_result: {
          object: 'list',
          data: [
            {
              object: 'embedding',
              embedding: [0.1, 0.2, 0.3, 0.4, 0.5],
              index: 0
            },
            {
              object: 'embedding',
              embedding: [0.6, 0.7, 0.8, 0.9, 1.0],
              index: 1
            }
          ],
          model: 'text-embedding-3-small',
          usage: {
            prompt_tokens: 15,
            total_tokens: 15
          }
        }
      };

      const httpResponse: HttpResponse = {
        data: responseWithMultipleEmbeddings,
        status: 200,
        headers: {},
        request: {}
      };

      const response = new OrchestrationEmbeddingResponse(httpResponse);
      const embeddings: EmbeddingData[] = response.getEmbeddings();

      expect(embeddings).toEqual([
        {
          embedding: [0.1, 0.2, 0.3, 0.4, 0.5],
          index: 0,
          object: 'embedding'
        },
        {
          embedding: [0.6, 0.7, 0.8, 0.9, 1.0],
          index: 1,
          object: 'embedding'
        }
      ]);
    });

    it('should return embedding data with indices for string embeddings', () => {
      const responseWithStringEmbedding: EmbeddingsPostResponse = {
        request_id: 'test-request-id',
        final_result: {
          object: 'list',
          data: [
            {
              object: 'embedding',
              embedding: 'base64-encoded-embedding-string',
              index: 0
            }
          ],
          model: 'text-embedding-3-small',
          usage: {
            prompt_tokens: 5,
            total_tokens: 5
          }
        }
      };

      const httpResponse: HttpResponse = {
        data: responseWithStringEmbedding,
        status: 200,
        headers: {},
        request: {}
      };

      const response = new OrchestrationEmbeddingResponse(httpResponse);
      const embeddings: EmbeddingData[] = response.getEmbeddings();

      expect(embeddings).toEqual([
        {
          embedding: 'base64-encoded-embedding-string',
          index: 0,
          object: 'embedding'
        }
      ]);
    });

    it('should return empty array for empty data', () => {
      const responseWithEmptyData: EmbeddingsPostResponse = {
        request_id: 'test-request-id',
        final_result: {
          object: 'list',
          data: [],
          model: 'text-embedding-3-small',
          usage: {
            prompt_tokens: 0,
            total_tokens: 0
          }
        }
      };

      const httpResponse: HttpResponse = {
        data: responseWithEmptyData,
        status: 200,
        headers: {},
        request: {}
      };

      const response = new OrchestrationEmbeddingResponse(httpResponse);
      const embeddings: EmbeddingData[] = response.getEmbeddings();

      expect(embeddings).toEqual([]);
    });
  });
});
