import { constructCompletionPostRequestFromJsonModuleConfig } from './orchestration-client.js';

describe('construct completion post request from JSON', () => {
  it('should throw an error when invalid JSON is provided', () => {
    const invalidJsonConfig = '{ "module_configurations": {}, ';

    expect(() =>
      constructCompletionPostRequestFromJsonModuleConfig(invalidJsonConfig)
    ).toThrow('Could not parse JSON');
  });

  it('should construct completion post request from JSON', () => {
    const jsonConfig = `{
      "module_configurations": {
          "llm_module_config": {
              "model_name": "gpt-35-turbo-16k",
              "model_params": {
                "max_tokens": 50,
                "temperature": 0.1
              }
          },
          "templating_module_config": {
              "template": [{ "role": "user", "content": "Hello!" }]
          }
          }
      }`;

    const expectedCompletionPostRequestFromJson: Record<string, any> = {
      input_params: {},
      messages_history: [],
      orchestration_config: JSON.parse(jsonConfig)
    };

    const completionPostRequestFromJson: Record<string, any> =
      constructCompletionPostRequestFromJsonModuleConfig(jsonConfig);

    expect(expectedCompletionPostRequestFromJson).toEqual(
      completionPostRequestFromJson
    );
  });

  it('should construct completion post request from JSON with input params and message history', () => {
    const jsonConfig = `{
            "module_configurations": {
              "llm_module_config": {
                "model_name": "gpt-35-turbo-16k",
                "model_params": {
                  "max_tokens": 50,
                  "temperature": 0.1
                }
              },
              "templating_module_config": {
                "template": [
                    {
                        "role": "user",
                        "content": "Give me {{?number}} words that rhyme with my name."
                    }
                ]
              }
            }
        }`;
    const inputParams = { number: '3' };

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

    const expectedCompletionPostRequestFromJson: Record<string, any> = {
      input_params: inputParams,
      messages_history: messagesHistory,
      orchestration_config: JSON.parse(jsonConfig)
    };

    const completionPostRequestFromJson: Record<string, any> =
      constructCompletionPostRequestFromJsonModuleConfig(jsonConfig, {
        inputParams,
        messagesHistory
      });

    expect(expectedCompletionPostRequestFromJson).toEqual(
      completionPostRequestFromJson
    );
  });
});
