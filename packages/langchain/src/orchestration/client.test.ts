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
import { addNumbersTool } from '../../../../test-util/tools.js';
import { OrchestrationClient } from './client.js';
import type { LangChainOrchestrationModuleConfig } from './types.js';
import type { ToolCall } from '@langchain/core/messages/tool';
import type { AIMessageChunk } from '@langchain/core/messages';
import type {
  ChatMessages,
  CompletionPostResponse,
  ErrorResponse
} from '@sap-ai-sdk/orchestration';

jest.setTimeout(30000);

describe('orchestration service client', () => {
  let mockResponse: CompletionPostResponse;
  let mockResponseInputFilterError: ErrorResponse;
  let mockResponseStream: string;
  let mockResponseStreamToolCalls: string;
  const messages: ChatMessages = [{ role: 'user', content: 'Hello!' }];
  const config: LangChainOrchestrationModuleConfig = {
    llm: {
      model_name: 'gpt-4o',
      model_params: {}
    }
  };
  const endpoint = {
    url: 'inference/deployments/1234/completion'
  };

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
      'orchestration-chat-completion-stream-multiple-tools-chunks.txt'
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
        data: constructCompletionPostRequest(
          {
            ...config,
            templating: {
              template: messages
            }
          },
          { messages: [] },
          isStream
        )
      },
      {
        data: response,
        status
      },
      endpoint,
      resilience
    );
  }

  describe('resilience', () => {
    it('returns successful response when maxRetries equals retry configuration', async () => {
      mockInferenceWithResilience(mockResponse, { retry: 2 });
      const client = new OrchestrationClient(config, {
        maxRetries: 2
      });
      expect(await client.invoke(messages)).toMatchSnapshot();
    });

    it('throws error response when maxRetries is smaller than required retries', async () => {
      mockInferenceWithResilience(mockResponse, { retry: 2 });
      const client = new OrchestrationClient(config, {
        maxRetries: 1
      });
      await expect(client.invoke(messages)).rejects.toThrow(
        'Request failed with status code 500'
      );
    });

    it('throws when delay exceeds timeout', async () => {
      mockInferenceWithResilience(mockResponse, { delay: 2000 });
      const client = new OrchestrationClient(config);
      const response = client.invoke(messages, { timeout: 1000 });
      await expect(response).rejects.toThrow(
        expect.objectContaining({
          stack: expect.stringMatching(/Timeout/)
        })
      );
    });

    it('returns successful response when timeout is bigger than delay', async () => {
      mockInferenceWithResilience(mockResponse, { delay: 2000 });
      const client = new OrchestrationClient(config);
      const response = await client.invoke(messages, { timeout: 3000 });
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
      await expect(client.invoke(messages)).rejects.toThrow(
        'Request failed with status code 400'
      );
    }, 1000);
  });

  describe('bindTools', () => {
    let client: OrchestrationClient;
    const toolResponse = {
      data: {
        orchestration_result: {
          choices: [
            {
              message: {
                role: 'assistant',
                content: null,
                tool_calls: [
                  {
                    id: '1',
                    type: 'function',
                    function: {
                      name: 'add',
                      arguments: '{ "a": 1, "b": 2 }'
                    }
                  }
                ]
              },
              index: 0
            }
          ]
        }
      }
    };

    beforeEach(() => {
      client = new OrchestrationClient(config, { maxRetries: 0 });
    });

    it('should bind a tool with strict set to true if defined in kwargs', async () => {
      mockInference(
        {
          data: {
            orchestration_config: {
              module_configurations: {
                templating_module_config: {
                  tools: [
                    {
                      type: 'function',
                      function: {
                        ...addNumbersTool.function,
                        strict: true // Will be tested
                      }
                    }
                  ],
                  template: [{ role: 'user', content: 'What is 1 + 2?' }]
                },
                llm_module_config: {
                  model_name: 'gpt-4o',
                  model_params: {}
                }
              }
            }
          }
        },
        toolResponse,
        endpoint
      );
      await client
        .bindTools([addNumbersTool], { strict: true })
        .invoke('What is 1 + 2?');
    });

    it('should bind a tool with strict set to false if defined in kwargs', async () => {
      mockInference(
        {
          data: {
            orchestration_config: {
              module_configurations: {
                templating_module_config: {
                  tools: [
                    {
                      type: 'function',
                      function: {
                        ...addNumbersTool.function,
                        strict: false // Will be tested
                      }
                    }
                  ],
                  template: [{ role: 'user', content: 'What is 1 + 2?' }]
                },
                llm_module_config: {
                  model_name: 'gpt-4o',
                  model_params: {}
                }
              }
            }
          }
        },
        toolResponse,
        endpoint
      );
      await client
        .bindTools([addNumbersTool], { strict: false })
        .invoke('What is 1 + 2?');
    });

    it('should bind a tool with undefined strict if not defined in kwargs', async () => {
      mockInference(
        {
          data: {
            orchestration_config: {
              module_configurations: {
                templating_module_config: {
                  tools: [
                    {
                      type: 'function',
                      function: {
                        ...addNumbersTool.function,
                        strict: undefined // Will be tested
                      }
                    }
                  ],
                  template: [{ role: 'user', content: 'What is 1 + 2?' }]
                },
                llm_module_config: {
                  model_name: 'gpt-4o',
                  model_params: {}
                }
              }
            }
          }
        },
        toolResponse,
        endpoint
      );
      await client.bindTools([addNumbersTool]).invoke('What is 1 + 2?');
    });
  });

  describe('streaming', () => {
    it('supports streaming responses', async () => {
      mockInference(
        {
          data: constructCompletionPostRequest(config, { messages: [] }, true)
        },
        {
          data: mockResponseStream,
          status: 200
        },
        {
          url: 'inference/deployments/1234/completion'
        }
      );

      const client = new OrchestrationClient(config);
      const stream = await client.stream([]);
      let finalOutput: AIMessageChunk | undefined;

      for await (const chunk of stream) {
        finalOutput = finalOutput ? finalOutput.concat(chunk) : chunk;
      }
      expect(finalOutput).toMatchSnapshot();
    });

    it('throws when delay exceeds timeout during streaming', async () => {
      mockInferenceWithResilience(
        mockResponseStream,
        { delay: 2000 },
        200,
        true
      );

      let finalOutput: AIMessageChunk | undefined;
      const client = new OrchestrationClient(config);
      try {
        const stream = await client.stream([], { timeout: 1000 });
        for await (const chunk of stream) {
          finalOutput = finalOutput ? finalOutput.concat(chunk) : chunk;
        }
      } catch (e) {
        expect(e).toEqual(
          expect.objectContaining({
            stack: expect.stringMatching(/Timeout/)
          })
        );
      }
    });
    it('streams and aborts with a signal', async () => {
      mockInference(
        {
          data: constructCompletionPostRequest(config, { messages: [] }, true)
        },
        {
          data: mockResponseStream,
          status: 200
        },
        {
          url: 'inference/deployments/1234/completion'
        }
      );
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
      mockInference(
        {
          data: constructCompletionPostRequest(config, { messages: [] }, true)
        },
        {
          data: mockResponseStream,
          status: 200
        },
        {
          url: 'inference/deployments/1234/completion'
        }
      );
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
      mockInference(
        {
          data: constructCompletionPostRequest(config, { messages: [] }, true)
        },
        {
          data: mockResponseStreamToolCalls,
          status: 200
        },
        {
          url: 'inference/deployments/1234/completion'
        }
      );

      const client = new OrchestrationClient(config);
      const stream = await client.stream([]);

      let finalOutput: AIMessageChunk | undefined;
      for await (const chunk of stream) {
        finalOutput = finalOutput ? finalOutput.concat(chunk) : chunk;
      }
      const completeToolCall: ToolCall = finalOutput!.tool_calls![0];
      expect(completeToolCall.name).toEqual('add');
      expect(completeToolCall.args).toEqual({
        a: 2,
        b: 3
      });
      expect(finalOutput).toMatchSnapshot();
    });
  });
});
