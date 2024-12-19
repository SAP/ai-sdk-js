import { constructCompletionFromJson } from './orchestration-client.js';

describe('constructCompletionFromJSON()', () => {
  it('should accept a string orchestration config', () => {
    const jsonConfig: string = `{
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
    const result: Record<string, any> = constructCompletionFromJson(jsonConfig);

    expect(typeof jsonConfig).toBe('string');
    expect(result.orchestration_config).toBeDefined();
    expect(result.orchestration_config).toHaveProperty('module_configurations');
  });

  it('should throw an error when invalid JSON is provided', () => {
    const invalidJsonConfig = '{ "module_configurations": {}, ';

    expect(() => constructCompletionFromJson(invalidJsonConfig)).toThrow(
      'Could not parse JSON'
    );
  });

  it('with a JSON configuration and template params', () => {
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
                        "content": "Create {{?number}} paraphrases of {{?phrase}}"
                    }
                ]
              },
              "filtering_module_config": {
                "output": {
                    "filters": [
                        {
                            "type": "azure_content_safety",
                            "config": {
                                "Hate": 2,
                                "SelfHarm": 2,
                                "Sexual": 2,
                                "Violence": 2
                            }
                        }
                    ]
                }
              }
            }
        }`;
    const inputParams = { phrase: 'I hate you.', number: '3' };

    const expectedCompletionFromJson: Record<string, any> = {
      input_params: inputParams,
      messages_history: [],
      orchestration_config: JSON.parse(jsonConfig as string)
    };

    const completionFromJson: Record<string, any> = constructCompletionFromJson(
      jsonConfig,
      { inputParams }
    );

    expect(expectedCompletionFromJson).toEqual(completionFromJson);
  });

  it('with a JSON configuration and message history', () => {
    const jsonConfig: string = `{
            "module_configurations": {
                "llm_module_config": {
                    "model_name": "gpt-35-turbo-16k",
                    "model_params": {
                    "max_tokens": 50,
                    "temperature": 0.1
                    }
                },
                "templating_module_config": {
                    "template": [{ "role": "user", "content": "What's my name?" }]
                }
            }
        }`;

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

    const expectedCompletionFromJson: Record<string, any> = {
      input_params: {},
      messages_history: messagesHistory,
      orchestration_config: JSON.parse(jsonConfig as string)
    };

    const completionFromJson: Record<string, any> = constructCompletionFromJson(
      jsonConfig,
      { messagesHistory }
    );

    expect(expectedCompletionFromJson).toEqual(completionFromJson);
  });
});
