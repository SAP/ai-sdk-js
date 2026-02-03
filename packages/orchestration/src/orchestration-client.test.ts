import nock from 'nock';
import { jest } from '@jest/globals';
import { createLogger } from '@sap-cloud-sdk/util';
import {
  resolveDeploymentId,
  getOrchestrationDeploymentId
} from '@sap-ai-sdk/ai-api/internal.js';
import {
  mockClientCredentialsGrantCall,
  mockDeploymentsList,
  mockInference,
  parseFileToString,
  parseMockResponse
} from '../../../test-util/mock-http.js';
import {
  addNumbersTool,
  multiplyNumbersTool
} from '../../../test-util/tools.js';
import { OrchestrationClient } from './orchestration-client.js';
import { OrchestrationResponse } from './orchestration-response.js';
import {
  constructCompletionPostRequestFromJsonModuleConfig,
  constructCompletionPostRequest,
  buildAzureContentSafetyFilter,
  buildLlamaGuard38BFilter
} from './util/index.js';
import type { CompletionPostResponse } from './client/api/schema/index.js';
import type {
  OrchestrationModuleConfig,
  OrchestrationConfigRef,
  ChatCompletionRequest
} from './orchestration-types.js';

const defaultJsonConfig = `{
  "module_configurations": {
    "prompt_templating": {
      "model": {
        "name": "gpt-4o",
        "params": {
          "max_tokens": 50,
          "temperature": 0.1
        }
      },
      "prompt": {
        "template": [{ "role": "user", "content": "What is the capital of France?" }]
      }
    }
  }
}`;

const streamMockResponse = await parseFileToString(
  'orchestration',
  'orchestration-chat-completion-stream-chunks.txt'
);

function mockJsonStreamInference(
  jsonConfig: string = defaultJsonConfig,
  response: string = streamMockResponse
) {
  mockInference(
    {
      data: constructCompletionPostRequestFromJsonModuleConfig(
        JSON.parse(jsonConfig),
        undefined,
        true
      )
    },
    {
      data: response,
      status: 200
    },
    {
      url: 'inference/deployments/1234/v2/completion'
    }
  );
}

