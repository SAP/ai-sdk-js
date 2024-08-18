import { expectError, expectType } from 'tsd';
import {
  OrchestrationClient,
  CompletionPostResponse
} from '@sap-ai-sdk/gen-ai-hub';

const client = new OrchestrationClient();
expectType<OrchestrationClient>(client);

/**
 * Chat Completion.
 */
expectType<Promise<CompletionPostResponse>>(
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
 * Chat Completion with optional parameters.
 */
expectType<Promise<CompletionPostResponse>>(
  client.chatCompletion({
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
 * Orchestration completion parameters cannot be empty.
 */
expectError<any>(client.chatCompletion({}));

/**
 * Prompt templates cannot be empty.
 */
expectError<any>(
  client.chatCompletion({
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
    prompt: {
      template: [{ role: 'user', content: 'Hello!' }]
    },
    llmConfig: {
      model_params: {}
    }
  })
);

/**
 * Model parameters should adhere to OrchestrationCompletionParameters.// Todo: Check if additional checks can be added for model_params.
 */
expectType<Promise<CompletionPostResponse>>(
  client.chatCompletion({
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
