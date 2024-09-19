import { CompletionPostRequest } from './client/api/schema/index.js';
import { constructCompletionPostRequest } from './orchestration-client.js';
import { buildAzureContentFilter } from './orchestration-filter-utility.js';
import { OrchestrationModuleConfig } from './orchestration-types.js';

describe('constructCompletionPostRequest()', () => {
  const defaultConfig: OrchestrationModuleConfig = {
    llm: {
      model_name: 'gpt-35-turbo-16k',
      model_params: { max_tokens: 50, temperature: 0.1 }
    },
    templating: {
      template: [{ role: 'user', content: 'Hi' }]
    }
  };

  it('with model configuration and prompt template', async () => {
    const expectedCompletionPostRequest: CompletionPostRequest = {
      orchestration_config: {
        module_configurations: {
          templating_module_config: defaultConfig.templating,
          llm_module_config: defaultConfig.llm
        }
      }
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(defaultConfig);
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  // TODO: Adapt the test after Cloud SDK fix for: https://github.com/SAP/cloud-sdk-backlog/issues/1234
  it('with model configuration and empty template', async () => {
    const config: OrchestrationModuleConfig = {
      ...defaultConfig,
      templating: { template: [] }
    };
    const expectedCompletionPostRequest: CompletionPostRequest = {
      orchestration_config: {
        module_configurations: {
          templating_module_config: config.templating,
          llm_module_config: config.llm
        }
      }
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(config);
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  it('with model configuration, prompt template and template params', async () => {
    const config: OrchestrationModuleConfig = {
      ...defaultConfig,
      templating: {
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
          templating_module_config: config.templating,
          llm_module_config: config.llm
        }
      },
      input_params: inputParams
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(config, { inputParams });
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  it('with model configuration, prompt template and empty template params', async () => {
    const config: OrchestrationModuleConfig = {
      ...defaultConfig,
      templating: {
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
          templating_module_config: config.templating,
          llm_module_config: config.llm
        }
      },
      input_params: inputParams
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(config, { inputParams });
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  it('with model name, empty model parameters and prompt template', async () => {
    const config: OrchestrationModuleConfig = {
      ...defaultConfig,
      llm: {
        model_name: 'gpt-35-turbo-16k',
        model_params: {}
      },
      filtering: {}
    };
    const expectedCompletionPostRequest: CompletionPostRequest = {
      orchestration_config: {
        module_configurations: {
          templating_module_config: config.templating,
          llm_module_config: config.llm
        }
      }
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(config);
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  it('with model configuration, prompt template and message history', async () => {
    const config: OrchestrationModuleConfig = {
      ...defaultConfig,
      templating: {
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
          templating_module_config: config.templating,
          llm_module_config: config.llm
        }
      },
      messages_history: messagesHistory
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(config, { messagesHistory });
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  it('with model configuration, prompt template and filter configuration', async () => {
    const config: OrchestrationModuleConfig = {
      ...defaultConfig,
      filtering: {
        input: buildAzureContentFilter({ Hate: 4, SelfHarm: 0 })
      }
    };
    const expectedCompletionPostRequest: CompletionPostRequest = {
      orchestration_config: {
        module_configurations: {
          templating_module_config: config.templating,
          llm_module_config: config.llm,
          filtering_module_config: config.filtering
        }
      }
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(config);
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  // TODO: Adapt the test after Cloud SDK fix for: https://github.com/SAP/cloud-sdk-backlog/issues/1234
  it('with model configuration, prompt template empty filter configuration', async () => {
    const config: OrchestrationModuleConfig = {
      ...defaultConfig,
      filtering: {}
    };
    const expectedCompletionPostRequest: CompletionPostRequest = {
      orchestration_config: {
        module_configurations: {
          templating_module_config: config.templating,
          llm_module_config: config.llm
        }
      }
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(config);
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });
});
