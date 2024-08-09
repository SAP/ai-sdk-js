import nock from 'nock';
import { jest } from '@jest/globals';
import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import { mockGetAiCoreDestination } from '../test-util/mock-context.js';
import { mockInference, parseMockResponse } from '../test-util/mock-http.js';
import { BaseLlmParametersWithDeploymentId } from '../core/index.js';
import {
  CompletionPostResponse,
  FilteringModuleConfig
} from './client/api/index.js';
import { GenAiHubCompletionParameters } from './orchestration-types.js';
import { createAzureFilter } from './orchestration-filter-utility.js';
jest.unstable_mockModule('../core/context.js', () => ({
  getAiCoreDestination: jest.fn(() =>
    Promise.resolve(mockGetAiCoreDestination())
  )
}));

const { GenAiHubClient, constructCompletionPostRequest } = await import(
  './orchestration-client.js'
);
describe('GenAiHubClient', () => {
  let destination: HttpDestination;
  const client = new GenAiHubClient();
  const deploymentConfiguration: BaseLlmParametersWithDeploymentId = {
    deploymentId: 'deployment-id'
  };

  beforeAll(() => {
    destination = mockGetAiCoreDestination();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  afterAll(() => {
    jest.restoreAllMocks();
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
      },
      filterConfig: {
        input: createAzureFilter({ Hate: 4, SelfHarm: 2 }),
        output: createAzureFilter({ Sexual: 0, Violence: 4 })
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
    expect(client.chatCompletion(request)).resolves.toEqual(mockResponse);

    const originalOrchestrationServicefilterConfig: FilteringModuleConfig = {
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
    };
    request.filterConfig = originalOrchestrationServicefilterConfig;
    expect(client.chatCompletion(request)).resolves.toEqual(mockResponse);
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
