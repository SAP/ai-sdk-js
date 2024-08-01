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
    prompt: {
      template: [{ role: 'user', content: 'Hello!' }]
    },
    llmConfig: {
      model_name: 'gpt-35-turbo-16k',
      model_params: {}
    }
  })
);

/**
 * Chat Completion with optional parameters.
 */
expectType<Promise<CompletionPostResponse>>(
  client.chatCompletion({
    deploymentConfiguration: { deploymentId: 'id' },
    prompt: {
      template: [{ role: 'user', content: 'Hello!' }],
      messages_history: [
        {
          content:
            'You are a helpful assistant who remembers all details the user shares with you.',
          role: 'system'
        },
        {
          content: 'Hi! Im Bob',
          role: 'user'
        }
      ]
    },
    llmConfig: {
      model_name: 'gpt-35-turbo-16k',
      model_params: { max_tokens: 50, temperature: 0.1 }
    }
  })
);

/**
 * Deployment details are mandatory.
 */
expectError<Promise<CompletionPostResponse>>(
  client.chatCompletion({
    prompt: {
      template: [{ role: 'user', content: 'Hello!' }]
    },
    llmConfig: {
      model_name: 'gpt-35-turbo-16k',
      model_params: {}
    }
  })
);

/**
 * Orchestration completion parameters cannot be empty.
 */
expectError<any>(
  client.chatCompletion({
    deploymentConfiguration: { deploymentId: 'id' }
  })
);

/**
 * Prompt templates cannot be empty.
 */
expectError<any>(
  client.chatCompletion({
    deploymentConfiguration: { deploymentId: 'id' },
    llmConfig: {
      model_name: 'gpt-35-turbo-16k',
      model_params: {}
    }
  })
);

/**
 * Model_name is mandatory in llm_module_config.
 */
expectError<any>(
  client.chatCompletion({
    deploymentConfiguration: { deploymentId: 'id' },
    prompt: {
      template: [{ role: 'user', content: 'Hello!' }]
    },
    llmConfig: {
      model_params: {}
    }
  })
);

/**
 * Role in prompt template can only be user|assistant|system.
 */
expectError<any>(
  client.chatCompletion({
    deploymentConfiguration: { deploymentId: 'id' },
    prompt: {
      template: [{ role: 'actor', content: 'Hello!' }]
    },
    llmConfig: {
      model_name: 'gpt-35-turbo-16k',
      model_params: {}
    }
  })
);

/**
 * Model parameters should adhere to OrchestrationCompletionParameters.// Todo: Check if additional checks can be added for model_params.
 */
expectType<Promise<CompletionPostResponse>>(
  client.chatCompletion({
    deploymentConfiguration: { deploymentId: 'id' },
    prompt: {
      template: [{ role: 'user', content: 'Hello!' }]
    },
    llmConfig: {
      model_name: 'gpt-35-turbo-16k',
      model_params: {
        max_tokens: 50,
        temperature: 0.1,
        random_property: 'random - value'
      }
    }
  })
);
