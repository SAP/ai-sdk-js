import nock from 'nock';
import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import { mockGetAiCoreDestination } from '../../test-util/mock-context.js';
import { mockInference, parseMockResponse } from '../../test-util/mock-http.js';
import { BaseLlmParametersWithDeploymentId } from '../core/index.js';
import {
  GenAiHubClient,
  constructCompletionPostRequest
} from './orchestration-client.js';
import { CompletionPostResponse } from './api/index.js';
import {
  FilterConfig,
  GenAiHubCompletionParameters,
  Module
} from './orchestration-types.js';

describe('GenAiHubClient', () => {
  let destination: HttpDestination;
  let client: GenAiHubClient;
  const deploymentConfiguration: BaseLlmParametersWithDeploymentId = {
    deploymentId: 'deployment-id'
  };

  beforeAll(() => {
    destination = mockGetAiCoreDestination();
    client = new GenAiHubClient();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('calls chatCompletion with minimum configuration and parses response', async () => {
    const request: GenAiHubCompletionParameters = {
      deploymentConfiguration,
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
        data: {
          deploymentConfiguration,
          ...constructCompletionPostRequest(request)
        }
      },
      {
        data: mockResponse,
        status: 200
      },
      destination,
      {
        url: 'completion'
      }
    );
    expect(client.chatCompletion(request)).resolves.toEqual(mockResponse);
  });

  it('calls chatCompletion with filtering configuration and parses response', async () => {
    const filterConfig: FilterConfig = {
      input: {
        azureContentSafety: {
          Hate: 0,
          SelfHarm: 2
        }
      },
      output: {
        azureContentSafety: {
          Hate: 0,
          SelfHarm: 2,
          Sexual: 4,
          Violence: 6
        }
      }
    };
    const request: GenAiHubCompletionParameters = {
      deploymentConfiguration,
      llmConfig: {
        model_name: 'gpt-35-turbo-16k',
        model_params: { max_tokens: 50, temperature: 0.1 }
      },
      prompt: {
        template: [
          { role: 'user', content: 'Create {number} paraphrases of {phrase}' }
        ],
        template_params: { phrase: 'I hate you.', number: 3 }
      }
    };

    const mockResponse = parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'genaihub-chat-completion-filter-config.json'
    );

    mockInference(
      {
        data: {
          deploymentConfiguration,
          ...constructCompletionPostRequest(request)
        }
      },
      {
        data: mockResponse,
        status: 200
      },
      destination,
      {
        url: 'completion'
      }
    );
    expect(
      client.chatCompletion(request, undefined, {
        type: Module.Filtering,
        filterConfig
      })
    ).resolves.toEqual(mockResponse);
  });

  it('sends message history together with templating config', async () => {
    const request: GenAiHubCompletionParameters = {
      deploymentConfiguration,
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
        data: {
          deploymentConfiguration,
          ...constructCompletionPostRequest(request)
        }
      },
      {
        data: mockResponse,
        status: 200
      },
      destination,
      {
        url: 'completion'
      }
    );

    expect(client.chatCompletion(request)).resolves.toEqual(mockResponse);
  });
});
