import nock from 'nock';
import { BaseLlmParametersWithDeploymentId } from '@sap-ai-sdk/core';
import {
  mockClientCredentialsGrantCall,
  mockInference,
  parseMockResponse
} from '../../../../test-util/mock-http.js';
import { dummyToken } from '../../../../test-util/mock-jwt.js';
import { CompletionPostResponse } from './client/api/index.js';
import { GenAiHubCompletionParameters } from './orchestration-types.js';
import {
  GenAiHubClient,
  constructCompletionPostRequest
} from './orchestration-client.js';

describe('GenAiHubClient', () => {
  const client = new GenAiHubClient();
  const deploymentConfiguration: BaseLlmParametersWithDeploymentId = {
    deploymentId: 'deployment-id'
  };

  beforeAll(() => {
    mockClientCredentialsGrantCall({ access_token: dummyToken }, 200);
  });

  afterAll(() => {
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
      {
        url: 'completion'
      }
    );
    const response = await client.chatCompletion(request);
    expect(response).toEqual(mockResponse);
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
      {
        url: 'completion'
      }
    );
    const response = await client.chatCompletion(request);
    expect(response).toEqual(mockResponse);
  });
});
