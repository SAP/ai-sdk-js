import { constructCompletionPostRequestFromJsonModuleConfig } from './util/module-config.js';

describe('construct completion post request from JSON', () => {
  it('should construct completion post request from JSON', () => {
    const jsonConfig = `{
      "modules": {
        "prompt_templating": {
          "model": {
            "name": "gpt-4o",
            "params": {
              "max_tokens": 50,
              "temperature": 0.1
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
            "name": "gpt-4o",
            "params": {
              "max_tokens": 50,
              "temperature": 0.1
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
});
