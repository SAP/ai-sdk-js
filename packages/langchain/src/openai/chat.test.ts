import nock from 'nock';
import { apiVersion } from '@sap-ai-sdk/foundation-models/internal.js';
import { toJsonSchema } from '@langchain/core/utils/json_schema';
import { getSchemaDescription } from '@langchain/core/utils/types';
import { jest } from '@jest/globals';
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph
} from '@langchain/langgraph';
import { addNumbersTool, joke } from '../../../../test-util/tools.js';
import {
  mockClientCredentialsGrantCall,
  mockDeploymentsList,
  mockInference,
  parseFileToString
} from '../../../../test-util/mock-http.js';
import { AzureOpenAiChatClient } from './chat.js';
import type { AzureOpenAiFunctionObject } from '@sap-ai-sdk/foundation-models/internal.js';
import type { AIMessageChunk } from '@langchain/core/messages';
describe('Chat client', () => {
  let client: AzureOpenAiChatClient;
  let mockResponseStream: string;
  let mockResponseStreamToolCalls: string;
  const endpoint = {
    url: 'inference/deployments/1234/chat/completions',
    apiVersion
  };

  beforeEach(async () => {
    client = new AzureOpenAiChatClient({ modelName: 'gpt-4o' });
    mockClientCredentialsGrantCall();
    mockDeploymentsList(
      {
        scenarioId: 'foundation-models',
        resourceGroup: 'default',
        executableId: 'azure-openai'
      },
      { id: '1234', model: { name: 'gpt-4o', version: 'latest' } }
    );
    mockResponseStream = await parseFileToString(
      'foundation-models',
      'azure-openai-chat-completion-stream-chunks.txt'
    );
    mockResponseStreamToolCalls = await parseFileToString(
      'foundation-models',
      'azure-openai-chat-completion-stream-tools-chunks.txt'
    );
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('bindTools', () => {
    const toolResponse = {
      data: {
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
    };

    it('should bind a tool with strict set to true if defined in kwargs', async () => {
      mockInference(
        {
          data: {
            messages: [
              {
                role: 'user' as const,
                content: 'What is 1 + 2?'
              }
            ],
            tools: [
              {
                type: 'function',
                function: {
                  ...addNumbersTool.function,
                  strict: true // Will be tested
                }
              }
            ]
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
            messages: [
              {
                role: 'user' as const,
                content: 'What is 1 + 2?'
              }
            ],
            tools: [
              {
                type: 'function',
                function: {
                  ...addNumbersTool.function,
                  strict: false // Will be tested
                }
              }
            ]
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
            messages: [
              {
                role: 'user' as const,
                content: 'What is 1 + 2?'
              }
            ],
            tools: [
              {
                type: 'function',
                function: {
                  ...addNumbersTool.function,
                  strict: undefined // Will be tested
                }
              }
            ]
          }
        },
        toolResponse,
        endpoint
      );
      await client.bindTools([addNumbersTool]).invoke('What is 1 + 2?');
    });

    it('should bind a tool with strict set to true if defined by supportsStrictToolCalling', async () => {
      client.supportsStrictToolCalling = true;
      mockInference(
        {
          data: {
            messages: [
              {
                role: 'user' as const,
                content: 'What is 1 + 2?'
              }
            ],
            tools: [
              {
                type: 'function',
                function: {
                  ...addNumbersTool.function,
                  strict: true // Will be tested
                }
              }
            ]
          }
        },
        toolResponse,
        endpoint
      );
      await client.bindTools([addNumbersTool]).invoke('What is 1 + 2?');
    });
  });

  describe('withStructuredOutput', () => {
    it('should use `jsonSchema` method by default', async () => {
      const spy = jest.spyOn(client, 'withConfig');
      client.withStructuredOutput(joke, {
        name: 'joke',
        strict: true
      });

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'joke',
              description: getSchemaDescription(joke),
              schema: toJsonSchema(joke),
              strict: true
            }
          }
        })
      );
    });

    it('should use `jsonMode` method if specified', async () => {
      const spy = jest.spyOn(client, 'withConfig');
      client.withStructuredOutput(joke, { method: 'jsonMode' });

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          response_format: {
            type: 'json_object'
          }
        })
      );
    });

    it('should throw error if strict is used with `jsonMode`', () => {
      expect(() => {
        client.withStructuredOutput(joke, {
          name: 'joke',
          strict: true,
          method: 'jsonMode'
        });
      }).toThrow(
        "Argument 'strict' is not supported for 'method' = 'jsonMode'."
      );
    });
    it('should use `functionCalling` method if specified', async () => {
      const spy = jest.spyOn(client, 'withConfig');
      client.withStructuredOutput(joke, { method: 'functionCalling' });
      const asJsonSchema = toJsonSchema(joke);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          tools: [
            {
              type: 'function' as const,
              function: {
                name: 'extract',
                description: asJsonSchema.description,
                parameters: asJsonSchema
              }
            }
          ],
          tool_choice: {
            type: 'function' as const,
            function: {
              name: 'extract'
            }
          }
        })
      );
    });

    it('should use `functionCalling` with openai function json schema', async () => {
      const openAiFunctionJsonSchema: AzureOpenAiFunctionObject = {
        name: 'joke',
        description: 'Joke to tell user.',
        parameters: {
          title: 'Joke',
          type: 'object',
          properties: {
            setup: { type: 'string', description: 'The setup for the joke' },
            punchline: { type: 'string', description: "The joke's punchline" }
          },
          required: ['setup', 'punchline']
        }
      };

      const spy = jest.spyOn(client, 'withConfig');
      client.withStructuredOutput(openAiFunctionJsonSchema, {
        name: 'joke',
        method: 'functionCalling'
      });

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          tools: [
            {
              type: 'function' as const,
              function: openAiFunctionJsonSchema
            }
          ],
          tool_choice: {
            type: 'function' as const,
            function: {
              name: 'joke'
            }
          }
        })
      );
    });
  });

  describe('streaming', () => {
    it('supports streaming responses', async () => {
      mockInference(
        {
          data: {
            messages: [
              {
                role: 'user' as const,
                content: 'What is the capital of France?'
              }
            ],
            stream: true,
            stream_options: {
              include_usage: true
            }
          }
        },
        {
          data: mockResponseStream,
          status: 200
        },
        endpoint
      );

      const stream = await client.stream('What is the capital of France?');
      let finalOutput: AIMessageChunk | undefined;
      for await (const chunk of stream) {
        finalOutput = finalOutput ? finalOutput.concat(chunk) : chunk;
      }

      expect(finalOutput).toMatchSnapshot();
    });

    it('supports auto-streaming responses', async () => {
      mockInference(
        {
          data: {
            messages: [
              {
                role: 'user' as const,
                content: 'What is the capital of France?'
              }
            ],
            stream: true,
            stream_options: {
              include_usage: true
            }
          }
        },
        {
          data: mockResponseStream,
          status: 200
        },
        endpoint
      );
      jest.spyOn(AzureOpenAiChatClient.prototype, '_streamResponseChunks');

      client.streaming = true;
      expect(client.streaming).toBe(true);

      const finalOutput = await client.invoke('What is the capital of France?');

      expect(finalOutput).toBeDefined();
      expect(client._streamResponseChunks).toHaveBeenCalled();
    });

    it('supports disabling auto-streaming via disableStreaming flag', async () => {
      mockInference(
        {
          data: {
            messages: [
              {
                role: 'user' as const,
                content: 'What is the capital of France?'
              }
            ]
          }
        },
        {
          data: {
            choices: [
              {
                message: {
                  role: 'assistant',
                  content: 'The capital of France is Paris.'
                },
                index: 0
              }
            ]
          },
          status: 200
        },
        endpoint
      );
      jest.spyOn(AzureOpenAiChatClient.prototype, '_streamResponseChunks');

      client.streaming = false;
      client.disableStreaming = true;

      const finalOutput = await client.invoke('What is the capital of France?');

      expect(finalOutput).toMatchSnapshot();
      expect(client._streamResponseChunks).not.toHaveBeenCalled();
    });

    it('has langchain handle disabling streaming via disableStreaming flag in stream', async () => {
      mockInference(
        {
          data: {
            messages: [
              {
                role: 'user' as const,
                content: 'What is the capital of France?'
              }
            ]
          }
        },
        {
          data: {
            choices: [
              {
                message: {
                  role: 'assistant',
                  content: 'The capital of France is Paris.'
                },
                index: 0
              }
            ]
          },
          status: 200
        },
        endpoint
      );
      jest.spyOn(AzureOpenAiChatClient.prototype, '_streamResponseChunks');

      client.disableStreaming = true;
      client.streaming = false;

      const stream = await client.stream('What is the capital of France?');

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
      let testClient = new AzureOpenAiChatClient({
        modelName: 'gpt-4o',
        streaming: true,
        disableStreaming: true
      });

      // streaming should be disabled due to disableStreaming being true
      expect(testClient.streaming).toBe(false);
      expect(testClient.disableStreaming).toBe(true);

      testClient = new AzureOpenAiChatClient({
        modelName: 'gpt-4o',
        streaming: false
      });

      // streaming should be disabled
      expect(testClient.streaming).toBe(false);
      expect(testClient.disableStreaming).toBe(true);

      testClient = new AzureOpenAiChatClient({
        modelName: 'gpt-4o',
        streaming: true
      });

      // auto-streaming should be enabled
      expect(testClient.streaming).toBe(true);
      expect(testClient.disableStreaming).toBe(false);

      testClient = new AzureOpenAiChatClient({
        modelName: 'gpt-4o'
      });

      // auto-streaming and disable-streaming should be disabled by default
      expect(testClient.streaming).toBe(false);
      expect(testClient.disableStreaming).toBe(false);
    });

    it('streams and aborts with a signal', async () => {
      mockInference(
        {
          data: {
            messages: [
              {
                role: 'user' as const,
                content: 'What is the capital of France?'
              }
            ],
            stream: true,
            stream_options: {
              include_usage: true
            }
          }
        },
        {
          data: mockResponseStream,
          status: 200
        },
        endpoint
      );

      const controller = new AbortController();
      const stream = await client.stream('What is the capital of France?', {
        signal: controller.signal
      });
      const streamFunction = async () => {
        for await (const _ of stream) {
          controller.abort();
        }
      };
      await expect(streamFunction()).rejects.toThrow('Aborted');
    });

    it('supports streaming responses with tool calls', async () => {
      mockInference(
        {
          data: {
            messages: [
              {
                role: 'user' as const,
                content: 'What is 1 + 2?'
              }
            ],
            tools: [addNumbersTool],
            stream: true,
            stream_options: {
              include_usage: true
            }
          }
        },
        {
          data: mockResponseStreamToolCalls,
          status: 200
        },
        endpoint
      );

      const stream = await client
        .bindTools([addNumbersTool])
        .stream('What is 1 + 2?');
      let finalOutput: AIMessageChunk | undefined;
      for await (const chunk of stream) {
        finalOutput = finalOutput ? finalOutput.concat(chunk) : chunk;
      }
      const completeToolCall = finalOutput!.tool_calls![0];
      expect(completeToolCall.name).toBe('add');
      expect(completeToolCall.args).toEqual({
        a: 1,
        b: 2
      });
      expect(finalOutput).toMatchSnapshot();
    });
    it('streams when invoked in a streaming langgraph', async () => {
      mockInference(
        {
          data: {
            messages: [
              {
                role: 'user',
                content: 'Hello!'
              }
            ],
            stream: true,
            stream_options: {
              include_usage: true
            }
          }
        },
        {
          data: mockResponseStream,
          status: 200
        },
        endpoint
      );
      jest.spyOn(AzureOpenAiChatClient.prototype, '_streamResponseChunks');
      // Simulate a minimal streaming langgraph-like workflow
      const llm = new AzureOpenAiChatClient({ modelName: 'gpt-4o' });

      // Simulate a node function that calls the model using invoke
      const callModel = async (state: { messages: any }) => {
        const messages = await llm.invoke(state.messages);
        return { messages };
      };

      // Define a new graph
      const workflow = new StateGraph(MessagesAnnotation)
        // Define the (single) node in the graph
        .addNode('model', callModel)
        .addEdge(START, 'model')
        .addEdge('model', END);

      const app = workflow.compile();
      const stream = await app.stream(
        { messages: [{ role: 'user', content: 'Hello!' }] },
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
  });
});
