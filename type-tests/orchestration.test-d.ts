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
    prompt_templates: [{ role: 'user', content: 'Hello!' }],
    model_name: 'gpt-35-turbo-16k'
  })
);

/**
 * Chat Completion with optional parameters.
 */
expectType<Promise<CompletionPostResponse>>(
  client.chatCompletion({
    deploymentConfiguration: { deploymentId: 'id' },
    prompt_templates: [{ role: 'user', content: 'Hello!' }],
    model_name: 'gpt-35-turbo-16k',
    max_tokens: 50,
    temperature: 0.1,
    template_params: { input: 'Bob', name: 'Marley' },
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
  })
);

/**
 * Deployment details are mandatory.
 */
expectError<Promise<CompletionPostResponse>>(
  client.chatCompletion({
    prompt_templates: [{ role: 'user', content: 'Hello!' }],
    model_name: 'gpt-35-turbo-16k'
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
    model_name: 'gpt-35-turbo-16k'
  })
);

/**
 * Model_name is mandatory in llm_module_config.
 */
expectError<any>(
  client.chatCompletion({
    deploymentConfiguration: { deploymentId: 'id' },
    prompt_templates: [{ role: 'user', content: 'Hello!' }]
  })
);

/**
 * Role in prompt template can only be user|assistant|system.
 */
expectError<any>(
  client.chatCompletion({
    deploymentConfiguration: { deploymentId: 'id' },
    prompt_templates: [{ role: 'actor', content: 'Hello!' }],
    model_name: 'gpt-35-turbo-16k'
  })
);

/**
 * Model parameters should adhere to OrchestrationCompletionParameters.
 */
expectType<Promise<CompletionPostResponse>>(
  client.chatCompletion({
    deploymentConfiguration: { deploymentId: 'id' },
    prompt_templates: [{ role: 'user', content: 'Hello!' }],
    model_name: 'gpt-35-turbo-16k',
    max_tokens: '50',
    temperature: '0.1'
  })
);
