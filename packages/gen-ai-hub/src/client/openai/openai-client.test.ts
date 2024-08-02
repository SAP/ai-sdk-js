import nock from 'nock';
import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import { mockGetAiCoreDestination } from '../../../test-util/mock-context.js';
import {
  EndpointOptions
} from '../../core/http-client.js';
import {
  mockInference,
  parseMockResponse
} from '../../../test-util/mock-http.js';
import { OpenAiClient } from './openai-client.js';
import {
  OpenAiChatCompletionOutput,
  OpenAiChatCompletionParameters,
  OpenAiChatMessage,
  OpenAiEmbeddingOutput,
  OpenAiEmbeddingParameters,
  OpenAiModels
} from './openai-types.js';

describe('openai client', () => {
  let destination: HttpDestination;
  let chatCompletionEndpoint: EndpointOptions;
  let embeddingsEndpoint: EndpointOptions;

  beforeAll(() => {
    destination = mockGetAiCoreDestination();

    chatCompletionEndpoint = {
      deploymentId: 'deployment-id',
      path: 'chat/completions'
    };
    
    embeddingsEndpoint = {
      deploymentId: 'deployment-id',
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

      expect(new OpenAiClient().chatCompletion(OpenAiModels.GPT4o, prompt, { id: 'mock', scenarioId: 'my-custom-scenario' })).resolves.toEqual(
        mockResponse
      );
    });

    it('throws on bad request', async () => {
      const prompt = { messages: [] };
     
      const mockResponse = parseMockResponse(
        'openai',
        'openai-error-response.json'
      );

      await expect(
        new OpenAiClient().chatCompletion(OpenAiModels.GPT4o, prompt, { id: 'mock' })
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

      expect(new OpenAiClient().embeddings(OpenAiModels.ADA002, prompt, { id: 'mock' })).resolves.toEqual(
        mockResponse
      );
    });

    it('throws on bad request', async () => {
      const prompt = { input: [] };
     
      const mockResponse = parseMockResponse(
        'openai',
        'openai-error-response.json'
      );

      expect(new OpenAiClient().embeddings(OpenAiModels.ADA002, prompt, { id: 'mock' })).rejects.toThrow();
    });
  });
});
