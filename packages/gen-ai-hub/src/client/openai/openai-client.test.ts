import nock from 'nock';
import {
  mockClientCredentialsGrantCall,
  mockInference,
  parseMockResponse
} from '../../../../../test-util/mock-http.js';
import {
  OpenAiChatCompletionOutput,
  OpenAiChatMessage,
  OpenAiEmbeddingOutput,
  OpenAiEmbeddingParameters
} from './openai-types.js';
import { OpenAiClient } from './openai-client.js';

describe('openai client', () => {
  const chatCompletionEndpoint = {
    url: 'inference/deployments/1234/chat/completions',
    apiVersion: '2024-02-01'
  };
  const embeddingsEndpoint = {
    url: 'inference/deployments/1234/embeddings',
    apiVersion: '2024-02-01'
  };

  const client = new OpenAiClient();

  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('chatCompletion', () => {
    it('parses a successful response', async () => {
      const prompt = {
        messages: [
          {
            role: 'user',
            content: 'Where is the deepest place on earth located'
          }
        ] as OpenAiChatMessage[]
      };

      const mockResponse = parseMockResponse<OpenAiChatCompletionOutput>(
        'openai',
        'openai-chat-completion-success-response.json'
      );

      mockInference(
        {
          data: prompt
        },
        {
          data: mockResponse,
          status: 200
        },
        chatCompletionEndpoint
      );

      const response = await client.chatCompletion(prompt, {
        deploymentId: '1234'
      });
      expect(response).toEqual(mockResponse);
    });

    it('throws on bad request', async () => {
      const prompt = { messages: [] };
      const mockResponse = parseMockResponse(
        'openai',
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
        chatCompletionEndpoint
      );

      await expect(
        client.chatCompletion(prompt, { deploymentId: '1234' })
      ).rejects.toThrow('status code 400');
    });
  });

  describe('embeddings', () => {
    it('parses a successful response', async () => {
      const prompt = {
        input: ['AI is fascinating']
      } as OpenAiEmbeddingParameters;
      const mockResponse = parseMockResponse<OpenAiEmbeddingOutput>(
        'openai',
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
      const response = await client.embeddings(prompt, {
        deploymentId: '1234'
      });
      expect(response).toEqual(mockResponse);
    });

    it('throws on bad request', async () => {
      const prompt = { input: [] };
      const mockResponse = parseMockResponse(
        'openai',
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

      await expect(
        client.embeddings(prompt, { deploymentId: '1234' })
      ).rejects.toThrow('status code 400');
    });
  });
});
