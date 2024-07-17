import fs from 'fs';
import path from 'path';
import nock from 'nock';
import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import { mockGetAiCoreDestination } from '../../../test-util/mock-context.js';
import {
  BaseLlmParameters,
  BaseLlmParametersWithDeploymentId,
  EndpointOptions
} from '../../core/http-client.js';
import { mockInference } from '../../../test-util/mock-http.js';
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
  let deploymentConfig: BaseLlmParameters;
  let chatCompletionEndpoint: EndpointOptions;
  let embeddingsEndpoint: EndpointOptions;

  beforeAll(() => {
    destination = mockGetAiCoreDestination();
    deploymentConfig = {
      deploymentConfiguration: {
        deploymentId: 'deployment-id'
      } as BaseLlmParametersWithDeploymentId
    };
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

  it('chatCompletion() parses a successful response', async () => {
    const prompt = {
      messages: [
        { role: 'user', content: 'Where is the deepest place on earth located' }
      ] as OpenAiChatMessage[]
    };
    const request: OpenAiChatCompletionParameters = {
      ...prompt,
      ...deploymentConfig
    };
    const mockResponse = fs.readFileSync(
      path.join(
        __dirname,
        '../../..',
        'test-util',
        'mock-data',
        'openai',
        'openai-chat-completion-success-response.json'
      ),
      'utf8'
    );

    mockInference(
      {
        data: request
      },
      {
        data: JSON.parse(mockResponse),
        status: 200
      },
      destination,
      chatCompletionEndpoint
    );

    const result: OpenAiChatCompletionOutput =
      await new OpenAiClient().chatCompletion(request);
    const expectedResponse: OpenAiChatCompletionOutput =
      JSON.parse(mockResponse);

    expect(result).toEqual(expectedResponse);
  });

  it('chatCompletion() throws on bad request', async () => {
    const prompt = { messages: [] };
    const request: OpenAiChatCompletionParameters = {
      ...prompt,
      ...deploymentConfig
    };
    const mockResponse = fs.readFileSync(
      path.join(
        __dirname,
        '../../..',
        'test-util',
        'mock-data',
        'openai',
        'openai-error-response.json'
      ),
      'utf8'
    );

    mockInference(
      {
        data: request
      },
      {
        data: JSON.parse(mockResponse),
        status: 400
      },
      destination,
      chatCompletionEndpoint
    );

    await expect(new OpenAiClient().chatCompletion(request)).rejects.toThrow();
  });

  it('embeddings() parses a successful response', async () => {
    const prompt = { input: ['AI is fascinating'] };
    const request: OpenAiEmbeddingParameters = {
      ...prompt,
      ...deploymentConfig
    };
    const mockResponse = fs.readFileSync(
      path.join(
        __dirname,
        '../../..',
        'test-util',
        'mock-data',
        'openai',
        'openai-embeddings-success-response.json'
      ),
      'utf8'
    );

    mockInference(
      {
        data: request
      },
      {
        data: JSON.parse(mockResponse),
        status: 200
      },
      destination,
      embeddingsEndpoint
    );

    const result: OpenAiEmbeddingOutput = await new OpenAiClient().embeddings(
      request
    );
    const expectedResponse: OpenAiEmbeddingOutput = JSON.parse(mockResponse);
    expect(result).toEqual(expectedResponse);
  });

  it('embeddings() throws on bad request', async () => {
    const prompt = { input: [] };
    const request: OpenAiEmbeddingParameters = {
      ...prompt,
      ...deploymentConfig
    };
    const mockResponse = fs.readFileSync(
      path.join(
        __dirname,
        '../../..',
        'test-util',
        'mock-data',
        'openai',
        'openai-error-response.json'
      ),
      'utf8'
    );

    mockInference(
      {
        data: request
      },
      {
        data: JSON.parse(mockResponse),
        status: 400
      },
      destination,
      embeddingsEndpoint
    );

    await expect(new OpenAiClient().embeddings(request)).rejects.toThrow();
  });
});
