import { constructCompletionPostRequestFromJsonModuleConfig } from './util/completion-request-builder.ts';

import type { ChatCompletionRequest } from './orchestration-types.ts';

describe('construct completion post request from JSON', () => {
  it('should construct completion post request from JSON', () => {
    const jsonConfig = `{
      "modules": {
        "prompt_templating": {
          "model": {
            "name": "gpt-5.4-nano",
            "params": {
              "max_tokens": 50
            }
          },
          "prompt": {
            "template": [{ "role": "user", "content": "Hello!" }]
          }
        }
      }
    }`;

    const expectedCompletionPostRequestFromJson: Record<string, any> = {
      placeholder_values: {},
      messages_history: [],
      config: JSON.parse(jsonConfig)
    };

    const completionPostRequestFromJson: Record<string, any> =
      constructCompletionPostRequestFromJsonModuleConfig(
        JSON.parse(jsonConfig)
      );

    expect(expectedCompletionPostRequestFromJson).toEqual(
      completionPostRequestFromJson
    );
  });

  it('should construct completion post request from JSON with input params and message history', () => {
    const jsonConfig = `{
      "modules": {
        "prompt_templating": {
          "model": {
            "name": "gpt-5.4-nano",
            "params": {
              "max_tokens": 50
            }
          },
          "prompt": {
            "template": [
              {
                "role": "user",
                "content": "Give me {{?number}} words that rhyme with my name."
              }
            ]
          }
        }
      }
    }`;
    const placeholderValues = { number: '3' };

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

    const expectedCompletionPostRequestFromJson: Record<string, any> = {
      placeholder_values: placeholderValues,
      messages_history: messagesHistory,
      config: JSON.parse(jsonConfig)
    };

    const completionPostRequestFromJson: Record<string, any> =
      constructCompletionPostRequestFromJsonModuleConfig(
        JSON.parse(jsonConfig),
        {
          placeholderValues,
          messagesHistory
        }
      );

    expect(expectedCompletionPostRequestFromJson).toEqual(
      completionPostRequestFromJson
    );
  });

  describe('request-level prompt with JSON config', () => {
    const modelConfig = {
      model: { name: 'gpt-5.4-nano' }
    };
    const requestPrompt = {
      template: [{ role: 'user' as const, content: 'Current turn' }]
    };

    it('injects a request-level prompt when the JSON config has no existing prompt', () => {
      const jsonConfig = {
        modules: {
          prompt_templating: modelConfig
        }
      };
      const request: ChatCompletionRequest = { prompt: requestPrompt };

      const result = constructCompletionPostRequestFromJsonModuleConfig(
        jsonConfig,
        request
      );

      expect(result.config.modules.prompt_templating.prompt).toEqual(
        requestPrompt
      );
    });

    it('injects a request-level prompt into every module in a fallback list', () => {
      const jsonConfig = {
        modules: [
          { prompt_templating: modelConfig },
          { prompt_templating: { model: { name: 'gpt-4o' } } }
        ]
      };
      const request: ChatCompletionRequest = { prompt: requestPrompt };

      const result = constructCompletionPostRequestFromJsonModuleConfig(
        jsonConfig,
        request
      );

      for (const mod of result.config.modules) {
        expect(mod.prompt_templating.prompt).toEqual(requestPrompt);
      }
    });

    it('throws when a JSON config module already has prompt_templating.prompt', () => {
      const jsonConfig = {
        modules: {
          prompt_templating: {
            ...modelConfig,
            prompt: { template: [{ role: 'user', content: 'Hello!' }] }
          }
        }
      };
      const request: ChatCompletionRequest = { prompt: requestPrompt };

      expect(() =>
        constructCompletionPostRequestFromJsonModuleConfig(jsonConfig, request)
      ).toThrowError(/prompt/i);
    });

    it('throws when any module in a fallback list already has prompt_templating.prompt', () => {
      const jsonConfig = {
        modules: [
          { prompt_templating: modelConfig },
          {
            prompt_templating: {
              ...modelConfig,
              prompt: { template: [{ role: 'user', content: 'Hello!' }] }
            }
          }
        ]
      };
      const request: ChatCompletionRequest = { prompt: requestPrompt };

      expect(() =>
        constructCompletionPostRequestFromJsonModuleConfig(jsonConfig, request)
      ).toThrowError(/prompt/i);
    });

    it('routes messagesHistory when injecting a request-level prompt', () => {
      const jsonConfig = {
        modules: { prompt_templating: modelConfig }
      };
      const messagesHistory = [
        { role: 'user' as const, content: 'Prior message' }
      ];
      const request: ChatCompletionRequest = {
        prompt: requestPrompt,
        messagesHistory
      };

      const result = constructCompletionPostRequestFromJsonModuleConfig(
        jsonConfig,
        request
      );

      expect(result.messages_history).toEqual(messagesHistory);
      expect(result.config.modules.prompt_templating.prompt).toEqual(
        requestPrompt
      );
    });

    it('throws when both prompt and messages are set in the request', () => {
      const jsonConfig = {
        modules: { prompt_templating: modelConfig }
      };
      const request: ChatCompletionRequest = {
        prompt: requestPrompt,
        messages: [{ role: 'user' as const, content: 'Conflicting message' }]
      };

      expect(() =>
        constructCompletionPostRequestFromJsonModuleConfig(jsonConfig, request)
      ).toThrowError(/Cannot set both 'prompt' and 'messages'/);
    });

    it('throws when the request prompt is an unparsed string', () => {
      const jsonConfig = {
        modules: { prompt_templating: modelConfig }
      };
      const request = {
        prompt: 'An unparsed prompt'
      } as unknown as ChatCompletionRequest;

      expect(() =>
        constructCompletionPostRequestFromJsonModuleConfig(jsonConfig, request)
      ).toThrowError(/Prompt must be parsed/);
    });

    it('throws when the request prompt template is empty', () => {
      const jsonConfig = {
        modules: { prompt_templating: modelConfig }
      };
      const request: ChatCompletionRequest = { prompt: { template: [] } };

      expect(() =>
        constructCompletionPostRequestFromJsonModuleConfig(jsonConfig, request)
      ).toThrowError(/must contain at least one message/);
    });

    it('treats a null config prompt as absent and injects the request prompt', () => {
      const jsonConfig = {
        modules: {
          prompt_templating: { ...modelConfig, prompt: null }
        }
      };
      const request: ChatCompletionRequest = { prompt: requestPrompt };

      const result = constructCompletionPostRequestFromJsonModuleConfig(
        jsonConfig,
        request
      );

      expect(result.config.modules.prompt_templating.prompt).toEqual(
        requestPrompt
      );
    });

    it('throws a friendly error when modules is not an object or array', () => {
      const jsonConfig = { modules: 'invalid' };
      const request: ChatCompletionRequest = { prompt: requestPrompt };

      expect(() =>
        constructCompletionPostRequestFromJsonModuleConfig(jsonConfig, request)
      ).toThrow(/'modules' must be an object or array/);
    });

    it('throws a friendly error when a module lacks prompt_templating', () => {
      const jsonConfig = { modules: { other_field: {} } };
      const request: ChatCompletionRequest = { prompt: requestPrompt };

      expect(() =>
        constructCompletionPostRequestFromJsonModuleConfig(jsonConfig, request)
      ).toThrow(/each module's 'prompt_templating' must be an object/);
    });

    it("throws a friendly error when a module's prompt_templating is null", () => {
      const jsonConfig = { modules: { prompt_templating: null } };
      const request: ChatCompletionRequest = { prompt: requestPrompt };

      expect(() =>
        constructCompletionPostRequestFromJsonModuleConfig(jsonConfig, request)
      ).toThrow(/each module's 'prompt_templating' must be an object/);
    });

    it('validates the JSON config shape even without a request-level prompt', () => {
      const jsonConfig = { modules: 'invalid' };

      expect(() =>
        constructCompletionPostRequestFromJsonModuleConfig(jsonConfig)
      ).toThrow(/'modules' must be an object or array/);
    });

    it('validates each module has prompt_templating even without a request-level prompt', () => {
      const jsonConfig = { modules: { other_field: {} } };

      expect(() =>
        constructCompletionPostRequestFromJsonModuleConfig(jsonConfig)
      ).toThrow(/each module's 'prompt_templating' must be an object/);
    });
  });
});
