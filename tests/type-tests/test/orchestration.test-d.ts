import { expectError, expectType, expectAssignable } from 'tsd';
import {
  OrchestrationClient,
  buildAzureContentSafetyFilter,
  buildDocumentGroundingConfig,
  buildLlamaGuardFilter
} from '@sap-ai-sdk/orchestration';
import type {
  CompletionPostResponse,
  OrchestrationResponse,
  TokenUsage,
  ChatModel,
  GroundingModuleConfig,
  LlmModelParams,
  AzureContentSafetyFilterConfig,
  LlamaGuard38BFilterConfig
} from '@sap-ai-sdk/orchestration';

/**
 * Chat Completion.
 */
expectType<Promise<OrchestrationResponse>>(
  new OrchestrationClient({
    templating: {
      template: [{ role: 'user', content: 'Hello!' }]
    },
    llm: {
      model_name: 'gpt-35-turbo-16k'
    }
  }).chatCompletion()
);

expectType<CompletionPostResponse>(
  (
    await new OrchestrationClient({
      templating: {
        template: [{ role: 'user', content: 'Hello!' }]
      },
      llm: {
        model_name: 'gpt-35-turbo-16k'
      }
    }).chatCompletion()
  ).data
);

expectType<string | undefined>(
  (
    await new OrchestrationClient({
      templating: {
        template: [{ role: 'user', content: 'Hello!' }]
      },
      llm: {
        model_name: 'gpt-35-turbo-16k'
      }
    }).chatCompletion()
  ).getContent()
);

expectType<string | undefined>(
  (
    await new OrchestrationClient({
      templating: {
        template: [{ role: 'user', content: 'Hello!' }]
      },
      llm: {
        model_name: 'gpt-35-turbo-16k'
      }
    }).chatCompletion()
  ).getFinishReason()
);

expectType<TokenUsage>(
  (
    await new OrchestrationClient({
      templating: {
        template: [{ role: 'user', content: 'Hello!' }]
      },
      llm: {
        model_name: 'gpt-35-turbo-16k'
      }
    }).chatCompletion()
  ).getTokenUsage()
);

expectType<Promise<OrchestrationResponse>>(
  new OrchestrationClient(
    {
      templating: {
        template: [{ role: 'user', content: 'Hello!' }]
      },
      llm: {
        model_name: 'gpt-35-turbo-16k'
      }
    },
    {
      resourceGroup: 'resourceGroup'
    },
    {
      destinationName: 'destinationName',
      useCache: false
    }
  ).chatCompletion()
);

/**
 * Chat Completion with optional parameters.
 */
expectType<Promise<OrchestrationResponse>>(
  new OrchestrationClient({
    templating: {
      template: [{ role: 'user', content: 'Hello!' }]
    },
    llm: {
      model_name: 'gpt-35-turbo-16k',
      model_params: { max_tokens: 50, temperature: 0.1 }
    },
    filtering: {
      input: {
        filters: [
          {
            type: 'azure_content_safety',
            config: {
              Hate: 0,
              SelfHarm: 2,
              Sexual: 4,
              Violence: 6
            }
          }
        ]
      },
      output: {
        filters: [
          {
            type: 'azure_content_safety',
            config: {
              Hate: 6,
              SelfHarm: 4,
              Sexual: 2,
              Violence: 0
            }
          }
        ]
      }
    }
  }).chatCompletion(
    {
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
        apiVersion: '2024-02-01'
      }
    }
  )
);

/**
 * Chat Completion with JSON configuration.
 */
expectType<Promise<OrchestrationResponse>>(
  new OrchestrationClient(`{
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
  }`).chatCompletion()
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
    llm: {
      model_name: 'gpt-35-turbo-16k'
    }
  }).chatCompletion()
);

/**
 * Model_name is mandatory in llm_module_config.
 */
expectError<any>(
  new OrchestrationClient({
    templating: {
      template: [{ role: 'user', content: 'Hello!' }]
    },
    llm: {
      model_params: { max_tokens: 50 }
    }
  }).chatCompletion()
);

/**
 * Model parameters should accept known typed parameters and arbitrary parameters.
 */
expectAssignable<LlmModelParams>({
  max_tokens: 50,
  temperature: 0.2,
  random_property: 'random - value'
});

/**
 * Model parameters should adhere to OrchestrationCompletionParameters.// Todo: Check if additional checks can be added for model_params.
 */
expectType<Promise<OrchestrationResponse>>(
  new OrchestrationClient({
    templating: {
      template: [{ role: 'user', content: 'Hello!' }]
    },
    llm: {
      model_name: 'gpt-35-turbo-16k',
      model_params: {
        max_tokens: 50,
        temperature: 0.1,
        random_property: 'random - value'
      }
    }
  }).chatCompletion()
);

expect<ChatModel>('custom-model');
expect<ChatModel>('gemini-1.0-pro');

/**
 * Filtering Util for Azure content safety.
 */

expectType<AzureContentSafetyFilterConfig>(
  buildAzureContentSafetyFilter({
    Hate: 'ALLOW_ALL',
    SelfHarm: 'ALLOW_SAFE_LOW',
    Sexual: 'ALLOW_SAFE_LOW_MEDIUM',
    Violence: 'ALLOW_SAFE'
  })
);

expectError<AzureContentSafetyFilterConfig>(
  buildAzureContentSafetyFilter({
    Hate: 2,
    SelfHarm: 4
  })
);

/**
 * Filtering Util for Llama guard.
 */

expectType<LlamaGuard38BFilterConfig>(
  buildLlamaGuardFilter('code_interpreter_abuse', 'defamation')
);

expectError<LlamaGuard38BFilterConfig>(buildLlamaGuardFilter());

expectError<LlamaGuard38BFilterConfig>(buildLlamaGuardFilter('unknown-string'));

/**
 * Grounding util.
 */
expectType<GroundingModuleConfig>(
  buildDocumentGroundingConfig({
    input_params: ['test'],
    output_param: 'test'
  })
);

expectError<GroundingModuleConfig>(
  buildDocumentGroundingConfig({
    input_params: ['test']
  })
);

expectType<GroundingModuleConfig>(
  buildDocumentGroundingConfig({
    input_params: ['test'],
    output_param: 'test',
    filters: [
      {
        id: 'test'
      }
    ]
  })
);
