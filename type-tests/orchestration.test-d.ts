import { expectError, expectType } from 'tsd';
import { GenAiHubClient } from '../packages/gen-ai-hub/src/orchestration/orchestration-client.js';
import { CompletionPostResponse } from '../packages/gen-ai-hub/src/orchestration/index.js';

const client = new GenAiHubClient();
expectType<GenAiHubClient>(client);

/**
 * Chat Completion.
 */
expectType<Promise<CompletionPostResponse>>(
  client.chatCompletion({
    deploymentConfiguration: { deploymentId: 'id' },
    orchestration_config: {
      module_configurations: {
        templating_module_config: {
          template: [{ role: 'user', content: 'Hello!' }]
        },
        llm_module_config: {
          model_name: 'gpt-35-turbo-16k',
          model_params: {
            max_tokens: 50,
            temperature: 0.1
          }
        }
      }
    }
  })
);

/**
 * Chat Completion with the wrong ChatMessage role.
 */
expectError<Promise<CompletionPostResponse>>(
  client.chatCompletion({
    orchestration_config: {
      module_configurations: {
        templating_module_config: {
          template: [{ role: 'user', content: 'Hello!' }]
        },
        llm_module_config: {
          model_name: 'gpt-35-turbo-16k',
          model_params: {
            max_tokens: 50,
            temperature: 0.1
          }
        }
      }
    }
  })
);

/**
 * Input params should not be set by the user.
 */
expectError<Promise<CompletionPostResponse>>(
  client.chatCompletion({
    deploymentConfiguration: { deploymentId: 'id' },
    orchestration_config: {
      module_configurations: {
        templating_module_config: {
          template: [{ role: 'user', content: 'Hello!' }]
        },
        llm_module_config: {
          model_name: 'gpt-35-turbo-16k',
          model_params: {
            max_tokens: 50,
            temperature: 0.1
          }
        }
      }
    },
    input_params: {}
  })
);

/**
 * Orchestration_config cannot be empty.
 */
expectError<any>(
  client.chatCompletion({
    deploymentConfiguration: { deploymentId: 'id' },
    orchestration_config: {}
  })
);

/**
 * Templating_module_config cannot be empty.
 */
expectError<any>(
  client.chatCompletion({
    deploymentConfiguration: { deploymentId: 'id' },
    orchestration_config: {
      module_configurations: {
        templating_module_config: {},
        llm_module_config: {
          model_name: 'gpt-35-turbo-16k',
          model_params: {}
        }
      }
    }
  })
);

/**
 * Model_name is mandatory in llm_module_config.
 */
expectError<any>(
  client.chatCompletion({
    deploymentConfiguration: { deploymentId: 'id' },
    orchestration_config: {
      module_configurations: {
        templating_module_config: {
          template: [{ role: 'user', content: 'some content' }]
        },
        llm_module_config: {
          model_params: {
            max_tokens: 50
          }
        }
      }
    }
  })
);

expectError<any>(
  client.chatCompletion({
    deploymentConfiguration: { deploymentId: 'id' },
    orchestration_config: {
      module_configurations: {
        templating_module_config: {
          template: [{ role: 'test', content: 'some content' }]
        },
        llm_module_config: {
          model_name: 'gpt-35-turbo-16k',
          model_params: {
            max_tokens: 50
          }
        }
      }
    }
  })
);
