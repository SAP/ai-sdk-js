import nock from 'nock';
import { constructCompletionPostRequest } from '@sap-ai-sdk/orchestration/internal.js';
import {
  mockClientCredentialsGrantCall,
  mockDeploymentsList,
  mockInference,
  parseMockResponse
} from '../../../../test-util/mock-http.js';
import { OrchestrationClient } from './client.js';
import type {
  CompletionPostResponse,
  OrchestrationModuleConfig
} from '@sap-ai-sdk/orchestration';

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

    const mockResponse = await parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'orchestration-chat-completion-success-response.json'
    );

    mockInference(
      {
        data: constructCompletionPostRequest(config, { messagesHistory: [] })
      },
      {
        data: mockResponse,
        status: 200
      },
      {
        url: 'inference/deployments/1234/completion'
      },
      { retry: 3 }
    );
    const response = await new OrchestrationClient(config, {
      maxRetries: 5
    }).invoke([], { timeout: 1 });

    // expect(nock.isDone()).toBe(true);
    expect(response).toMatchInlineSnapshot(`
     {
       "id": [
         "langchain_core",
         "messages",
         "OrchestrationMessage",
       ],
       "kwargs": {
         "additional_kwargs": {
           "finish_reason": "stop",
           "function_call": undefined,
           "index": 0,
           "tool_calls": undefined,
         },
         "content": "Hello! How can I assist you today?",
         "invalid_tool_calls": [],
         "response_metadata": {
           "created": 172,
           "finish_reason": "stop",
           "function_call": undefined,
           "id": "orchestration-id",
           "index": 0,
           "model": "gpt-35-turbo",
           "object": "chat.completion",
           "system_fingerprint": undefined,
           "tokenUsage": {
             "completionTokens": 9,
             "promptTokens": 9,
             "totalTokens": 18,
           },
           "tool_calls": undefined,
         },
         "tool_calls": [],
       },
       "lc": 1,
       "type": "constructor",
     }
    `);
  });
});
