import nock from 'nock';
import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import { mockGetAiCoreDestination } from '../../test-util/mock-context.js';
import { mockInference, parseMockResponse } from '../../test-util/mock-http.js';
import { BaseLlmParametersWithDeploymentId } from '../core/index.js';
import {
  GenAiHubClient,
  GenAiHubCompletionParameters
} from './orchestration-client.js';
import {
  CompletionPostResponse,
  LLMModuleConfig,
  ModuleConfigs
} from './api/index.js';

describe('GenAiHubClient', () => {
  let destination: HttpDestination;
  let client: GenAiHubClient;
  const deploymentConfiguration: BaseLlmParametersWithDeploymentId = {
    deploymentId: 'deployment-id'
  };
  const llm_module_config: LLMModuleConfig = {
    model_name: 'gpt-35-turbo-16k',
    model_params: {
      max_tokens: 50,
      temperature: 0.1
    }
  };

  beforeAll(() => {
    destination = mockGetAiCoreDestination();
    client = new GenAiHubClient();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('calls chatCompletion with minimum configuration and parses response', async () => {
    const module_configurations: ModuleConfigs = {
      templating_module_config: {
        template: [{ role: 'user', content: 'Hello!' }]
      },
      llm_module_config
    };
    const request: GenAiHubCompletionParameters = {
      deploymentConfiguration,
      orchestration_config: { module_configurations }
    };

    const mockResponse = parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'genaihub-chat-completion-success-response.json'
    );

    mockInference(
      {
        data: { ...request, input_params: {} }
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

  it('sends message history together with templating config', async () => {
    const module_configurations: ModuleConfigs = {
      templating_module_config: {
        template: [{ role: 'user', content: "What's my name?" }]
      },
      llm_module_config
    };
    const request: GenAiHubCompletionParameters = {
      deploymentConfiguration,
      orchestration_config: { module_configurations },
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
    };

    const mockResponse = parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'genaihub-chat-completion-message-history.json'
    );
    mockInference(
      {
        data: { ...request, input_params: {} }
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
