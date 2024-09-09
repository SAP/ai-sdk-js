import nock from 'nock';
import {
  mockClientCredentialsGrantCall,
  mockInference,
  parseMockResponse
} from '../../../../../test-util/mock-http.js';
import {
  OpenAiChatCompletionOutput,
  OpenAiChatMessage
} from './openai-types.js';
import { OpenAiChatClient } from './openai-chat-client.js';

describe('openai chat client', () => {
  const chatCompletionEndpoint = {
    url: 'inference/deployments/1234/chat/completions',
    apiVersion: '2024-02-01'
  };

  const client = new OpenAiChatClient({ deploymentId: '1234' });

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

    const response = await client.run(prompt);
    expect(response.data).toEqual(mockResponse);
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

    await expect(client.run(prompt)).rejects.toThrow('status code 400');
  });
});
