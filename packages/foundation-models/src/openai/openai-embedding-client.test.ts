import nock from 'nock';
import {
  mockClientCredentialsGrantCall,
  mockInference,
  parseMockResponse
} from '../../../../test-util/mock-http.js';
import {
  OpenAiEmbeddingOutput,
  OpenAiEmbeddingParameters
} from './openai-types.js';
import { OpenAiEmbeddingClient } from './openai-embedding-client.js';

describe('openai embedding client', () => {
  const embeddingsEndpoint = {
    url: 'inference/deployments/1234/embeddings',
    apiVersion: '2024-02-01'
  };

  const client = new OpenAiEmbeddingClient({ deploymentId: '1234' });

  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('parses a successful response', async () => {
    const prompt = {
      input: ['AI is fascinating']
    } as OpenAiEmbeddingParameters;
    const mockResponse = parseMockResponse<OpenAiEmbeddingOutput>(
      'foundation-models',
      'openai-embeddings-success-response.json'
    );

    mockInference(
      {
        data: prompt
      },
      {
        data: mockResponse,
        status: 200
      },
      embeddingsEndpoint
    );
    const response = await client.run(prompt);
    expect(response.data).toEqual(mockResponse);
  });

  it('throws on bad request', async () => {
    const prompt = { input: [] };
    const mockResponse = parseMockResponse(
      'foundation-models',
      'openai-error-response.json'
    );

    mockInference(
      {
        data: prompt
      },
      {
        data: mockResponse,
        status: 400
      },
      embeddingsEndpoint
    );

    await expect(client.run(prompt)).rejects.toThrow('status code 400');
  });
});
