import nock from 'nock';
import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import { mockGetAiCoreDestination } from '../../test-util/mock-context.js';
import {
  EndpointOptions
} from '../../core/http-client.js';
import {
  mockInference,
  parseMockResponse
} from '../../test-util/mock-http.js';
import { AiDeployment } from '../../core/aicore.js';
import { OpenAiClient } from './openai-client.js';
import {
  OpenAiChatCompletionOutput,
  OpenAiChatMessage,
  OpenAiEmbeddingOutput,
  OpenAiModels
} from './openai-types.js';

describe('openai client', () => {
  let destination: HttpDestination;
  let deployment: AiDeployment;
  let chatCompletionEndpoint: EndpointOptions;
  let embeddingsEndpoint: EndpointOptions;

  beforeAll(() => {
    destination = mockGetAiCoreDestination();
    deployment = { id: 'mock', scenarioId: 'my-custom-scenario' };

    chatCompletionEndpoint = {
      deploymentId: deployment.id,
      path: 'chat/completions'
    };

    embeddingsEndpoint = {
      deploymentId: deployment.id,
      path: 'embeddings'
    };
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('chatCompletion', () => {
    it('parses a successful response', async () => {
      const mockResponse = parseMockResponse<OpenAiChatCompletionOutput>(
        'openai',
        'openai-chat-completion-success-response.json'
      );

      const prompt = {
        messages: [
          {
            role: 'user',
            content: 'Where is the deepest place on earth located'
          }
        ] as OpenAiChatMessage[]
      };
      mockInference({
        request: {
          endpoint: chatCompletionEndpoint,
          destination,
          data: prompt,
          query: { 'api-version': '2024-02-01' }
        }, response: {
          status: 200, data: mockResponse
        }
      });

      expect(new OpenAiClient().chatCompletion(OpenAiModels.GPT_4o, prompt, deployment)).resolves.toEqual(
        mockResponse
      );
    });

    it('throws on bad request', async () => {
      const prompt = { messages: [] };

      const mockResponse = parseMockResponse(
        'openai',
        'openai-error-response.json'
      );
      mockInference({
        request: {
          endpoint: chatCompletionEndpoint,
          destination
        }, response: {
          status: 400, data: mockResponse
        }
      });

      await expect(
        new OpenAiClient().chatCompletion(OpenAiModels.GPT_4o, prompt, deployment)
      ).rejects.toThrow();
    });
  });

  describe('embeddings', () => {
    it('parses a successful response', async () => {
      const prompt = { input: ['AI is fascinating'] };

      const mockResponse = parseMockResponse<OpenAiEmbeddingOutput>(
        'openai',
        'openai-embeddings-success-response.json'
      );
      mockInference({
        request: {
          endpoint: embeddingsEndpoint,
          destination,
          data: prompt
        }, response: {
          status: 200, data: mockResponse
        }
      });

      expect(new OpenAiClient().embeddings(OpenAiModels.ADA_002, prompt, deployment)).resolves.toEqual(
        mockResponse
      );
    });

    it('throws on bad request', async () => {
      const prompt = { input: [] };

      const mockResponse = parseMockResponse(
        'openai',
        'openai-error-response.json'
      );
      mockInference({
        request: {
          endpoint: embeddingsEndpoint,
          destination
        }, response: {
          status: 400, data: mockResponse
        }
      });

      expect(new OpenAiClient().embeddings(OpenAiModels.ADA_002, prompt, { id: 'mock' })).rejects.toThrow();
    });
  });
});
