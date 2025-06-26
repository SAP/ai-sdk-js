import nock from 'nock';
import { apiVersion } from '@sap-ai-sdk/foundation-models/internal.js';
import {
  mockClientCredentialsGrantCall,
  mockDeploymentsList,
  mockInference,
  parseFileToString
} from '../../../../test-util/mock-http.js';
import { addNumbersTool } from '../../../../test-util/tools.js';
import { AzureOpenAiChatClient } from './chat.js';
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
  });
});
