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

expectError<any>(
  client.chatCompletion({
    deploymentConfiguration: { deploymentId: 'id' },
    orchestration_config: {}
  })
);

expectError<any>(
  client.chatCompletion({
    deploymentConfiguration: { deploymentId: 'id' },
    orchestration_config: {
      module_configurations: {
        templating_module_config: {},
        llm_module_config: {}
      }
    }
  })
);
