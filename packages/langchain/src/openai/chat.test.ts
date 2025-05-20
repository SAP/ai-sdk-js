import { tool } from '@langchain/core/tools';
import { jest } from '@jest/globals';
import { zodToJsonSchema } from 'zod-to-json-schema';
import nock from 'nock';
import { z } from 'zod';
import { apiVersion } from '@sap-ai-sdk/foundation-models/internal.js';
import {
  mockClientCredentialsGrantCall,
  mockDeploymentsList,
  mockInference
} from '../../../../test-util/mock-http.js';
import { AzureOpenAiChatClient } from './chat.js';

describe('Chat client', () => {
  let client: AzureOpenAiChatClient;
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
    const addNumbersSchema = z
      .object({
        a: z.number().describe('The first number to be added.'),
        b: z.number().describe('The second number to be added.')
      })
      .strict();
    const myTool = tool(({ a, b }) => a + b, {
      name: 'add',
      description: 'Add two numbers',
      schema: addNumbersSchema
    });

    it('should bind a tool with strict set to true if defined in kwargs', async () => {
      const clientSpy = jest.spyOn(client['openAiChatClient'], 'run');
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
                  name: 'add',
                  description: 'Add two numbers',
                  parameters: zodToJsonSchema(addNumbersSchema),
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
        .bindTools([myTool], { strict: true })
        .invoke('What is 1 + 2?');
      expect(clientSpy).toHaveBeenCalledTimes(1);
    });

    it('should bind a tool with strict set to false if defined in kwargs', async () => {
      const clientSpy = jest.spyOn(client['openAiChatClient'], 'run');
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
                  name: 'add',
                  description: 'Add two numbers',
                  parameters: zodToJsonSchema(addNumbersSchema),
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
        .bindTools([myTool], { strict: false })
        .invoke('What is 1 + 2?');
      expect(clientSpy).toHaveBeenCalledTimes(1);
    });

    it('should bind a tool with undefined strict if not defined in kwargs', async () => {
      const clientSpy = jest.spyOn(client['openAiChatClient'], 'run');
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
                  name: 'add',
                  description: 'Add two numbers',
                  parameters: zodToJsonSchema(addNumbersSchema),
                  strict: undefined // Will be tested
                }
              }
            ]
          }
        },
        toolResponse,
        endpoint
      );
      await client.bindTools([myTool]).invoke('What is 1 + 2?');
      expect(clientSpy).toHaveBeenCalledTimes(1);
    });

    it('should bind a tool with strict set to true if defined by supportsStrictToolCalling', async () => {
      client.supportsStrictToolCalling = true;
      const clientSpy = jest.spyOn(client['openAiChatClient'], 'run');
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
                  name: 'add',
                  description: 'Add two numbers',
                  parameters: zodToJsonSchema(addNumbersSchema),
                  strict: true // Will be tested
                }
              }
            ]
          }
        },
        toolResponse,
        endpoint
      );
      await client.bindTools([myTool]).invoke('What is 1 + 2?');
      expect(clientSpy).toHaveBeenCalledTimes(1);
    });
  });
});
