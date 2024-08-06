import nock from 'nock';
import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import { mockGetAiCoreDestination } from '../test-util/mock-context.js';
import { mockInference, parseMockResponse } from '../test-util/mock-http.js';
import { AiDeployment } from '../core/aicore.js';
import { EndpointOptions } from '../core/http-client.js';
import {
  constructCompletionPostRequest,
  OrchestrationService
} from './orchestration-client.js';
import { CompletionPostResponse } from './api/index.js';
import { OrchestrationCompletionParameters } from './orchestration-types.js';

describe('OrchestrationService', () => {
  let destination: HttpDestination;
  let client: OrchestrationService;
  let mockDeployment: AiDeployment;
  let mockEndpoint: EndpointOptions;

  beforeAll(() => {
    destination = mockGetAiCoreDestination();
    client = new OrchestrationService();
    mockDeployment = { id: 'mock', scenarioId: 'orchestration' };
    mockEndpoint = { deploymentId: mockDeployment.id, path: '/completion' };
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('calls chatCompletion with minimum configuration and parses response', async () => {
    const input: OrchestrationCompletionParameters = {
      llmConfig: {
        model_name: 'gpt-35-turbo-16k',
        model_params: { max_tokens: 50, temperature: 0.1 }
      },
      prompt: {
        template: [{ role: 'user', content: 'Hello!' }]
      }
    };
    const request = constructCompletionPostRequest(input);

    const mockResponse = parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'genaihub-chat-completion-success-response.json'
    );

    mockInference({
      request:{
        data: request,
        destination,
        endpoint: mockEndpoint
      },
      response: {
        status: 200,
        data: mockResponse
      } }
    );
    expect(client.chatCompletion(input, mockDeployment)).resolves.toEqual(mockResponse);
  });

  it('sends message history together with templating config', async () => {
    const request: OrchestrationCompletionParameters = {
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

    mockInference({
      request:{
        data: mockResponse,
        destination,
        endpoint: mockEndpoint
      },
      response: {
        status: 200,
        data: mockResponse
      } }
    );

    expect(client.chatCompletion(request, mockDeployment)).resolves.toEqual(mockResponse);
  });
});
