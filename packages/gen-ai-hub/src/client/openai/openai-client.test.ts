import nock from 'nock';
import { BaseLlmParametersWithDeploymentId } from '@sap-ai-sdk/core';
import {
  mockClientCredentialsGrantCall,
  mockInference,
  parseMockResponse
} from '../../../../../test-util/mock-http.js';
import {
  OpenAiChatCompletionOutput,
  OpenAiChatCompletionParameters,
  OpenAiChatMessage,
  OpenAiEmbeddingOutput,
  OpenAiEmbeddingParameters
} from './openai-types.js';
import { OpenAiClient } from './openai-client.js';

describe('openai client', () => {
  const deploymentConfiguration: BaseLlmParametersWithDeploymentId = {
    deploymentId: 'deployment-id'
  };
  const chatCompletionEndpoint = {
    url: 'chat/completions',
    apiVersion: '2024-02-01'
  };
  const embeddingsEndpoint = {
    url: 'embeddings',
    apiVersion: '2024-02-01'
  };

  const client = new OpenAiClient();

  beforeAll(() => {
    mockClientCredentialsGrantCall();
  });

  afterAll(() => {
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
      const request: OpenAiChatCompletionParameters = {
        ...prompt,
        deploymentConfiguration
      };
      const mockResponse = parseMockResponse<OpenAiChatCompletionOutput>(
        'openai',
        'openai-chat-completion-success-response.json'
      );

      mockInference(
        {
          data: request
        },
        {
          data: mockResponse,
          status: 200
        },
        chatCompletionEndpoint
      );

      const response = await client.chatCompletion(request);
      expect(response).toEqual(mockResponse);
    });

    it('throws on bad request', async () => {
      const prompt = { messages: [] };
      const request: OpenAiChatCompletionParameters = {
        ...prompt,
        deploymentConfiguration
      };
      const mockResponse = parseMockResponse(
        'openai',
        'openai-error-response.json'
      );

      mockInference(
        {
          data: request
        },
        {
          data: mockResponse,
          status: 400
        },
        chatCompletionEndpoint
      );

      expect(client.chatCompletion(request)).rejects.toThrow();
    });
  });

  describe('embeddings', () => {
    it('parses a successful response', async () => {
      const prompt = { input: ['AI is fascinating'] };
      const request: OpenAiEmbeddingParameters = {
        ...prompt,
        deploymentConfiguration
      };
      const mockResponse = parseMockResponse<OpenAiEmbeddingOutput>(
        'openai',
        'openai-embeddings-success-response.json'
      );

      mockInference(
        {
          data: request
        },
        {
          data: mockResponse,
          status: 200
        },
        embeddingsEndpoint
      );
      const response = await client.embeddings(request);
      expect(response).toEqual(mockResponse);
    });

    it('throws on bad request', async () => {
      const prompt = { input: [] };
      const request: OpenAiEmbeddingParameters = {
        ...prompt,
        deploymentConfiguration
      };
      const mockResponse = parseMockResponse(
        'openai',
        'openai-error-response.json'
      );

      mockInference(
        {
          data: request
        },
        {
          data: mockResponse,
          status: 400
        },
        embeddingsEndpoint
      );

      expect(client.embeddings(request)).rejects.toThrow();
    });
  });
});
