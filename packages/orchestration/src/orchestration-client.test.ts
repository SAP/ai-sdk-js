import nock from 'nock';
import {
  mockClientCredentialsGrantCall,
  mockDeploymentsList,
  mockInference,
  parseMockResponse
} from '../../../test-util/mock-http.js';
import { CompletionPostResponse } from './client/api/schema/index.js';
import {
  constructCompletionPostRequest,
  OrchestrationClient
} from './orchestration-client.js';
import { azureContentFilter } from './orchestration-filter-utility.js';
import { OrchestrationResponse } from './orchestration-response.js';
import { OrchestrationModuleConfig } from './orchestration-types.js';

describe('orchestration service client', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
    mockDeploymentsList({ scenarioId: 'orchestration' }, { id: '1234' });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('calls chatCompletion with minimum configuration', async () => {
    const config: OrchestrationModuleConfig = {
      llm: {
        model_name: 'gpt-35-turbo-16k',
        model_params: { max_tokens: 50, temperature: 0.1 }
      },
      templating: {
        template: [{ role: 'user', content: 'Hello!' }]
      }
    };

    const mockResponse = parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'orchestration-chat-completion-success-response.json'
    );

    mockInference(
      {
        data: constructCompletionPostRequest(config)
      },
      {
        data: mockResponse,
        status: 200
      },
      {
        url: 'inference/deployments/1234/completion'
      }
    );
    const response = await new OrchestrationClient(config).chatCompletion();

    expect(response).toBeInstanceOf(OrchestrationResponse);
    expect(response.data).toEqual(mockResponse);
    expect(response.getContent()).toEqual(expect.any(String));
    expect(response.getFinishReason()).toEqual(expect.any(String));
    expect(response.getTokenUsage().completion_tokens).toEqual(9);
  });

  it('calls chatCompletion with filter configuration supplied using convenience function', async () => {
    const config: OrchestrationModuleConfig = {
      llm: {
        model_name: 'gpt-35-turbo-16k',
        model_params: { max_tokens: 50, temperature: 0.1 }
      },
      templating: {
        template: [
          {
            role: 'user',
            content: 'Create {{?number}} paraphrases of {{?phrase}}'
          }
        ]
      },
      filtering: {
        input: azureContentFilter({ Hate: 4, SelfHarm: 2 }),
        output: azureContentFilter({ Sexual: 0, Violence: 4 })
      }
    };
    const prompt = {
      inputParams: { phrase: 'I hate you.', number: '3' }
    };
    const mockResponse = parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'orchestration-chat-completion-filter-config.json'
    );

    mockInference(
      {
        data: constructCompletionPostRequest(config, prompt)
      },
      {
        data: mockResponse,
        status: 200
      },
      {
        url: 'inference/deployments/1234/completion'
      }
    );
    const response = await new OrchestrationClient(config).chatCompletion(
      prompt
    );
    expect(response.data).toEqual(mockResponse);
  });

  it('calls chatCompletion with filtering configuration', async () => {
    const config: OrchestrationModuleConfig = {
      llm: {
        model_name: 'gpt-35-turbo-16k',
        model_params: { max_tokens: 50, temperature: 0.1 }
      },
      templating: {
        template: [
          {
            role: 'user',
            content: 'Create {{?number}} paraphrases of {{?phrase}}'
          }
        ]
      },
      filtering: {
        input: {
          filters: [
            {
              type: 'azure_content_safety' as const,
              config: {
                Hate: 4 as const,
                SelfHarm: 2 as const
              }
            }
          ]
        },
        output: {
          filters: [
            {
              type: 'azure_content_safety' as const,
              config: {
                Sexual: 0 as const,
                Violence: 4 as const
              }
            }
          ]
        }
      }
    };
    const prompt = { inputParams: { phrase: 'I hate you.', number: '3' } };
    const mockResponse = parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'orchestration-chat-completion-filter-config.json'
    );

    mockInference(
      {
        data: constructCompletionPostRequest(config, prompt)
      },
      {
        data: mockResponse,
        status: 200
      },
      {
        url: 'inference/deployments/1234/completion'
      }
    );
    const response = await new OrchestrationClient(config).chatCompletion(
      prompt
    );
    expect(response.data).toEqual(mockResponse);
  });

  it('sends message history together with templating config', async () => {
    const config: OrchestrationModuleConfig = {
      llm: {
        model_name: 'gpt-35-turbo-16k',
        model_params: { max_tokens: 50, temperature: 0.1 }
      },
      templating: {
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
      'orchestration-chat-completion-message-history.json'
    );
    mockInference(
      {
        data: constructCompletionPostRequest(config)
      },
      {
        data: mockResponse,
        status: 200
      },
      {
        url: 'inference/deployments/1234/completion'
      }
    );
    const response = await new OrchestrationClient(config).chatCompletion();
    expect(response.data).toEqual(mockResponse);
  });
});
