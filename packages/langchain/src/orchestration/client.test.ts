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
import type { ToolCall } from '@langchain/core/messages/tool';
import type { AIMessageChunk } from '@langchain/core/messages';
import type { LangchainOrchestrationModuleConfig } from './types.js';
import type {
  CompletionPostResponse,
  ErrorResponse
} from '@sap-ai-sdk/orchestration';

jest.setTimeout(30000);

describe('orchestration service client', () => {
  let mockResponse: CompletionPostResponse;
  let mockResponseInputFilterError: ErrorResponse;
  let mockResponseStream: string;
  let mockResponseStreamToolCalls: string;
  beforeAll(async () => {
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
    mockResponseStream = await parseFileToString(
      'orchestration',
      'orchestration-chat-completion-stream-chunks.txt'
    );
    mockResponseStreamToolCalls = await parseFileToString(
      'orchestration',
      'orchestration-chat-completion-stream-chunks-tool-calls.txt'
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
    status: number = 200,
    isStream?: boolean
  ) {
    mockInference(
      {
        data: constructCompletionPostRequest(config, { messages: [] }, isStream)
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

  function mockStreamInferenceWithResilience(
    response: any = mockResponseStream,
    resilience: {
      retry?: number;
      delay?: number;
    } = { retry: 0 },
    status: number = 200
  ) {
    mockInferenceWithResilience(response, resilience, status, true);
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
    mockStreamInferenceWithResilience();

    const client = new OrchestrationClient(config);
    const stream = await client.stream([]);
    let finalOutput: AIMessageChunk | undefined;

    for await (const chunk of stream) {
      finalOutput = finalOutput ? finalOutput.concat(chunk) : chunk;
    }
    expect(finalOutput).toMatchSnapshot();
  });

  it('streams and aborts with a signal', async () => {
    mockStreamInferenceWithResilience();
    const client = new OrchestrationClient(config);
    const controller = new AbortController();
    const { signal } = controller;
    const stream = await client.stream([], { signal });
    const streamFunction = async () => {
      for await (const _chunk of stream) {
        controller.abort();
      }
    };

    await expect(streamFunction()).rejects.toThrow('Aborted');
  }, 1000);

  it('streams with a callback', async () => {
    mockStreamInferenceWithResilience();
    let tokenCount = 0;
    const callbackHandler = {
      handleLLMNewToken: jest.fn().mockImplementation(() => {
        tokenCount += 1;
      })
    };
    const client = new OrchestrationClient(config, {
      callbacks: [callbackHandler]
    });
    const stream = await client.stream([]);
    const chunks: AIMessageChunk[] = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
      break;
    }
    expect(callbackHandler.handleLLMNewToken).toHaveBeenCalled();
    const firstCallArgs = callbackHandler.handleLLMNewToken.mock.calls[0];
    // First chunk content is empty
    expect(firstCallArgs[0]).toEqual('');
    // Second argument should be the token indices
    expect(firstCallArgs[1]).toEqual({ prompt: 0, completion: 0 });
    expect(tokenCount).toBeGreaterThan(0);
  });

  it('supports streaming responses with tool calls', async () => {
    mockStreamInferenceWithResilience(mockResponseStreamToolCalls);

    const client = new OrchestrationClient(config);
    const stream = await client.stream([]);

    let finalOutput: AIMessageChunk | undefined;
    for await (const chunk of stream) {
      finalOutput = finalOutput ? finalOutput.concat(chunk) : chunk;
    }
    const completeToolCall: ToolCall = finalOutput!.tool_calls![0];
    expect(completeToolCall.name).toEqual('convert_temperature_to_fahrenheit');
    expect(completeToolCall.args).toEqual({ temperature: 20 });
    expect(finalOutput).toMatchSnapshot();
  });
});
