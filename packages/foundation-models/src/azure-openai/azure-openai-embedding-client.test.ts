import nock from 'nock';
import {
  mockClientCredentialsGrantCall,
  mockInference,
  parseMockResponse
} from '../../../../test-util/mock-http.js';
import {
  AzureOpenAiEmbeddingOutput,
  AzureOpenAiEmbeddingParameters
} from './azure-openai-types.js';
import { AzureOpenAiEmbeddingClient } from './azure-openai-embedding-client.js';

describe('Azure OpenAI embedding client', () => {
  const embeddingsEndpoint = {
    url: 'inference/deployments/1234/embeddings',
    apiVersion: '2024-02-01'
  };

  const client = new AzureOpenAiEmbeddingClient({ deploymentId: '1234' });

  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('parses a successful response', async () => {
    const prompt = {
      input: ['AI is fascinating']
    } as AzureOpenAiEmbeddingParameters;
    const mockResponse = parseMockResponse<AzureOpenAiEmbeddingOutput>(
      'foundation-models',
      'azure-openai-embeddings-success-response.json'
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
    expect(response).toEqual(mockResponse);
  });

  it('throws on bad request', async () => {
    const prompt = { input: [] };
    const mockResponse = parseMockResponse(
      'foundation-models',
      'azure-openai-error-response.json'
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
