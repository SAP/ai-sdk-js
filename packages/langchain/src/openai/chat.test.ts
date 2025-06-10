import nock from 'nock';
import { apiVersion } from '@sap-ai-sdk/foundation-models/internal.js';
import {
  mockClientCredentialsGrantCall,
  mockDeploymentsList,
  mockInference
} from '../../../../test-util/mock-http.js';
import { addNumbersTool } from '../../../../test-util/tools.js';
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
});
