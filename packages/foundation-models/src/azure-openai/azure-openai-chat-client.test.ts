import nock from 'nock';
import {
  mockClientCredentialsGrantCall,
  mockDeploymentsList,
  mockInference,
  parseMockResponse
} from '../../../../test-util/mock-http.js';
import { AzureOpenAiChatClient } from './azure-openai-chat-client.js';
import { apiVersion } from './model-types.js';
import type { AzureOpenAiCreateChatCompletionResponse } from './client/inference/schema';

describe('Azure OpenAI chat client', () => {
  const chatCompletionEndpoint = {
    url: 'inference/deployments/1234/chat/completions',
    apiVersion
  };

  const client = new AzureOpenAiChatClient({ deploymentId: '1234' });

  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('parses a successful response', async () => {
    const prompt = {
      messages: [
        {
          role: 'user' as const,
          content: 'Where is the deepest place on earth located'
        }
      ]
    };

    const mockResponse =
      await parseMockResponse<AzureOpenAiCreateChatCompletionResponse>(
        'foundation-models',
        'azure-openai-chat-completion-success-response.json'
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

    const response = await client.run(prompt);
    expect(response.data).toEqual(mockResponse);
  });
  it('allows a custom api-version', async () => {
    const prompt = {
      messages: [
        {
          role: 'user' as const,
          content: 'Where is the deepest place on earth located'
        }
      ]
    };

    const mockResponse =
      await parseMockResponse<AzureOpenAiCreateChatCompletionResponse>(
        'foundation-models',
        'azure-openai-chat-completion-success-response.json'
      );

    mockInference(
      {
        data: prompt
      },
      {
        data: mockResponse,
        status: 200
      },
      { ...chatCompletionEndpoint, apiVersion: 'foo-bar' }
    );

    const response = await client.run(prompt, {
      params: { 'api-version': 'foo-bar' }
    });
    expect(response.data).toEqual(mockResponse);
  });

  it('throws on bad request', async () => {
    const prompt = { messages: [] };
    const mockResponse = await parseMockResponse(
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
      chatCompletionEndpoint
    );

    await expect(client.run(prompt)).rejects.toThrow('status code 400');
  });

  it('executes a request with the custom resource group', async () => {
    const customChatCompletionEndpoint = {
      url: 'inference/deployments/1234/chat/completions',
      apiVersion,
      resourceGroup: 'custom-resource-group'
    };

    const mockResponse =
      await parseMockResponse<AzureOpenAiCreateChatCompletionResponse>(
        'foundation-models',
        'azure-openai-chat-completion-success-response.json'
      );

    const prompt = {
      messages: [
        {
          role: 'user' as const,
          content: 'Where is the deepest place on earth located'
        }
      ]
    };

    mockDeploymentsList(
      {
        scenarioId: 'foundation-models',
        resourceGroup: 'custom-resource-group',
        executableId: 'azure-openai'
      },
      { id: '1234', model: { name: 'gpt-4o', version: 'latest' } }
    );

    mockInference(
      {
        data: prompt
      },
      {
        data: mockResponse,
        status: 200
      },
      customChatCompletionEndpoint
    );

    const clientWithResourceGroup = new AzureOpenAiChatClient({
      modelName: 'gpt-4o',
      resourceGroup: 'custom-resource-group'
    });

    const response = await clientWithResourceGroup.run(prompt);
    expect(response.data).toEqual(mockResponse);
  });
});
