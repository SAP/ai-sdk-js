import nock from 'nock';
import {
  mockClientCredentialsGrantCall,
  mockInference,
  parseMockResponse
} from '../../../../test-util/mock-http.js';
import { CompletionPostResponse } from './client/api/index.js';
import {
  OrchestrationClient,
  constructCompletionPostRequest
} from './orchestration-client.js';
import { azureContentFilter } from './orchestration-filter-utility.js';
import { OrchestrationCompletionParameters } from './orchestration-types.js';

describe('GenAiHubClient', () => {
  const client = new OrchestrationClient();

  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('calls chatCompletion with minimum configuration', async () => {
    const request = {
      llmConfig: {
        model_name: 'gpt-35-turbo-16k',
        model_params: { max_tokens: 50, temperature: 0.1 }
      },
      prompt: {
        template: [{ role: 'user', content: 'Hello!' }]
      }
    };

    const mockResponse = parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'genaihub-chat-completion-success-response.json'
    );

    mockInference(
      {
        data: constructCompletionPostRequest(request)
      },
      {
        data: mockResponse,
        status: 200
      },
      {
        url: 'inference/deployments/1234/completion'
      }
    );
    const response = await client.chatCompletion(request, '1234');
    expect(response).toEqual(mockResponse);
  });

  it('calls chatCompletion with filter configuration supplied using convenience function', async () => {
    const request = {
      llmConfig: {
        model_name: 'gpt-35-turbo-16k',
        model_params: { max_tokens: 50, temperature: 0.1 }
      },
      prompt: {
        template: [
          {
            role: 'user',
            content: 'Create {{?number}} paraphrases of {{?phrase}}'
          }
        ],
        template_params: { phrase: 'I hate you.', number: '3' }
      },
      filterConfig: {
        input: azureContentFilter({ Hate: 4, SelfHarm: 2 }),
        output: azureContentFilter({ Sexual: 0, Violence: 4 })
      }
    };
    const mockResponse = parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'genaihub-chat-completion-filter-config.json'
    );

    mockInference(
      {
        data: constructCompletionPostRequest(request)
      },
      {
        data: mockResponse,
        status: 200
      },
      {
        url: 'inference/deployments/1234/completion'
      }
    );
    const response = await client.chatCompletion(request, '1234');
    expect(response).toEqual(mockResponse);
  });

  it('calls chatCompletion with filtering configuration', async () => {
    const request = {
      llmConfig: {
        model_name: 'gpt-35-turbo-16k',
        model_params: { max_tokens: 50, temperature: 0.1 }
      },
      prompt: {
        template: [
          {
            role: 'user',
            content: 'Create {{?number}} paraphrases of {{?phrase}}'
          }
        ],
        template_params: { phrase: 'I hate you.', number: '3' }
      },
      filterConfig: {
        input: {
          filters: [
            {
              type: 'azure_content_safety',
              config: {
                Hate: 4,
                SelfHarm: 2
              }
            }
          ]
        },
        output: {
          filters: [
            {
              type: 'azure_content_safety',
              config: {
                Sexual: 0,
                Violence: 4
              }
            }
          ]
        }
      }
    } as OrchestrationCompletionParameters;
    const mockResponse = parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'genaihub-chat-completion-filter-config.json'
    );

    mockInference(
      {
        data: constructCompletionPostRequest(request)
      },
      {
        data: mockResponse,
        status: 200
      },
      {
        url: 'inference/deployments/1234/completion'
      }
    );
    const response = await client.chatCompletion(request, '1234');
    expect(response).toEqual(mockResponse);
  });

  it('sends message history together with templating config', async () => {
    const request = {
      llmConfig: {
        model_name: 'gpt-35-turbo-16k',
        model_params: { max_tokens: 50, temperature: 0.1 }
      },
      prompt: {
        template: [{ role: 'user', content: "What's my name?" }],
        messages_history: [
          {
            role: 'system',
            content:
              'You are a helpful assistant who remembers all details the user shares with you.'
          },
          {
            role: 'user',
            content: 'Hi! Im Bob'
          },
          {
            role: 'assistant',
            content:
              "Hi Bob, nice to meet you! I'm an AI assistant. I'll remember that your name is Bob as we continue our conversation."
          }
        ]
      }
    };
    const mockResponse = parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'genaihub-chat-completion-message-history.json'
    );
    mockInference(
      {
        data: constructCompletionPostRequest(request)
      },
      {
        data: mockResponse,
        status: 200
      },
      {
        url: 'inference/deployments/1234/completion'
      }
    );
    const response = await client.chatCompletion(request, '1234');
    expect(response).toEqual(mockResponse);
  });
});
