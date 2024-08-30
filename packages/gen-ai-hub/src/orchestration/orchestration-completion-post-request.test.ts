import { CompletionPostRequest } from './client/api/index.js';
import { constructCompletionPostRequest } from './orchestration-client.js';
import { azureContentFilter } from './orchestration-filter-utility.js';
import { OrchestrationModuleConfig } from './orchestration-types.js';

describe('constructCompletionPostRequest()', () => {
  let input: OrchestrationModuleConfig;

  beforeEach(() => {
    input = {
      llmConfig: {
        model_name: 'gpt-35-turbo-16k',
        model_params: { max_tokens: 50, temperature: 0.1 }
      },
      prompt: {
        template: [{ role: 'user', content: 'Hi' }]
      }
    };
  });

  it('with model configuration and prompt template', async () => {
    const expectedCompletionPostRequest: CompletionPostRequest = {
      orchestration_config: {
        module_configurations: {
          templating_module_config: {
            template: [{ role: 'user', content: 'Hi' }]
          },
          llm_module_config: {
            model_name: 'gpt-35-turbo-16k',
            model_params: { max_tokens: 50, temperature: 0.1 }
          }
        }
      }
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(input);
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  // Todo: Adapt the test after Cloud SDK fix for: https://github.com/SAP/cloud-sdk-backlog/issues/1234
  it('with model configuration and empty template', async () => {
    input.prompt.template = [];
    const expectedCompletionPostRequest: CompletionPostRequest = {
      orchestration_config: {
        module_configurations: {
          templating_module_config: {
            template: []
          },
          llm_module_config: {
            model_name: 'gpt-35-turbo-16k',
            model_params: { max_tokens: 50, temperature: 0.1 }
          }
        }
      }
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(input);
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  it('with model configuration, prompt template and template params', async () => {
    input.prompt = {
      template: [
        {
          role: 'user',
          content: 'Create {{?number}} paraphrases of {{?phrase}}'
        }
      ],
      template_params: { phrase: 'I hate you.', number: '3' }
    };
    const expectedCompletionPostRequest: CompletionPostRequest = {
      orchestration_config: {
        module_configurations: {
          templating_module_config: {
            template: [
              {
                role: 'user',
                content: 'Create {{?number}} paraphrases of {{?phrase}}'
              }
            ]
          },
          llm_module_config: {
            model_name: 'gpt-35-turbo-16k',
            model_params: { max_tokens: 50, temperature: 0.1 }
          }
        }
      },
      input_params: { phrase: 'I hate you.', number: '3' }
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(input);
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  it('with model configuration, prompt template and empty template params', async () => {
    input.prompt = {
      template: [
        {
          role: 'user',
          content: 'Create {{?number}} paraphrases of {{?phrase}}'
        }
      ],
      template_params: {}
    };
    const expectedCompletionPostRequest: CompletionPostRequest = {
      orchestration_config: {
        module_configurations: {
          templating_module_config: {
            template: [
              {
                role: 'user',
                content: 'Create {{?number}} paraphrases of {{?phrase}}'
              }
            ]
          },
          llm_module_config: {
            model_name: 'gpt-35-turbo-16k',
            model_params: { max_tokens: 50, temperature: 0.1 }
          }
        }
      },
      input_params: {}
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(input);
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  it('with model name, empty model parameters and prompt template', async () => {
    input.llmConfig = {
      model_name: 'gpt-35-turbo-16k',
      model_params: {}
    };
    input.filterConfig = {};
    const expectedCompletionPostRequest: CompletionPostRequest = {
      orchestration_config: {
        module_configurations: {
          templating_module_config: {
            template: [
              {
                role: 'user',
                content: 'Hi'
              }
            ]
          },
          llm_module_config: {
            model_name: 'gpt-35-turbo-16k',
            model_params: {}
          }
        }
      }
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(input);
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  it('with model configuration, prompt template and message history', async () => {
    input.prompt = {
      template: [{ role: 'user', content: "What's my name?" }],
      messages_history: [
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
    const expectedCompletionPostRequest: CompletionPostRequest = {
      orchestration_config: {
        module_configurations: {
          templating_module_config: {
            template: [
              {
                role: 'user',
                content: "What's my name?"
              }
            ]
          },
          llm_module_config: {
            model_name: 'gpt-35-turbo-16k',
            model_params: { max_tokens: 50, temperature: 0.1 }
          }
        }
      },
      messages_history: [
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
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(input);
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  it('with model configuration, prompt template and filter configuration', async () => {
    input.filterConfig = {
      input: azureContentFilter({ Hate: 4, SelfHarm: 0 })
    };
    const expectedCompletionPostRequest: CompletionPostRequest = {
      orchestration_config: {
        module_configurations: {
          templating_module_config: {
            template: [
              {
                role: 'user',
                content: 'Hi'
              }
            ]
          },
          llm_module_config: {
            model_name: 'gpt-35-turbo-16k',
            model_params: { max_tokens: 50, temperature: 0.1 }
          },
          filtering_module_config: {
            input: {
              filters: [
                {
                  type: 'azure_content_safety',
                  config: {
                    Hate: 4,
                    SelfHarm: 0
                  }
                }
              ]
            }
          }
        }
      }
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(input);
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  // Todo: Adapt the test after Cloud SDK fix for: https://github.com/SAP/cloud-sdk-backlog/issues/1234
  it('with model configuration, prompt template empty filter configuration', async () => {
    input.filterConfig = {};
    const expectedCompletionPostRequest: CompletionPostRequest = {
      orchestration_config: {
        module_configurations: {
          templating_module_config: {
            template: [
              {
                role: 'user',
                content: 'Hi'
              }
            ]
          },
          llm_module_config: {
            model_name: 'gpt-35-turbo-16k',
            model_params: { max_tokens: 50, temperature: 0.1 }
          }
        }
      }
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(input);
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });
});
