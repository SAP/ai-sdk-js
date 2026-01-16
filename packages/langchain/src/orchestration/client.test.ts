import { constructCompletionPostRequest } from '@sap-ai-sdk/orchestration/internal.js';
import { jest } from '@jest/globals';
import nock from 'nock';
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph
} from '@langchain/langgraph';
import { type AIMessageChunk } from '@langchain/core/messages';
import { z } from 'zod';
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
import type { OrchestrationErrorResponse } from '@sap-ai-sdk/orchestration';
import type { CompletionPostResponse } from '@sap-ai-sdk/orchestration/internal.js';

jest.setTimeout(30000);

describe('orchestration service client', () => {
  let mockResponse: CompletionPostResponse;
  let mockResponseInputFilterError: OrchestrationErrorResponse;
  let mockResponseStream: string;
  let mockResponseStreamToolCalls: string;
  const messages = [{ role: 'user' as const, content: 'Hello!' }];
  const config: LangChainOrchestrationModuleConfig = {
    promptTemplating: {
      model: {
        name: 'gpt-4o',
        params: {}
      }
    }
  };
  const endpoint = {
    url: 'inference/deployments/1234/v2/completion'
  };

  beforeAll(async () => {
    mockClientCredentialsGrantCall();
    mockDeploymentsList({ scenarioId: 'orchestration' }, { id: '1234' });
    mockResponse = await parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'orchestration-chat-completion-success-response.json'
    );
    mockResponseInputFilterError =
      await parseMockResponse<OrchestrationErrorResponse>(
        'orchestration',
        'orchestration-chat-completion-input-filter-error.json'
      );
    mockResponseStream = await parseFileToString(
      'orchestration',
      'orchestration-chat-completion-stream-chunks.txt'
    );
    mockResponseStreamToolCalls = await parseFileToString(
      'orchestration',
      'orchestration-chat-completion-stream-tools-chunks.txt'
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
            promptTemplating: {
              ...config.promptTemplating,
              prompt: {
                template: messages
              }
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
      const client = new OrchestrationClient(config, { maxRetries: 0 });
      const response = client.invoke(messages, { timeout: 1000 });
      await expect(response).rejects.toThrow(
        expect.objectContaining({
          stack: expect.stringMatching(/Timeout/)
        })
      );
    });

    it('retries when delay exceeds timeout', async () => {
      mockInferenceWithResilience(mockResponse, { delay: 2000 });
      const onFailedAttempt = jest.fn();
      const client = new OrchestrationClient(config, {
        maxRetries: 1,
        onFailedAttempt
      });
      const response = client.invoke(messages, { timeout: 1000 });
      await expect(response).rejects.toThrow(
        expect.objectContaining({
          stack: expect.stringMatching(/Timeout/)
        })
      );
      expect(onFailedAttempt).toHaveBeenCalledTimes(1);
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

    it('throws when delay exceeds timeout during streaming', async () => {
      mockInferenceWithResilience(
        mockResponseStream,
        { delay: 2000 },
        200,
        true
      );

      let finalOutput: AIMessageChunk | undefined;
      const client = new OrchestrationClient(config, { maxRetries: 0 });
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

    it('throws when delay exceeds timeout using streaming', async () => {
      mockInferenceWithResilience(
        mockResponseStream,
        { delay: 2000 },
        200,
        true
      );
      const client = new OrchestrationClient(config, { maxRetries: 0 });
      await expect(client.stream('Hello!', { timeout: 1000 })).rejects.toThrow(
        'Aborted'
      );
    });
  });

  describe('bindTools', () => {
    let client: OrchestrationClient;
    const toolResponse = {
      data: {
        final_result: {
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
            config: {
              modules: {
                prompt_templating: {
                  model: {
                    name: 'gpt-4o',
                    params: {}
                  },
                  prompt: {
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
                  }
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
            config: {
              modules: {
                prompt_templating: {
                  model: {
                    name: 'gpt-4o',
                    params: {}
                  },
                  prompt: {
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
                  }
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
            config: {
              modules: {
                prompt_templating: {
                  model: {
                    name: 'gpt-4o',
                    params: {}
                  },
                  prompt: {
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
                  }
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
          data: constructCompletionPostRequest(
            {
              ...config,
              promptTemplating: {
                ...config.promptTemplating,
                prompt: {
                  template: messages
                }
              }
            },
            { messages: [] },
            true
          )
        },
        {
          data: mockResponseStream,
          status: 200
        },
        endpoint
      );

      const client = new OrchestrationClient(config);
      const stream = await client.stream('Hello!');
      let finalOutput: AIMessageChunk | undefined;

      for await (const chunk of stream) {
        finalOutput = finalOutput ? finalOutput.concat(chunk) : chunk;
      }
      expect(finalOutput).toMatchSnapshot();
    });

    it('supports auto-streaming responses', async () => {
      mockInference(
        {
          data: constructCompletionPostRequest(
            {
              ...config,
              promptTemplating: {
                ...config.promptTemplating,
                prompt: {
                  template: messages
                }
              }
            },
            { messages: [] },
            true
          )
        },
        {
          data: mockResponseStream,
          status: 200
        },
        endpoint
      );

      jest.spyOn(OrchestrationClient.prototype, '_streamResponseChunks');

      const client = new OrchestrationClient(config, {
        streaming: true
      });
      expect(client.streaming).toBe(true);

      const finalOutput = await client.invoke([
        { role: 'user', content: 'Hello!' }
      ]);

      expect(finalOutput).toMatchSnapshot();
      expect(client._streamResponseChunks).toHaveBeenCalled();
    });

    it('has langchain handle disabling streaming via disableStreaming flag in stream', async () => {
      mockInference(
        {
          data: constructCompletionPostRequest(
            {
              ...config,
              promptTemplating: {
                ...config.promptTemplating,
                prompt: {
                  template: messages
                }
              }
            },
            { messages: [] },
            false
          )
        },
        {
          data: mockResponse,
          status: 200
        },
        endpoint
      );

      jest.spyOn(OrchestrationClient.prototype, '_streamResponseChunks');

      const client = new OrchestrationClient(config, {
        streaming: true,
        disableStreaming: true
      });
      expect(client.streaming).toBe(false);
      expect(client.disableStreaming).toBe(true);

      const stream = await client.stream('Hello!');
      // Non-streaming response, so only one chunk expected
      const firstChunk = await stream.next();
      expect(firstChunk.value).toBeDefined();
      expect(firstChunk.done).toBe(false);
      // Verify that no further chunks are present
      const trailingChunk = await stream.next();
      expect(trailingChunk.done).toBe(true);
      expect(client._streamResponseChunks).not.toHaveBeenCalled();
    });

    it('should handle streaming and disabling streaming flags as expected', async () => {
      let testClient = new OrchestrationClient(config, {
        streaming: true,
        disableStreaming: true
      });

      // streaming should be disabled due to disableStreaming being true
      expect(testClient.streaming).toBe(false);
      expect(testClient.disableStreaming).toBe(true);

      testClient = new OrchestrationClient(config, {
        streaming: false
      });

      // streaming should be disabled
      expect(testClient.streaming).toBe(false);
      expect(testClient.disableStreaming).toBe(true);

      testClient = new OrchestrationClient(config, {
        streaming: true
      });

      // auto-streaming should be enabled
      expect(testClient.streaming).toBe(true);
      expect(testClient.disableStreaming).toBe(false);

      testClient = new OrchestrationClient(config);
      // auto-streaming and disableStreaming should be disabled by default
      expect(testClient.streaming).toBe(false);
      expect(testClient.disableStreaming).toBe(false);
    });

    it('streams and aborts with a signal', async () => {
      mockInference(
        {
          data: constructCompletionPostRequest(
            {
              ...config,
              promptTemplating: {
                ...config.promptTemplating,
                prompt: {
                  template: messages
                }
              }
            },
            { messages: [] },
            true
          )
        },
        {
          data: mockResponseStream,
          status: 200
        },
        endpoint
      );
      const client = new OrchestrationClient(config);
      const controller = new AbortController();
      const { signal } = controller;
      const stream = await client.stream('Hello!', { signal });
      const streamFunction = async () => {
        for await (const _ of stream) {
          controller.abort();
        }
      };

      await expect(streamFunction()).rejects.toThrow('Aborted');
    }, 1000);

    it('streams with a callback', async () => {
      mockInference(
        {
          data: constructCompletionPostRequest(
            {
              ...config,
              promptTemplating: {
                ...config.promptTemplating,
                prompt: {
                  template: messages
                }
              }
            },
            { messages: [] },
            true
          )
        },
        {
          data: mockResponseStream,
          status: 200
        },
        endpoint
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
      const stream = await client.stream('Hello!');
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
          data: constructCompletionPostRequest(
            {
              ...config,
              promptTemplating: {
                ...config.promptTemplating,
                prompt: {
                  template: messages
                }
              }
            },
            { messages: [] },
            true
          )
        },
        {
          data: mockResponseStreamToolCalls,
          status: 200
        },
        endpoint
      );

      const client = new OrchestrationClient(config);
      const stream = await client.stream('Hello!');

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

  it('streams when invoked in a streaming langgraph', async () => {
    mockInference(
      {
        data: constructCompletionPostRequest(
          {
            ...config,
            promptTemplating: {
              ...config.promptTemplating,
              prompt: {
                template: messages
              }
            }
          },
          { messages: [] },
          true
        )
      },
      {
        data: mockResponseStream,
        status: 200
      },
      endpoint
    );
    jest.spyOn(OrchestrationClient.prototype, '_streamResponseChunks');

    const llm = new OrchestrationClient(config);

    // Define the function that calls the model
    const callModel = async (state: typeof MessagesAnnotation.State) => {
      const response = await llm.invoke(state.messages);
      // Update message history with response:
      return { messages: response };
    };

    // Define a new graph
    const workflow = new StateGraph(MessagesAnnotation)
      // Define the (single) node in the graph
      .addNode('model', callModel)
      .addEdge(START, 'model')
      .addEdge('model', END);

    const app = workflow.compile();
    const stream = await app.stream(
      {
        messages
      },
      // langgraph will only enable streaming in a more granular streaming mode than the default (values)
      // messages: Streams 2-tuples (LLM token, metadata) from any graph nodes where an LLM is invoked.
      // Stream modes: https://docs.langchain.com/oss/javascript/langgraph/streaming#supported-stream-modes
      { streamMode: 'messages' as const }
    );

    for await (const _ of stream) {
      // Empty
    }

    expect(llm._streamResponseChunks).toHaveBeenCalled();
  });

  describe('withStructuredOutput', () => {
    const jokeSchema = z.object({
      setup: z.string().describe('The setup of the joke'),
      punchline: z.string().describe('The punchline of the joke')
    });

    const translationSchema = z.object({
      language: z.string().describe('Target language'),
      translation: z.string().describe('Translated text')
    });

    it('should create response_format config with jsonSchema by default', () => {
      const llm = new OrchestrationClient(config);
      const spy = jest.spyOn(llm, 'withConfig');

      llm.withStructuredOutput(jokeSchema, { name: 'joke', strict: true });

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          responseFormat: {
            type: 'json_schema',
            json_schema: {
              name: 'joke',
              description: undefined,
              schema: expect.objectContaining({
                type: 'object',
                properties: expect.objectContaining({
                  setup: expect.any(Object),
                  punchline: expect.any(Object)
                })
              }),
              strict: true
            }
          }
        })
      );
    });

    it('should work with plain JSON schema', () => {
      const llm = new OrchestrationClient(config);
      const spy = jest.spyOn(llm, 'withConfig');

      const plainSchema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number' }
        },
        required: ['name', 'age']
      };

      llm.withStructuredOutput(plainSchema, { name: 'person' });

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          responseFormat: {
            type: 'json_schema',
            json_schema: {
              name: 'person',
              description: undefined,
              schema: plainSchema
            }
          }
        })
      );
    });

    it('should use default name "extract" when not provided', () => {
      const llm = new OrchestrationClient(config);
      const spy = jest.spyOn(llm, 'withConfig');

      llm.withStructuredOutput(jokeSchema);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          responseFormat: expect.objectContaining({
            json_schema: expect.objectContaining({
              name: 'extract'
            })
          })
        })
      );
    });

    it('should throw error when using withStructuredOutput with TemplateRef', async () => {
      const configWithRef: LangChainOrchestrationModuleConfig = {
        promptTemplating: {
          model: {
            name: 'gpt-4o',
            params: {}
          },
          prompt: {
            template_ref: {
              name: 'my-template',
              version: '1',
              scenario: 'translation'
            }
          }
        }
      };

      const llm = new OrchestrationClient(configWithRef);
      const structured = llm.withStructuredOutput(translationSchema);

      // The error should be thrown during invoke when mergeOrchestrationConfig is called
      await expect(structured.invoke('Test message')).rejects.toThrow(
        'Cannot use withStructuredOutput with TemplateRef'
      );
    });

    it('should parse structured output correctly', async () => {
      const mockStructuredResponse: CompletionPostResponse = {
        ...mockResponse,
        final_result: {
          ...mockResponse.final_result,
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content:
                  '{"setup":"Why did the chicken cross the road?","punchline":"To get to the other side!"}'
              },
              finish_reason: 'stop'
            }
          ]
        }
      };

      mockInference(
        () => ({
          orchestrationConfig: expect.anything(),
          params: expect.anything()
        }),
        { data: mockStructuredResponse, status: 200 },
        endpoint
      );

      const llm = new OrchestrationClient(config);
      const structured = llm.withStructuredOutput(jokeSchema);
      const result = await structured.invoke('Tell me a joke');

      expect(result).toEqual({
        setup: 'Why did the chicken cross the road?',
        punchline: 'To get to the other side!'
      });
    });

    it('should handle includeRaw option', async () => {
      const mockStructuredResponse: CompletionPostResponse = {
        ...mockResponse,
        final_result: {
          ...mockResponse.final_result,
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: '{"language":"German","translation":"Apfel"}'
              },
              finish_reason: 'stop'
            }
          ]
        }
      };

      mockInference(
        () => ({
          orchestrationConfig: expect.anything(),
          params: expect.anything()
        }),
        { data: mockStructuredResponse, status: 200 },
        endpoint
      );

      const llm = new OrchestrationClient(config);
      const structured = llm.withStructuredOutput(translationSchema, {
        includeRaw: true
      });
      const result = await structured.invoke("What's 'Apple' in German?");

      expect(result).toHaveProperty('raw');
      expect(result).toHaveProperty('parsed');
      expect(result.parsed).toEqual({
        language: 'German',
        translation: 'Apfel'
      });
    });

    it('should merge response_format with existing config', async () => {
      const configWithTemplate: LangChainOrchestrationModuleConfig = {
        promptTemplating: {
          model: {
            name: 'gpt-4o',
            params: {}
          },
          prompt: {
            template: messages
          }
        }
      };

      const llm = new OrchestrationClient(configWithTemplate);

      const mockStructuredResponse: CompletionPostResponse = {
        ...mockResponse,
        final_result: {
          ...mockResponse.final_result,
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: '{"language":"German","translation":"Apfel"}'
              },
              finish_reason: 'stop'
            }
          ]
        }
      };

      mockInference(
        req => {
          const parsedReq = JSON.parse(req.body as string);
          expect(
            parsedReq.orchestration_config.templating_module_config.prompt
              .response_format
          ).toBeDefined();
          expect(
            parsedReq.orchestration_config.templating_module_config.prompt
              .response_format.type
          ).toBe('json_schema');
          return true;
        },
        { data: mockStructuredResponse, status: 200 },
        endpoint
      );

      const structured = llm.withStructuredOutput(translationSchema, {
        strict: true
      });
      await structured.invoke("What's 'Apple' in German?");
    });

    it('should use `jsonMode` method if specified', async () => {
      const llm = new OrchestrationClient(config);
      const spy = jest.spyOn(llm, 'withConfig');

      llm.withStructuredOutput(jokeSchema, { method: 'jsonMode' });

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          responseFormat: {
            type: 'json_object'
          }
        })
      );
    });

    it('should throw error if strict is used with `jsonMode`', () => {
      const llm = new OrchestrationClient(config);

      expect(() => {
        llm.withStructuredOutput(jokeSchema, {
          name: 'joke',
          strict: true,
          method: 'jsonMode'
        });
      }).toThrow(
        'The "strict" option is not supported with the "jsonMode" structured output method'
      );
    });

    it('should use `functionCalling` method if specified', async () => {
      const llm = new OrchestrationClient(config);
      const spy = jest.spyOn(llm, 'withConfig');

      llm.withStructuredOutput(jokeSchema, { method: 'functionCalling' });

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          tools: [
            {
              type: 'function' as const,
              function: {
                name: 'extract',
                description: undefined,
                parameters: expect.objectContaining({
                  type: 'object',
                  properties: expect.objectContaining({
                    setup: expect.any(Object),
                    punchline: expect.any(Object)
                  })
                })
              }
            }
          ]
        })
      );
    });

    it('should use `functionCalling` with plain JSON schema', async () => {
      const llm = new OrchestrationClient(config);
      const spy = jest.spyOn(llm, 'withConfig');

      const plainJsonSchema = {
        name: 'joke',
        description: 'Joke to tell user.',
        parameters: {
          type: 'object' as const,
          properties: {
            setup: {
              type: 'string' as const,
              description: 'The setup for the joke'
            },
            punchline: {
              type: 'string' as const,
              description: "The joke's punchline"
            }
          },
          required: ['setup', 'punchline']
        }
      };

      llm.withStructuredOutput(plainJsonSchema.parameters, {
        name: plainJsonSchema.name,
        method: 'functionCalling'
      });

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          tools: [
            {
              type: 'function' as const,
              function: expect.objectContaining({
                name: 'joke',
                parameters: plainJsonSchema.parameters
              })
            }
          ]
        })
      );
    });
  });
});
