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
    promptTemplating: {
      prompt: {
        template: [{ role: 'user', content: 'Hi' }]
      },
      model: {
        name: 'gpt-5.4-nano',
        params: { max_tokens: 50 }
      }
    }
  };

  it('should construct completion post request with prompt templating module', async () => {
    const expectedCompletionPostRequest: CompletionPostRequest = {
      config: {
        modules: {
          prompt_templating: defaultConfig.promptTemplating as any
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
      promptTemplating: {
        prompt: { template: [] },
        model: {
          name: 'gpt-5.4-nano',
          params: { max_tokens: 50 }
        }
      }
    };
    const expectedCompletionPostRequest: CompletionPostRequest = {
      config: {
        modules: {
          prompt_templating: config.promptTemplating as any
        }
      }
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(config);
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  it('should construct completion post request with input params', async () => {
    const config: OrchestrationModuleConfig = {
      promptTemplating: {
        prompt: {
          template: [
            {
              role: 'user',
              content: 'Create {{?number}} paraphrases of {{?phrase}}'
            }
          ]
        },
        model: {
          name: 'gpt-5.4-nano',
          params: { max_tokens: 50 }
        }
      }
    };
    const placeholderValues = { phrase: 'I hate you.', number: '3' };
    const expectedCompletionPostRequest: CompletionPostRequest = {
      config: {
        modules: {
          prompt_templating: {
            ...config.promptTemplating,
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
      placeholder_values: placeholderValues
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(config, { placeholderValues });
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  it('should construct completion post request with empty input params', async () => {
    const config: OrchestrationModuleConfig = {
      promptTemplating: {
        prompt: {
          template: [
            {
              role: 'user',
              content: 'Create {{?number}} paraphrases of {{?phrase}}'
            }
          ]
        },
        model: {
          name: 'gpt-5.4-nano',
          params: { max_tokens: 50 }
        }
      }
    };
    const placeholderValues = {};
    const expectedCompletionPostRequest: CompletionPostRequest = {
      config: {
        modules: {
          prompt_templating: {
            ...config.promptTemplating,
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
      placeholder_values: placeholderValues
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(config, { placeholderValues });
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  it('should construct completion post request with empty model params', async () => {
    const config: OrchestrationModuleConfig = {
      promptTemplating: {
        prompt: {
          template: [{ role: 'user', content: 'Hi' }]
        },
        model: {
          name: 'gpt-5.4-nano',
          params: {}
        }
      },
      filtering: {}
    };
    const expectedCompletionPostRequest: CompletionPostRequest = {
      config: {
        modules: {
          prompt_templating: config.promptTemplating as any
        }
      }
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(config);
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  it('should construct completion post request with message history', async () => {
    const config: OrchestrationModuleConfig = {
      promptTemplating: {
        prompt: {
          template: [{ role: 'user', content: "What's my name?" }]
        },
        model: {
          name: 'gpt-5.4-nano',
          params: { max_tokens: 50 }
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
            ...config.promptTemplating,
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
      promptTemplating: {
        prompt: {
          template: [{ role: 'user', content: 'Hi' }]
        },
        model: {
          name: 'gpt-5.4-nano',
          params: { max_tokens: 50 }
        }
      },
      filtering: {
        input: {
          filters: [
            buildAzureContentSafetyFilter('input', {
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
          prompt_templating: config.promptTemplating as any,
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
      promptTemplating: {
        prompt: {
          template: [{ role: 'user', content: 'Hi' }]
        },
        model: {
          name: 'gpt-5.4-nano',
          params: { max_tokens: 50 }
        }
      },
      filtering: {}
    };
    const expectedCompletionPostRequest: CompletionPostRequest = {
      config: {
        modules: {
          prompt_templating: config.promptTemplating as any
        }
      }
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(config);
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  it('should construct completion post request with stream options', async () => {
    const config: OrchestrationModuleConfig = {
      promptTemplating: {
        prompt: {
          template: [{ role: 'user', content: 'Hi' }]
        },
        model: {
          name: 'gpt-5.4-nano',
          params: { max_tokens: 50 }
        }
      },
      filtering: {
        output: {
          filters: [
            buildAzureContentSafetyFilter('output', {
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

    const placeholderValues = { phrase: 'I hate you.' };

    const expectedCompletionPostRequest: CompletionPostRequest = {
      config: {
        stream: {
          enabled: true,
          chunk_size: 100
        },
        modules: {
          prompt_templating: {
            ...config.promptTemplating,
            model: {
              ...config.promptTemplating.model,
              params: {
                ...config.promptTemplating.model.params,
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
      placeholder_values: placeholderValues
    };
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(
        config,
        { placeholderValues },
        true,
        streamOptions
      );
    expect(completionPostRequest).toEqual(expectedCompletionPostRequest);
  });

  describe('tool message auto-routing', () => {
    const toolCallId = 'call_abc123';
    const assistantMessage = {
      role: 'assistant' as const,
      tool_calls: [
        {
          id: toolCallId,
          type: 'function' as const,
          function: { name: 'search', arguments: '{"query":"test"}' }
        }
      ]
    };
    const toolMessage = {
      role: 'tool' as const,
      content: 'Result: {{?question}}',
      tool_call_id: toolCallId
    };
    const userMessage = { role: 'user' as const, content: 'Summarize.' };

    // Config without a static template — auto-routing is active
    const noTemplateConfig: OrchestrationModuleConfig = {
      promptTemplating: {
        model: { name: 'gpt-5.4-nano' },
        prompt: { template: [] }
      }
    };

    it('should route tool messages from messages to messages_history', () => {
      const result: any = constructCompletionPostRequest(noTemplateConfig, {
        messages: [userMessage, toolMessage, { role: 'user' as const, content: 'Follow up.' }]
      });

      expect(result.messages_history).toContainEqual(userMessage);
      expect(result.messages_history).toContainEqual(toolMessage);
      expect(
        result.config.modules.prompt_templating.prompt.template
      ).not.toContainEqual(toolMessage);
      expect(
        result.config.modules.prompt_templating.prompt.template
      ).not.toContainEqual(userMessage);
    });

    it('should preserve existing messagesHistory when appending tool messages', () => {
      const followUpUser = { role: 'user' as const, content: 'Follow up.' };
      const result = constructCompletionPostRequest(noTemplateConfig, {
        messages: [userMessage, toolMessage, followUpUser],
        messagesHistory: [assistantMessage]
      });

      expect(result.messages_history).toEqual([
        assistantMessage,
        userMessage,
        toolMessage
      ]);
    });

    it('should not affect non-tool messages', () => {
      const result: any = constructCompletionPostRequest(noTemplateConfig, {
        messages: [userMessage]
      });

      expect(result.messages_history).toBeUndefined();
      expect(
        result.config.modules.prompt_templating.prompt.template
      ).toContainEqual(userMessage);
    });

    it('should preserve chronological message order across the split', () => {
      const followUpUser = { role: 'user' as const, content: 'Follow up.' };
      const result: any = constructCompletionPostRequest(noTemplateConfig, {
        messages: [userMessage, assistantMessage, toolMessage, followUpUser]
      });

      // messages before and including last tool go to messages_history in order
      expect(result.messages_history).toEqual([
        userMessage,
        assistantMessage,
        toolMessage
      ]);
      // only messages after the last tool stay in prompt.template
      expect(
        result.config.modules.prompt_templating.prompt.template
      ).toContainEqual(followUpUser);
      expect(
        result.config.modules.prompt_templating.prompt.template
      ).not.toContainEqual(toolMessage);
    });

    it('should emit messages_history when only messagesHistory is provided (no tool messages)', () => {
      const result = constructCompletionPostRequest(noTemplateConfig, {
        messages: [userMessage],
        messagesHistory: [assistantMessage]
      });

      expect(result.messages_history).toEqual([assistantMessage]);
    });

    it('should not auto-route when config has a static prompt template', () => {
      // static template present → auto-routing disabled, tool message stays in prompt.template
      const result: any = constructCompletionPostRequest(defaultConfig, {
        messages: [assistantMessage, toolMessage, userMessage]
      });

      expect(result.messages_history).toBeUndefined();
      expect(
        result.config.modules.prompt_templating.prompt.template
      ).toContainEqual(toolMessage);
    });
  });
});
