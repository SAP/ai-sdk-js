import { constructCompletionPostRequest } from '@sap-ai-sdk/orchestration/internal.js';
import { jest } from '@jest/globals';
import nock from 'nock';
import {
  mockClientCredentialsGrantCall,
  mockDeploymentsList,
  mockInference,
  parseMockResponse,
  parseFileToString
} from '../../../../test-util/mock-http.js';
import { OrchestrationClient } from './client.js';
import type { LangchainOrchestrationModuleConfig } from './types.js';
import type {
  CompletionPostResponse,
  ErrorResponse
} from '@sap-ai-sdk/orchestration';
import type { AIMessageChunk } from '@langchain/core/messages';

jest.setTimeout(30000);

describe('orchestration service client', () => {
  let mockResponse: CompletionPostResponse;
  let mockResponseInputFilterError: ErrorResponse;
  beforeEach(async () => {
    mockClientCredentialsGrantCall();
    mockDeploymentsList({ scenarioId: 'orchestration' }, { id: '1234' });
    mockResponse = await parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'orchestration-chat-completion-success-response.json'
    );
    mockResponseInputFilterError = await parseMockResponse<ErrorResponse>(
      'orchestration',
      'orchestration-chat-completion-input-filter-error.json'
    );
  });

  afterEach(() => {
    nock.cleanAll();
  });

  function mockInferenceWithResilience(
    response: any,
    resilience: {
      retry?: number;
      delay?: number;
    },
    status: number = 200
  ) {
    mockInference(
      {
        data: constructCompletionPostRequest(config, { messagesHistory: [] })
      },
      {
        data: response,
        status
      },
      {
        url: 'inference/deployments/1234/completion'
      },
      resilience
    );
  }

  const config: LangchainOrchestrationModuleConfig = {
    llm: {
      model_name: 'gpt-4o',
      model_params: { max_tokens: 50, temperature: 0.1 }
    },
    templating: {
      template: [{ role: 'user', content: 'Hello!' }]
    }
  };

  it('returns successful response when maxRetries equals retry configuration', async () => {
    mockInferenceWithResilience(mockResponse, { retry: 2 });

    const client = new OrchestrationClient(config, {
      maxRetries: 2
    });

    expect(await client.invoke([])).toMatchSnapshot();
  });

  it('throws error response when maxRetries is smaller than required retries', async () => {
    mockInferenceWithResilience(mockResponse, { retry: 2 });

    const client = new OrchestrationClient(config, {
      maxRetries: 1
    });

    await expect(client.invoke([])).rejects.toThrow(
      'Request failed with status code 500'
    );
  });

  it('throws when delay exceeds timeout', async () => {
    mockInferenceWithResilience(mockResponse, { delay: 2000 });

    const client = new OrchestrationClient(config);

    const response = client.invoke([], { timeout: 1000 });

    await expect(response).rejects.toThrow(
      expect.objectContaining({
        stack: expect.stringMatching(/Timeout/)
      })
    );
  });

  it('returns successful response when timeout is bigger than delay', async () => {
    mockInferenceWithResilience(mockResponse, { delay: 2000 });

    const client = new OrchestrationClient(config);

    const response = await client.invoke([], { timeout: 3000 });
    expect(response).toMatchSnapshot();
  });

  it('throws immediately when input filter error occurs', async () => {
    mockInferenceWithResilience(
      mockResponseInputFilterError,
      { retry: 0 },
      400
    );

    const client = new OrchestrationClient(config, {
      maxRetries: 1000 // Retry forever unless input filter error
    });

    await expect(client.invoke([])).rejects.toThrow(
      'Request failed with status code 400'
    );
  }, 1000);

  it('supports streaming responses', async () => {
    // Load the mock streaming response
    const streamMockResponse = await parseFileToString(
      'orchestration',
      'orchestration-chat-completion-stream-chunks.txt'
    );

    // Mock the streaming API call
    mockInference(
      {
        data: constructCompletionPostRequest(
          config,
          { messagesHistory: [] },
          true
        )
      },
      {
        data: streamMockResponse,
        status: 200
      },
      {
        url: 'inference/deployments/1234/completion'
      }
    );

    const client = new OrchestrationClient(config);

    // Test the stream method
    const stream = await client.stream([]);

    // Collect all chunks
    const chunks: AIMessageChunk[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    // Verify we received chunks
    expect(chunks.length).toBeGreaterThan(0);

    // Verify the chunks are of the expected type
    expect(chunks[0]).toBeDefined();
    expect(chunks[0].content).toBeDefined();
  });
});
