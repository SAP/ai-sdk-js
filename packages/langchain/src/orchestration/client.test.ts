import { constructCompletionPostRequest } from '@sap-ai-sdk/orchestration/internal.js';
import { jest } from '@jest/globals';
import nock from 'nock';
import {
  mockClientCredentialsGrantCall,
  mockDeploymentsList,
  mockInference,
  parseMockResponse
} from '../../../../test-util/mock-http.js';
import { addNumbersTool } from '../../../../test-util/tools.js';
import { OrchestrationClient } from './client.js';
import type { LangChainOrchestrationModuleConfig } from './types.js';
import type {
  ChatMessages,
  CompletionPostResponse,
  ErrorResponse
} from '@sap-ai-sdk/orchestration';

jest.setTimeout(30000);

describe('orchestration service client', () => {
  let mockResponse: CompletionPostResponse;
  let mockResponseInputFilterError: ErrorResponse;
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

  describe('resilience', () => {
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
          data: constructCompletionPostRequest({
            ...config,
            templating: {
              template: messages
            }
          })
        },
        {
          data: response,
          status
        },
        endpoint,
        resilience
      );
    }

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
                  template: [{ role: 'user', content: 'What is 1 + 2?' }],
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
                  template: [{ role: 'user', content: 'What is 1 + 2?' }],
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
                  template: [{ role: 'user', content: 'What is 1 + 2?' }],
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
});
