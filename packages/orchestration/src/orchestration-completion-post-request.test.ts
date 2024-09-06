import { CompletionPostRequest } from './client/api/index.js';
import { constructCompletionPostRequest } from './orchestration-client.js';
import { azureContentFilter } from './orchestration-filter-utility.js';
import { OrchestrationModuleConfig } from './orchestration-types.js';

describe('constructCompletionPostRequest()', () => {
  const defaultConfig: OrchestrationModuleConfig = {
    llmConfig: {
      model_name: 'gpt-35-turbo-16k',
      model_params: { max_tokens: 50, temperature: 0.1 }
    },
    templatingConfig: {
      template: [{ role: 'user', content: 'Hi' }]
    }
  };

  it('with model configuration and prompt template', async () => {
    const expectedCompletionPostRequest: CompletionPostRequest = {
      orchestration_config: {
        module_configurations: {
          templating_module_config: defaultConfig.templatingConfig,
          llm_module_config: defaultConfig.llmConfig
        }
      }
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(defaultConfig);
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  // TODO: Adapt the test after Cloud SDK fix for: https://github.com/SAP/cloud-sdk-backlog/issues/1234
  it('with model configuration and empty template', async () => {
    const config = { ...defaultConfig, templatingConfig: { template: [] } };
    const expectedCompletionPostRequest: CompletionPostRequest = {
      orchestration_config: {
        module_configurations: {
          templating_module_config: config.templatingConfig,
          llm_module_config: config.llmConfig
        }
      }
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(config);
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  it('with model configuration, prompt template and template params', async () => {
    const config = {
      ...defaultConfig,
      templatingConfig: {
        template: [
          {
            role: 'user',
            content: 'Create {{?number}} paraphrases of {{?phrase}}'
          }
        ]
      }
    };
    const inputParams = { phrase: 'I hate you.', number: '3' };
    const expectedCompletionPostRequest: CompletionPostRequest = {
      orchestration_config: {
        module_configurations: {
          templating_module_config: config.templatingConfig,
          llm_module_config: config.llmConfig
        }
      },
      input_params: inputParams
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(config, { inputParams });
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  it('with model configuration, prompt template and empty template params', async () => {
    const config = {
      ...defaultConfig,
      templatingConfig: {
        template: [
          {
            role: 'user',
            content: 'Create {{?number}} paraphrases of {{?phrase}}'
          }
        ]
      }
    };
    const inputParams = {};
    const expectedCompletionPostRequest: CompletionPostRequest = {
      orchestration_config: {
        module_configurations: {
          templating_module_config: config.templatingConfig,
          llm_module_config: config.llmConfig
        }
      },
      input_params: inputParams
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(config, { inputParams });
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  it('with model name, empty model parameters and prompt template', async () => {
    const config = {
      ...defaultConfig,
      llmConfig: {
        model_name: 'gpt-35-turbo-16k',
        model_params: {}
      },
      filterConfig: {}
    };
    const expectedCompletionPostRequest: CompletionPostRequest = {
      orchestration_config: {
        module_configurations: {
          templating_module_config: config.templatingConfig,
          llm_module_config: config.llmConfig
        }
      }
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(config);
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  it('with model configuration, prompt template and message history', async () => {
    const config = {
      ...defaultConfig,
      templatingConfig: {
        template: [{ role: 'user', content: "What's my name?" }]
      }
    };
    const messagesHistory = [
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
    ];
    const expectedCompletionPostRequest: CompletionPostRequest = {
      orchestration_config: {
        module_configurations: {
          templating_module_config: config.templatingConfig,
          llm_module_config: config.llmConfig
        }
      },
      messages_history: messagesHistory
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(config, { messagesHistory });
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  it('with model configuration, prompt template and filter configuration', async () => {
    const config = {
      ...defaultConfig,
      filterConfig: {
        input: azureContentFilter({ Hate: 4, SelfHarm: 0 })
      }
    };
    const expectedCompletionPostRequest: CompletionPostRequest = {
      orchestration_config: {
        module_configurations: {
          templating_module_config: config.templatingConfig,
          llm_module_config: config.llmConfig,
          filtering_module_config: config.filterConfig
        }
      }
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(config);
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  // TODO: Adapt the test after Cloud SDK fix for: https://github.com/SAP/cloud-sdk-backlog/issues/1234
  it('with model configuration, prompt template empty filter configuration', async () => {
    const config = { ...defaultConfig, filterConfig: {} };
    const expectedCompletionPostRequest: CompletionPostRequest = {
      orchestration_config: {
        module_configurations: {
          templating_module_config: config.templatingConfig,
          llm_module_config: config.llmConfig
        }
      }
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(config);
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });
});
