import nock from 'nock';
import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import { mockGetAiCoreDestination } from '../../test-util/mock-context.js';
import {
  BaseLlmParametersWithDeploymentId,
  EndpointOptions
} from '../../core/http-client.js';
import { mockInference, parseMockResponse } from '../../test-util/mock-http.js';
import { OpenAiClient } from './openai-client.js';
import {
  OpenAiChatCompletionOutput,
  OpenAiChatCompletionParameters,
  OpenAiChatMessage,
  OpenAiEmbeddingOutput,
  OpenAiEmbeddingParameters
} from './openai-types.js';

describe('openai client', () => {
  let destination: HttpDestination;
  const deploymentConfiguration: BaseLlmParametersWithDeploymentId = {
    deploymentId: 'deployment-id'
  };
  let chatCompletionEndpoint: EndpointOptions;
  let embeddingsEndpoint: EndpointOptions;

  beforeAll(() => {
    destination = mockGetAiCoreDestination();

    chatCompletionEndpoint = {
      url: 'chat/completions',
      apiVersion: '2024-02-01'
    };

    embeddingsEndpoint = {
      url: 'embeddings',
      apiVersion: '2024-02-01'
    };
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
        destination,
        chatCompletionEndpoint
      );

      expect(new OpenAiClient().chatCompletion(request)).resolves.toEqual(
        mockResponse
      );
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
        destination,
        chatCompletionEndpoint
      );

      await expect(
        new OpenAiClient().chatCompletion(request)
      ).rejects.toThrow();
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
        destination,
        embeddingsEndpoint
      );

      expect(new OpenAiClient().embeddings(request)).resolves.toEqual(
        mockResponse
      );
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
        destination,
        embeddingsEndpoint
      );

      expect(new OpenAiClient().embeddings(request)).rejects.toThrow();
    });
  });
});
