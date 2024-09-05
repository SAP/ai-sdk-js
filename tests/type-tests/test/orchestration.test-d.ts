import { expectError, expectType } from 'tsd';
import {
  OrchestrationClient,
  CompletionPostResponse
} from '@sap-ai-sdk/gen-ai-hub';

/**
 * Chat Completion.
 */
expectType<Promise<CompletionPostResponse>>(
  new OrchestrationClient({
    templatingConfig: {
      template: [{ role: 'user', content: 'Hello!' }]
    },
    llmConfig: {
      model_name: 'gpt-35-turbo-16k',
      model_params: {}
    }
  }).chatCompletion()
);

/**
 * Chat Completion with optional parameters.
 */
expectType<Promise<CompletionPostResponse>>(
  new OrchestrationClient({
    templatingConfig: {
      template: [{ role: 'user', content: 'Hello!' }]
    },
    llmConfig: {
      model_name: 'gpt-35-turbo-16k',
      model_params: { max_tokens: 50, temperature: 0.1 }
    },
    filterConfig: {
      input: {
        filters: [{
          type: 'azure_content_safety',
          config: {
            Hate: 0,
            SelfHarm: 2,
            Sexual: 4,
            Violence: 6
          }
        }]
      },
      output: {
        filters: [{
          type: 'azure_content_safety',
          config: {
            Hate: 6,
            SelfHarm: 4,
            Sexual: 2,
            Violence: 0
          }
        }]
      }
    }
  }).chatCompletion({
    messagesHistory: [
      {
        content:
          'You are a helpful assistant who remembers all details the user shares with you.',
        role: 'system'
      },
      {
        content: 'Hi! Im {{?name}}',
        role: 'user'
      }
    ],
    inputParams: {
      name: 'Bob'
    }
  },
    {
      params: {
        'apiVersion': '2024-02-01'
      }
    }
  )
);

/**
 * Orchestration completion parameters cannot be empty.
 */
expectError<any>(new OrchestrationClient({}).chatCompletion());

/**
 * Prompt templates cannot be empty.
 */
expectError<any>(
  new OrchestrationClient({
    llmConfig: {
      model_name: 'gpt-35-turbo-16k',
      model_params: {}
    }
  }).chatCompletion()
);

/**
 * Model_name is mandatory in llm_module_config.
 */
expectError<any>(
  new OrchestrationClient({
    templatingConfig: {
      template: [{ role: 'user', content: 'Hello!' }]
    },
    llmConfig: {
      model_params: {}
    }
  }).chatCompletion()
);

/**
 * Model parameters should adhere to OrchestrationCompletionParameters.// Todo: Check if additional checks can be added for model_params.
 */
expectType<Promise<CompletionPostResponse>>(
  new OrchestrationClient({
    templatingConfig: {
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
  }).chatCompletion()
);
