import {
  constructCompletionPostRequest,
  buildAzureContentSafetyFilter
} from './util/index.js';
import type { CompletionPostRequest } from './client/api/schema/index.js';
import type {
  OrchestrationModuleConfig,
  StreamOptions
} from './orchestration-types.js';

describe('construct completion post request', () => {
  const defaultConfig: OrchestrationModuleConfig = {
    prompt_templating: {
      prompt: {
        template: [{ role: 'user', content: 'Hi' }]
      },
      model: {
        name: 'gpt-4o',
        params: { max_tokens: 50, temperature: 0.1 }
      }
    }
  };

  it('should construct completion post request with prompt templating module', async () => {
    const expectedCompletionPostRequest: CompletionPostRequest = {
      config: {
        modules: {
          prompt_templating: defaultConfig.prompt_templating as any
        }
      }
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(defaultConfig);
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  // TODO: Adapt the test after Cloud SDK fix for: https://github.com/SAP/cloud-sdk-backlog/issues/1234
  xit('should construct completion post request with empty templating module', async () => {
    const config: OrchestrationModuleConfig = {
      prompt_templating: {
        prompt: { template: [] },
        model: {
          name: 'gpt-4o',
          params: { max_tokens: 50, temperature: 0.1 }
        }
      }
    };
    const expectedCompletionPostRequest: CompletionPostRequest = {
      config: {
        modules: {
          prompt_templating: config.prompt_templating as any
        }
      }
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(config);
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  it('should construct completion post request with input params', async () => {
    const config: OrchestrationModuleConfig = {
      prompt_templating: {
        prompt: {
          template: [
            {
              role: 'user',
              content: 'Create {{?number}} paraphrases of {{?phrase}}'
            }
          ]
        },
        model: {
          name: 'gpt-4o',
          params: { max_tokens: 50, temperature: 0.1 }
        }
      }
    };
    const placeholder_values = { phrase: 'I hate you.', number: '3' };
    const expectedCompletionPostRequest: CompletionPostRequest = {
      config: {
        modules: {
          prompt_templating: {
            ...config.prompt_templating,
            prompt: {
              template: [
                {
                  role: 'user',
                  content: 'Create {{?number}} paraphrases of {{?phrase}}'
                }
              ]
            }
          }
        }
      },
      placeholder_values
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(config, { placeholder_values });
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  it('should construct completion post request with empty input params', async () => {
    const config: OrchestrationModuleConfig = {
      prompt_templating: {
        prompt: {
          template: [
            {
              role: 'user',
              content: 'Create {{?number}} paraphrases of {{?phrase}}'
            }
          ]
        },
        model: {
          name: 'gpt-4o',
          params: { max_tokens: 50, temperature: 0.1 }
        }
      }
    };
    const placeholder_values = {};
    const expectedCompletionPostRequest: CompletionPostRequest = {
      config: {
        modules: {
          prompt_templating: {
            ...config.prompt_templating,
            prompt: {
              template: [
                {
                  role: 'user',
                  content: 'Create {{?number}} paraphrases of {{?phrase}}'
                }
              ]
            }
          }
        }
      },
      placeholder_values
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(config, { placeholder_values });
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  it('should construct completion post request with empty model params', async () => {
    const config: OrchestrationModuleConfig = {
      prompt_templating: {
        prompt: {
          template: [{ role: 'user', content: 'Hi' }]
        },
        model: {
          name: 'gpt-4o',
          params: {}
        }
      },
      filtering: {}
    };
    const expectedCompletionPostRequest: CompletionPostRequest = {
      config: {
        modules: {
          prompt_templating: config.prompt_templating as any
        }
      }
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(config);
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  it('should construct completion post request with message history', async () => {
    const config: OrchestrationModuleConfig = {
      prompt_templating: {
        prompt: {
          template: [{ role: 'user', content: "What's my name?" }]
        },
        model: {
          name: 'gpt-4o',
          params: { max_tokens: 50, temperature: 0.1 }
        }
      }
    };
    const messagesHistory = [
      {
        role: 'system' as const,
        content:
          'You are a helpful assistant who remembers all details the user shares with you.'
      },
      {
        role: 'user' as const,
        content: 'Hi! Im Bob'
      },
      {
        role: 'assistant' as const,
        content:
          "Hi Bob, nice to meet you! I'm an AI assistant. I'll remember that your name is Bob as we continue our conversation."
      }
    ];
    const expectedCompletionPostRequest: CompletionPostRequest = {
      config: {
        modules: {
          prompt_templating: {
            ...config.prompt_templating,
            prompt: {
              template: [{ role: 'user', content: "What's my name?" }]
            }
          }
        }
      },
      messages_history: messagesHistory
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(config, { messagesHistory });
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  it('should construct completion post request with filtering', async () => {
    const config: OrchestrationModuleConfig = {
      prompt_templating: {
        prompt: {
          template: [{ role: 'user', content: 'Hi' }]
        },
        model: {
          name: 'gpt-4o',
          params: { max_tokens: 50, temperature: 0.1 }
        }
      },
      filtering: {
        input: {
          filters: [
            buildAzureContentSafetyFilter({
              hate: 'ALLOW_SAFE_LOW_MEDIUM',
              self_harm: 'ALLOW_SAFE'
            })
          ]
        }
      }
    };
    const expectedCompletionPostRequest: CompletionPostRequest = {
      config: {
        modules: {
          prompt_templating: config.prompt_templating as any,
          filtering: config.filtering
        }
      }
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(config);
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  // TODO: Adapt the test after Cloud SDK fix for: https://github.com/SAP/cloud-sdk-backlog/issues/1234
  it('should construct completion post request with empty filtering', async () => {
    const config: OrchestrationModuleConfig = {
      prompt_templating: {
        prompt: {
          template: [{ role: 'user', content: 'Hi' }]
        },
        model: {
          name: 'gpt-4o',
          params: { max_tokens: 50, temperature: 0.1 }
        }
      },
      filtering: {}
    };
    const expectedCompletionPostRequest: CompletionPostRequest = {
      config: {
        modules: {
          prompt_templating: config.prompt_templating as any
        }
      }
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(config);
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  it('should construct completion post request with stream options', async () => {
    const config: OrchestrationModuleConfig = {
      prompt_templating: {
        prompt: {
          template: [{ role: 'user', content: 'Hi' }]
        },
        model: {
          name: 'gpt-4o',
          params: { max_tokens: 50, temperature: 0.1 }
        }
      },
      filtering: {
        output: {
          filters: [
            buildAzureContentSafetyFilter({
              hate: 'ALLOW_SAFE_LOW_MEDIUM',
              self_harm: 'ALLOW_SAFE'
            })
          ]
        }
      }
    };

    const streamOptions: StreamOptions = {
      global: { chunk_size: 100 },
      outputFiltering: { overlap: 100 }
    };

    const expectedCompletionPostRequest: CompletionPostRequest = {
      config: {
        stream: {
          enabled: true,
          chunk_size: 100
        },
        modules: {
          prompt_templating: {
            ...config.prompt_templating,
            model: {
              ...config.prompt_templating.model,
              params: {
                ...config.prompt_templating.model.params,
                stream_options: { include_usage: true }
              }
            }
          } as any,
          filtering: {
            output: {
              ...config.filtering!.output!,
              stream_options: streamOptions.outputFiltering
            }
          }
        }
      },
      placeholder_values: { phrase: 'I hate you.' }
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(
        config,
        { placeholder_values: { phrase: 'I hate you.' } },
        true,
        streamOptions
      );
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });
});
