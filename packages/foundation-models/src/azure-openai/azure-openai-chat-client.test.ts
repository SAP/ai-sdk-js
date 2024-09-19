import nock from 'nock';
import {
  mockClientCredentialsGrantCall,
  mockInference,
  parseMockResponse
} from '../../../../test-util/mock-http.js';
import { AzureOpenAiChatClient } from './azure-openai-chat-client.js';
import type { AzureOpenAiCreateChatCompletionResponse } from './client/inference/schema/index.js';
import { apiVersion } from './model-types.js';

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
      parseMockResponse<AzureOpenAiCreateChatCompletionResponse>(
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

  it('throws on bad request', async () => {
    const prompt = { messages: [] };
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
      chatCompletionEndpoint
    );

    await expect(client.run(prompt)).rejects.toThrow('status code 400');
  });
});
