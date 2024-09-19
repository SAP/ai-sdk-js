import nock from 'nock';
import {
  mockClientCredentialsGrantCall,
  mockInference,
  parseMockResponse
} from '../../../../test-util/mock-http.js';
import {
  AzureOpenAiChatCompletionOutput,
  AzureOpenAiChatMessage
} from './azure-openai-types.js';
import { AzureOpenAiChatClient } from './azure-openai-chat-client.js';

describe('Azure OpenAI chat client', () => {
  const chatCompletionEndpoint = {
    url: 'inference/deployments/1234/chat/completions',
    apiVersion: '2024-02-01'
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
          role: 'user',
          content: 'Where is the deepest place on earth located'
        }
      ] as AzureOpenAiChatMessage[]
    };

    const mockResponse = parseMockResponse<AzureOpenAiChatCompletionOutput>(
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