describe('orchestration service client', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
    mockDeploymentsList({ scenarioId: 'orchestration' }, { id: '1234' });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('calls chatCompletion with minimal configuration', async () => {
    const config: OrchestrationModuleConfig = {
      promptTemplating: {
        model: {
          name: 'gpt-4o',
          params: { max_tokens: 50, temperature: 0.1 }
        }
      }
    };

    const prompt: ChatCompletionRequest = {
      messages: [{ role: 'user', content: 'Hello' }]
    };

    const mockResponse = await parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'orchestration-chat-completion-success-response.json'
    );

    mockInference(
      {
        data: constructCompletionPostRequest(config, prompt)
      },
      {
        data: mockResponse,
        status: 200
      },
      {
        url: 'inference/deployments/1234/v2/completion'
      }
    );
    const response = await new OrchestrationClient(config).chatCompletion(
      prompt
    );

    expect(response).toBeInstanceOf(OrchestrationResponse);
    expect(response._data).toEqual(mockResponse);
    expect(response.getContent()).toEqual(expect.any(String));
    expect(response.getFinishReason()).toEqual(expect.any(String));
    expect(response.getTokenUsage().completion_tokens).toEqual(
      expect.any(Number)
    );
  });

  it('calls chatCompletion with some templating configuration (without template)', async () => {
    const config: OrchestrationModuleConfig = {
      promptTemplating: {
        model: {
          name: 'gpt-4o',
          params: { max_tokens: 500 }
        },
        prompt: {
          defaults: {
            topic: 'AI Core'
          }
        }
      }
    };

    const mockResponse = await parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'orchestration-chat-completion-yaml-template-response.json'
    );
    mockInference(
      {
        data: constructCompletionPostRequest(config, {
          messages: [
            {
              role: 'system',
              content:
                'You are a world-famous poet who can write virtuosic and brilliant poetry on any topic.'
            },
            {
              role: 'user',
              content:
                'Write a 1 verse poem about the following topic: {{?topic}}'
            }
          ],
          placeholderValues: { topic: 'Generative AI Hub' }
        })
      },
      {
        data: mockResponse,
        status: 200
      },
      {
        url: 'inference/deployments/1234/v2/completion'
      }
    );
    const response = await new OrchestrationClient(config).chatCompletion({
      messages: [
        {
          role: 'system',
          content:
            'You are a world-famous poet who can write virtuosic and brilliant poetry on any topic.'
        },
        {
          role: 'user',
          content: 'Write a 1 verse poem about the following topic: {{?topic}}'
        }
      ],
      placeholderValues: { topic: 'Generative AI Hub' }
    });
    expect(response._data).toEqual(mockResponse);
  }, 60000);

  it('should throw an error when invalid JSON is provided', () => {
    const invalidJsonConfig = '{ "module_configurations": {}, ';

    expect(() => new OrchestrationClient(invalidJsonConfig)).toThrow(
      'Could not parse JSON'
    );
  });

  it('calls chatCompletion with valid JSON configuration', async () => {
    const mockResponse = await parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'orchestration-chat-completion-success-response.json'
    );

    mockInference(
      {
        data: constructCompletionPostRequestFromJsonModuleConfig(
          JSON.parse(defaultJsonConfig)
        )
      },
      {
        data: mockResponse,
        status: 200
      },
      {
        url: 'inference/deployments/1234/v2/completion'
      }
    );

    const response = await new OrchestrationClient(
      defaultJsonConfig
    ).chatCompletion();

    expect(response).toBeInstanceOf(OrchestrationResponse);
    expect(response._data).toEqual(mockResponse);
  });

  it('calls chatCompletion with filter configuration supplied using convenience function', async () => {
    const config: OrchestrationModuleConfig = {
      promptTemplating: {
        model: {
          name: 'gpt-4o',
          params: { max_tokens: 50, temperature: 0.1 }
        },
        prompt: {
          template: [
            {
              role: 'user',
              content: 'Create {{?number}} paraphrases of {{?phrase}}'
            }
          ]
        }
      },
      filtering: {
        input: {
          filters: [
            buildAzureContentSafetyFilter('input', {
              hate: 'ALLOW_SAFE_LOW_MEDIUM',
              self_harm: 'ALLOW_SAFE_LOW'
            })
          ]
        },
        output: {
          filters: [
            buildAzureContentSafetyFilter('output', {
              sexual: 'ALLOW_SAFE',
              violence: 'ALLOW_SAFE_LOW_MEDIUM'
            })
          ]
        }
      }
    };
    const prompt = {
      placeholderValues: { phrase: 'I hate you.', number: '3' }
    };
    const mockResponse = await parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'orchestration-chat-completion-filter-config.json'
    );

    mockInference(
      {
        data: constructCompletionPostRequest(config, prompt)
      },
      {
        data: mockResponse,
        status: 200
      },
      {
        url: 'inference/deployments/1234/v2/completion'
      }
    );
    const response = await new OrchestrationClient(config).chatCompletion(
      prompt
    );
    expect(response._data).toEqual(mockResponse);
  });

  it('calls chatCompletion with filter configuration supplied using multiple convenience functions', async () => {
    const llamaFilter = buildLlamaGuard38BFilter('input', ['self_harm']);
    const azureContentInputFilter = buildAzureContentSafetyFilter('input', {
      self_harm: 'ALLOW_SAFE',
      prompt_shield: true
    });
    const azureContentOutputFilter = buildAzureContentSafetyFilter('output', {
      self_harm: 'ALLOW_SAFE'
    });
    const config: OrchestrationModuleConfig = {
      promptTemplating: {
        model: {
          name: 'gpt-4o',
          params: { max_tokens: 50, temperature: 0.1 }
        },
        prompt: {
          template: [
            {
              role: 'user',
              content: 'Create {{?number}} paraphrases of {{?phrase}}'
            }
          ]
        }
      },
      filtering: {
        input: {
          filters: [llamaFilter, azureContentInputFilter]
        },
        output: {
          filters: [llamaFilter, azureContentOutputFilter]
        }
      }
    };
    const prompt = {
      placeholderValues: { phrase: 'I like myself.', number: '20' }
    };
    const mockResponse = await parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'orchestration-chat-completion-multiple-filter-config.json'
    );

    mockInference(
      {
        data: constructCompletionPostRequest(config, prompt)
      },
      {
        data: mockResponse,
        status: 200
      },
      {
        url: 'inference/deployments/1234/v2/completion'
      }
    );
    const response = await new OrchestrationClient(config).chatCompletion(
      prompt
    );
    expect(response._data).toEqual(mockResponse);
  });

  it('calls chatCompletion with filtering configuration', async () => {
    const config: OrchestrationModuleConfig = {
      promptTemplating: {
        model: {
          name: 'gpt-4o',
          params: { max_tokens: 50, temperature: 0.1 }
        },
        prompt: {
          template: [
            {
              role: 'user',
              content: 'Create {{?number}} paraphrases of {{?phrase}}'
            }
          ]
        }
      },
      filtering: {
        input: {
          filters: [
            {
              type: 'azure_content_safety' as const,
              config: {
                hate: 4 as const,
                self_harm: 2 as const
              }
            }
          ]
        },
        output: {
          filters: [
            {
              type: 'azure_content_safety' as const,
              config: {
                self_harm: 0 as const,
                violence: 4 as const
              }
            }
          ]
        }
      }
    };
    const prompt = {
      placeholderValues: { phrase: 'I hate you.', number: '3' }
    };
    const mockResponse = await parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'orchestration-chat-completion-filter-config.json'
    );

    mockInference(
      {
        data: constructCompletionPostRequest(config, prompt)
      },
      {
        data: mockResponse,
        status: 200
      },
      {
        url: 'inference/deployments/1234/v2/completion'
      }
    );
    const response = await new OrchestrationClient(config).chatCompletion(
      prompt
    );
    expect(response._data).toEqual(mockResponse);
  });

  it('sends message_history together with messages', async () => {
    const config: OrchestrationModuleConfig = {
      promptTemplating: {
        model: {
          name: 'gpt-4o',
          params: { max_tokens: 50, temperature: 0.1 }
        }
      }
    };
    const prompt: ChatCompletionRequest = {
      messages: [{ role: 'user', content: "What's my name?" }],
      messagesHistory: [
        {
          role: 'system',
          content:
            'You are a helpful assistant who remembers all details the user shares with you.'
        },
        {
          role: 'user',
          content: 'Hi! Im Bob'
        },
        {
          role: 'assistant',
          content:
            "Hi Bob, nice to meet you! I'm an AI assistant. I'll remember that your name is Bob as we continue our conversation."
        }
      ]
    };

    const mockResponse = await parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'orchestration-chat-completion-message-history.json'
    );
    mockInference(
      {
        data: constructCompletionPostRequest(config, prompt)
      },
      {
        data: mockResponse,
        status: 200
      },
      {
        url: 'inference/deployments/1234/v2/completion'
      }
    );

    const response = await new OrchestrationClient(config).chatCompletion(
      prompt
    );
    expect(response._data).toEqual(mockResponse);
  });

  it('calls chatCompletion with template passed as YAML config', async () => {
    const yamlTemplate = await parseFileToString(
      'orchestration',
      'orchestration-chat-completion-yaml-template.yaml'
    );
    const configWithYaml: OrchestrationModuleConfig = {
      promptTemplating: {
        model: {
          name: 'gpt-4o',
          params: { max_tokens: 500 }
        },
        prompt: yamlTemplate
      }
    };

    const config: OrchestrationModuleConfig = {
      promptTemplating: {
        model: {
          name: 'gpt-4o',
          params: { max_tokens: 500 }
        },
        prompt: {
          template: [
            {
              role: 'system',
              content:
                'You are a world-famous poet who can write virtuosic and brilliant poetry on any topic.'
            },
            {
              role: 'user',
              content:
                'Write a 1 verse poem about the following topic: {{?topic}}'
            }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'poem_structure',
              description: 'Structured format for the generated poem',
              strict: true,
              schema: {
                type: 'object',
                additionalProperties: false,
                required: ['title', 'verses', 'theme'],
                properties: {
                  title: {
                    type: 'string',
                    description: 'The title of the poem'
                  },
                  theme: {
                    type: 'string',
                    description: 'The central theme or subject of the poem'
                  },
                  verses: {
                    type: 'array',
                    description: 'A list of verses making up the poem',
                    items: {
                      type: 'string',
                      description: 'A single verse of the poem'
                    }
                  }
                }
              }
            }
          }
        }
      }
    };

    const mockResponse = await parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'orchestration-chat-completion-yaml-template-response.json'
    );
    mockInference(
      {
        data: constructCompletionPostRequest(config, {
          placeholderValues: { topic: 'Generative AI Hub' }
        })
      },
      {
        data: mockResponse,
        status: 200
      },
      {
        url: 'inference/deployments/1234/v2/completion'
      }
    );
    const response = await new OrchestrationClient(
      configWithYaml
    ).chatCompletion({ placeholderValues: { topic: 'Generative AI Hub' } });
    expect(response._data).toEqual(mockResponse);
  }, 60000);

  it('throws when template is an empty string', async () => {
    const invalidConfigWithYaml: OrchestrationModuleConfig = {
      promptTemplating: {
        model: {
          name: 'gpt-4o',
          params: { max_tokens: 500 }
        },
        prompt: ''
      }
    };

    expect(() =>
      new OrchestrationClient(invalidConfigWithYaml).chatCompletion({
        placeholderValues: { topic: 'Generative AI Hub' }
      })
    ).toThrowErrorMatchingInlineSnapshot(
      '"Templating YAML string must be non-empty."'
    );
  });

  it('throws when template YAML string does not conform to the expected specification', async () => {
    const invalidConfigWithYaml: OrchestrationModuleConfig = {
      promptTemplating: {
        model: {
          name: 'gpt-4o',
          params: { max_tokens: 500 }
        },
        prompt: `
      name: poem
      version: 0.0.1
      scenario: agent-evaluator
      `
      }
    };

    expect(() =>
      new OrchestrationClient(invalidConfigWithYaml).chatCompletion()
    ).toThrowErrorMatchingInlineSnapshot(`
     "Prompt Template YAML does not conform to the defined type. Validation errors: [
       {
         "expected": "object",
         "code": "invalid_type",
         "path": [
           "spec"
         ],
         "message": "Invalid input: expected object, received undefined"
       }
     ]"
    `);
  });

  it('calls chatCompletion with grounding configuration', async () => {
    const config: OrchestrationModuleConfig = {
      promptTemplating: {
        model: {
          name: 'gpt-4o'
        },
        prompt: {
          template: [
            {
              role: 'user',
              content:
                'UserQuestion: {{?groundingRequest}} Context: {{?groundingOutput}}'
            }
          ],
          defaults: {}
        }
      },
      grounding: {
        type: 'document_grounding_service',
        config: {
          filters: [
            {
              data_repositories: ['*'],
              data_repository_type: 'vector'
            }
          ],
          placeholders: {
            input: ['groundingRequest'],
            output: 'groundingOutput'
          }
        }
      }
    };
    const prompt = {
      placeholderValues: {
        groundingRequest: 'What is Generative AI Hub in SAP AI Core?'
      }
    };
    const mockResponse = await parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'orchestration-chat-completion-grounding.json'
    );
    mockInference(
      {
        data: constructCompletionPostRequest(config, prompt)
      },
      {
        data: mockResponse,
        status: 200
      },
      {
        url: 'inference/deployments/1234/v2/completion'
      }
    );

    const response = await new OrchestrationClient(config).chatCompletion(
      prompt
    );
    expect(response._data).toEqual(mockResponse);
  });

  it('executes a request with the custom resource group', async () => {
    const prompt: ChatCompletionRequest = {
      messagesHistory: [
        {
          role: 'user',
          content: 'Where is the deepest place on earth located'
        }
      ]
    };

    const config: OrchestrationModuleConfig = {
      promptTemplating: {
        model: {
          name: 'gpt-4o'
        },
        prompt: {
          template: [{ role: 'user', content: "What's my name?" }]
        }
      }
    };

    const customChatCompletionEndpoint = {
      url: 'inference/deployments/1234/v2/completion',
      resourceGroup: 'custom-resource-group'
    };

    const mockResponse = await parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'orchestration-chat-completion-message-history.json'
    );

    mockDeploymentsList(
      { scenarioId: 'orchestration', resourceGroup: 'custom-resource-group' },
      { id: '1234', model: { name: 'gpt-4o', version: 'latest' } }
    );

    mockInference(
      {
        data: constructCompletionPostRequest(config, prompt)
      },
      {
        data: mockResponse,
        status: 200
      },
      customChatCompletionEndpoint
    );

    const clientWithResourceGroup = new OrchestrationClient(config, {
      resourceGroup: 'custom-resource-group'
    });

    const response = await clientWithResourceGroup.chatCompletion(prompt);
    expect(response._data).toEqual(mockResponse);
  });

  it('executes a streaming request with correct chunk response', async () => {
    const config: OrchestrationModuleConfig = {
      promptTemplating: {
        model: {
          name: 'gpt-4o',
          params: {}
        },
        prompt: {
          template: [
            {
              role: 'user',
              content: 'Give me a short introduction of SAP Cloud SDK.'
            }
          ]
        }
      }
    };

    const mockResponse = await parseFileToString(
      'orchestration',
      'orchestration-chat-completion-stream-chunks.txt'
    );

    mockInference(
      {
        data: constructCompletionPostRequest(config, undefined, true)
      },
      {
        data: mockResponse,
        status: 200
      },
      {
        url: 'inference/deployments/1234/v2/completion'
      }
    );
    const response = await new OrchestrationClient(config).stream();

    const initialResponse = await parseFileToString(
      'orchestration',
      'orchestration-chat-completion-stream-chunk-response-initial.json'
    );

    for await (const chunk of response.stream) {
      expect(chunk._data).toEqual(JSON.parse(initialResponse));
      break;
    }
  });

  it('executes a streaming request with JSON config without warnings', async () => {
    mockJsonStreamInference();

    const logger = createLogger({
      package: 'orchestration',
      messageContext: 'orchestration-client'
    });

    const warnSpy = jest.spyOn(logger, 'warn');

    const response = await new OrchestrationClient(defaultJsonConfig).stream();

    expect(warnSpy).not.toHaveBeenCalled();

    const initialResponse = await parseFileToString(
      'orchestration',
      'orchestration-chat-completion-stream-chunk-response-initial.json'
    );

    for await (const chunk of response.stream) {
      expect(chunk._data).toEqual(JSON.parse(initialResponse));
      break;
    }
  });

  it('executes a streaming request with JSON config and logs warning for stream options', async () => {
    mockJsonStreamInference();

    const logger = createLogger({
      package: 'orchestration',
      messageContext: 'orchestration-client'
    });

    const warnSpy = jest.spyOn(logger, 'warn');

    const response = await new OrchestrationClient(defaultJsonConfig).stream(
      undefined,
      undefined,
      {
        outputFiltering: { overlap: 100 }
      }
    );

    expect(warnSpy).toHaveBeenCalledWith(
      'Stream options are not supported when using a JSON module config.'
    );

    const initialResponse = await parseFileToString(
      'orchestration',
      'orchestration-chat-completion-stream-chunk-response-initial.json'
    );

    for await (const chunk of response.stream) {
      expect(chunk._data).toEqual(JSON.parse(initialResponse));
      break;
    }
  });

  it('executes a streaming request with multiple tools and parses the tool calls properly', async () => {
    const config: OrchestrationModuleConfig = {
      promptTemplating: {
        model: {
          name: 'gpt-4o',
          params: {}
        },
        prompt: {
          template: [
            {
              role: 'user',
              content: 'Add 2 + 3 and multiply 2 * 3'
            }
          ],
          tools: [addNumbersTool, multiplyNumbersTool]
        }
      }
    };

    const mockResponse = await parseFileToString(
      'orchestration',
      'orchestration-chat-completion-stream-tools-chunks.txt'
    );

    mockInference(
      {
        data: constructCompletionPostRequest(config, undefined, true)
      },
      {
        data: mockResponse,
        status: 200
      },
      {
        url: 'inference/deployments/1234/v2/completion'
      }
    );

    const response = await new OrchestrationClient(config).stream();

    for await (const _ of response.stream) {
      /* empty */
    }

    const tools = response.getToolCalls();

    expect(tools).toMatchInlineSnapshot(`
     [
       {
         "function": {
           "arguments": "{"a": 2, "b": 3}",
           "name": "add",
         },
         "id": "call_OtTlp96Eg6OFP1ynoerYThta",
         "index": 0,
         "type": "function",
       },
       {
         "function": {
           "arguments": "{"a": 2, "b": 3}",
           "name": "multiply",
         },
         "id": "call_mscosPWnNXuRYp5OQatYKOv9",
         "index": 1,
         "type": "function",
       },
     ]
    `);
  });
  describe('OrchestrationClient Stream Error Handling', () => {
    it('throws error when getting an SSE error chunk', async () => {
      const config: OrchestrationModuleConfig = {
        promptTemplating: {
          model: {
            name: 'gpt-4o',
            params: {}
          },
          prompt: {
            template: [
              {
                role: 'user',
                content: 'Give me a short introduction of SAP Cloud SDK.'
              }
            ]
          }
        }
      };

      // Read the mocked SSE chunks from the txt file
      const mockResponse = await parseFileToString(
        'orchestration',
        'orchestration-chat-completion-stream-chunks-with-error.txt'
      );

      // Mock the inference endpoint to return the streaming chunks
      mockInference(
        {
          data: constructCompletionPostRequest(config, undefined, true)
        },
        {
          data: mockResponse,
          status: 200
        },
        {
          url: 'inference/deployments/1234/v2/completion'
        }
      );

      // Call the streaming API
      const response = await new OrchestrationClient(config).stream();

      await expect(async () => {
        for await (const _ of response.stream) {
          /* empty */
        }
      }).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should abort controller and re-throw error when network request fails', async () => {
      const config: OrchestrationModuleConfig = {
        promptTemplating: {
          model: {
            name: 'gpt-4o',
            params: {}
          },
          prompt: {
            template: [
              {
                role: 'user',
                content: 'Test prompt'
              }
            ]
          }
        }
      };

      const controller = new AbortController();

      // Mock network failure
      mockInference(
        {
          data: constructCompletionPostRequest(config, undefined, true)
        },
        {
          status: 500,
          data: { error: 'Internal Server Error' }
        },
        {
          url: 'inference/deployments/1234/v2/completion'
        }
      );

      const client = new OrchestrationClient(config);

      await expect(
        client.stream(undefined, controller.signal)
      ).rejects.toThrow();
    });

    it('should throw error when stream is called with already aborted controller', async () => {
      const config: OrchestrationModuleConfig = {
        promptTemplating: {
          model: {
            name: 'gpt-4o',
            params: {}
          },
          prompt: {
            template: [
              {
                role: 'user',
                content: 'Test prompt'
              }
            ]
          }
        }
      };

      const controller = new AbortController();

      // Abort immediately
      controller.abort();

      const client = new OrchestrationClient(config);

      await expect(
        client.stream(undefined, controller.signal)
      ).rejects.toThrow();
    });
  });

  describe('config reference support', () => {
    it('calls chatCompletion with config reference by ID', async () => {
      const configRef: OrchestrationConfigRef = {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
      };

      const prompt: ChatCompletionRequest = {
        placeholderValues: { topic: 'AI' }
      };

      const mockResponse = await parseMockResponse<CompletionPostResponse>(
        'orchestration',
        'orchestration-chat-completion-success-response.json'
      );

      mockInference(
        {
          data: {
            config_ref: { id: configRef.id },
            placeholder_values: prompt.placeholderValues
          }
        },
        {
          data: mockResponse,
          status: 200
        },
        {
          url: 'inference/deployments/1234/v2/completion'
        }
      );

      const response = await new OrchestrationClient(configRef).chatCompletion(
        prompt
      );

      expect(response).toBeInstanceOf(OrchestrationResponse);
      expect(response._data).toEqual(mockResponse);
    });

    it('calls chatCompletion with config reference by name,scenario,version', async () => {
      const configRef: OrchestrationConfigRef = {
        scenario: 'sdk-test-scenario',
        name: 'test-orchestration-config',
        version: '1.0.0'
      };

      const prompt: ChatCompletionRequest = {
        messagesHistory: [{ role: 'user', content: 'Previous message' }],
        placeholderValues: { context: 'test' }
      };

      const mockResponse = await parseMockResponse<CompletionPostResponse>(
        'orchestration',
        'orchestration-chat-completion-success-response.json'
      );

      mockInference(
        {
          data: {
            config_ref: {
              scenario: configRef.scenario,
              name: configRef.name,
              version: configRef.version
            },
            placeholder_values: prompt.placeholderValues,
            messages_history: prompt.messagesHistory
          }
        },
        {
          data: mockResponse,
          status: 200
        },
        {
          url: 'inference/deployments/1234/v2/completion'
        }
      );

      const response = await new OrchestrationClient(configRef).chatCompletion(
        prompt
      );

      expect(response).toBeInstanceOf(OrchestrationResponse);
      expect(response._data).toEqual(mockResponse);
    });

    it('executes streaming request with config reference by ID', async () => {
      const configRef: OrchestrationConfigRef = {
        id: 'test-config-id'
      };

      const mockResponse = await parseFileToString(
        'orchestration',
        'orchestration-chat-completion-stream-chunks.txt'
      );

      mockInference(
        {
          data: {
            config_ref: { id: configRef.id }
          }
        },
        {
          data: mockResponse,
          status: 200
        },
        {
          url: 'inference/deployments/1234/v2/completion'
        }
      );

      const response = await new OrchestrationClient(configRef).stream();

      const initialResponse = await parseFileToString(
        'orchestration',
        'orchestration-chat-completion-stream-chunk-response-initial.json'
      );

      for await (const chunk of response.stream) {
        expect(chunk._data).toEqual(JSON.parse(initialResponse));
        break;
      }
    });

    it('warns when stream options are provided with config reference', async () => {
      const logger = createLogger({
        package: 'orchestration',
        messageContext: 'orchestration-client'
      });

      const warnSpy = jest.spyOn(logger, 'warn');

      const configRef: OrchestrationConfigRef = {
        id: 'test-config-id'
      };

      const mockResponse = await parseFileToString(
        'orchestration',
        'orchestration-chat-completion-stream-chunks.txt'
      );

      mockInference(
        {
          data: {
            config_ref: { id: configRef.id }
          }
        },
        {
          data: mockResponse,
          status: 200
        },
        {
          url: 'inference/deployments/1234/v2/completion'
        }
      );

      await new OrchestrationClient(configRef).stream(undefined, undefined, {
        global: { enabled: true }
      });

      expect(warnSpy).toHaveBeenCalledWith(
        'Stream options are not supported when using an orchestration config reference. Streaming is only supported if the referenced config has streaming configured.'
      );
    });

    it('warns when messages field is provided with config reference by ID', async () => {
      const logger = createLogger({
        package: 'orchestration',
        messageContext: 'orchestration-client'
      });

      const warnSpy = jest.spyOn(logger, 'warn');

      const configRef: OrchestrationConfigRef = {
        id: 'test-config-id'
      };

      const mockResponse = await parseMockResponse<CompletionPostResponse>(
        'orchestration',
        'orchestration-chat-completion-success-response.json'
      );

      mockInference(
        {
          data: {
            config_ref: { id: configRef.id }
          }
        },
        {
          data: mockResponse,
          status: 200
        },
        {
          url: 'inference/deployments/1234/v2/completion'
        }
      );

      await new OrchestrationClient(configRef).chatCompletion({
        messages: [{ role: 'user', content: 'test' }]
      });

      expect(warnSpy).toHaveBeenCalledWith(
        'The messages field in request is not supported when using an orchestration config reference. Messages should be part of the referenced configuration or provided via messagesHistory. The messages field will be ignored.'
      );
    });

    it('throws error when server returns non-streaming JSON response for config reference without streaming enabled', async () => {
      const configRef: OrchestrationConfigRef = {
        id: 'test-config-id-without-streaming'
      };

      // Load non-streaming JSON response (raw string without SSE format)
      const mockResponse = await parseFileToString(
        'orchestration',
        'orchestration-chat-completion-success-response.json'
      );

      // Mock the inference endpoint to return non-SSE formatted response
      // This simulates a config reference where streaming is not enabled
      mockInference(
        {
          data: {
            config_ref: { id: configRef.id }
          }
        },
        {
          data: mockResponse,
          status: 200
        },
        {
          url: 'inference/deployments/1234/v2/completion'
        }
      );

      // Call the streaming API with config reference
      const response = await new OrchestrationClient(configRef).stream();

      await expect(async () => {
        for await (const _ of response.stream) {
          /* empty */
        }
      }).rejects.toThrowErrorMatchingSnapshot();
    });
  });

  describe('OrchestrationClient deploymentId behavior', () => {
    it('does not call resolveDeployment when deploymentId is provided', async () => {
      const deploymentConfig = { deploymentId: 'test-deployment-id' };

      // Spy on the resolveDeployment function
      const spy = jest.spyOn({ resolveDeploymentId }, 'resolveDeploymentId');

      // Call getOrchestrationDeploymentId
      const result = await getOrchestrationDeploymentId(deploymentConfig);

      expect(result).toBe('test-deployment-id');
      expect(spy).not.toHaveBeenCalled();

      spy.mockRestore();
    });
  });
});
