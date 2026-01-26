import { expectError, expectType, expectAssignable } from 'tsd';
import {
  OrchestrationClient,
  buildAzureContentSafetyFilter,
  buildDocumentGroundingConfig,
  buildLlamaGuard38BFilter,
  buildDpiMaskingProvider,
  buildTranslationConfig,
  isConfigReference
} from '@sap-ai-sdk/orchestration';
import type {
  ChatModel,
  LlmModelParams,
  OrchestrationResponse,
  GroundingModule,
  AzureContentSafetyFilterReturnType,
  AssistantChatMessage,
  TranslationReturnType,
  LlamaGuard38BFilterReturnType,
  OrchestrationConfigRef,
  OrchestrationStreamResponse,
  OrchestrationStreamChunkResponse
} from '@sap-ai-sdk/orchestration';
import type {
  CompletionPostResponse,
  TokenUsage,
  ChatMessages,
  DpiConfig,
  MessageToolCalls
} from '@sap-ai-sdk/orchestration/internal.js';

/**
 * Chat Completion.
 */
expectType<Promise<OrchestrationResponse>>(
  new OrchestrationClient({
    promptTemplating: {
      model: {
        name: 'gpt-4o'
      }
    }
  }).chatCompletion()
);

/**
 * Chat Completion with deploymentId.
 */
expectType<Promise<OrchestrationResponse>>(
  new OrchestrationClient(
    {
      promptTemplating: {
        model: {
          name: 'gpt-4o'
        }
      }
    },
    { deploymentId: 'deploymentId' }
  ).chatCompletion()
);

expectType<CompletionPostResponse>(
  (
    await new OrchestrationClient({
      promptTemplating: {
        model: {
          name: 'gpt-4o'
        },
        prompt: {
          defaults: { name: 'Bob' }
        }
      }
    }).chatCompletion({
      messages: [{ role: 'user', content: 'Hello! {{?name}}' }]
    })
  )._data
);

expectType<string | undefined>(
  (
    await new OrchestrationClient({
      promptTemplating: {
        model: {
          name: 'gpt-4o'
        },
        prompt: {
          template: [{ role: 'user', content: 'Hello!' }]
        }
      }
    }).chatCompletion()
  ).getContent()
);

expectType<string | undefined>(
  (
    await new OrchestrationClient({
      promptTemplating: {
        model: {
          name: 'gpt-4o'
        },
        prompt: {
          template: [{ role: 'user', content: 'Hello!' }]
        }
      }
    }).chatCompletion()
  ).getFinishReason()
);

expectType<TokenUsage>(
  (
    await new OrchestrationClient({
      promptTemplating: {
        model: {
          name: 'gpt-4o-mini'
        },
        prompt: {
          template: [{ role: 'user', content: 'Hello!' }]
        }
      }
    }).chatCompletion()
  ).getTokenUsage()
);

expectType<ChatMessages>(
  (
    await new OrchestrationClient({
      promptTemplating: {
        model: {
          name: 'gpt-4o-mini'
        },
        prompt: {
          template: [{ role: 'user', content: 'Hello!' }]
        }
      }
    }).chatCompletion()
  ).getAllMessages()
);

expectType<MessageToolCalls | undefined>(
  (
    await new OrchestrationClient({
      promptTemplating: {
        model: {
          name: 'gpt-4o-mini'
        },
        prompt: {
          template: [{ role: 'user', content: 'Hello!' }]
        }
      }
    }).chatCompletion()
  ).getToolCalls()
);

expectType<string | undefined>(
  (
    await new OrchestrationClient({
      promptTemplating: {
        model: {
          name: 'gpt-4o-mini'
        },
        prompt: {
          template: [{ role: 'user', content: 'Hello!' }]
        }
      }
    }).chatCompletion()
  ).getRefusal()
);

expectType<AssistantChatMessage | undefined>(
  (
    await new OrchestrationClient({
      promptTemplating: {
        model: {
          name: 'gpt-4o-mini'
        },
        prompt: {
          template: [{ role: 'user', content: 'Hello!' }]
        }
      }
    }).chatCompletion()
  ).getAssistantMessage()
);

expectType<Promise<OrchestrationResponse>>(
  new OrchestrationClient(
    {
      promptTemplating: {
        model: {
          name: 'gpt-4o'
        },
        prompt: {
          template: [{ role: 'user', content: 'Hello!' }]
        }
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
    promptTemplating: {
      model: {
        name: 'gpt-4o',
        params: { max_tokens: 50, temperature: 0.1 }
      },
      prompt: {
        template: [{ role: 'user', content: 'Hello!' }]
      }
    },
    filtering: {
      input: {
        filters: [
          {
            type: 'azure_content_safety',
            config: {
              hate: 0,
              self_harm: 2,
              sexual: 4,
              violence: 6
            }
          }
        ]
      },
      output: {
        filters: [
          {
            type: 'azure_content_safety',
            config: {
              hate: 6,
              self_harm: 4,
              sexual: 2,
              violence: 0
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
      placeholderValues: {
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
        "model_name": "gpt-4o",
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
 * Either template or template_ref should be provided in prompt.
 */
expectError<any>(
  new OrchestrationClient({
    promptTemplating: {
      model: {
        name: 'gpt-4o'
      },
      prompt: {
        template: [{ role: 'user', content: 'Hello!' }],
        template_ref: { id: 'template_id' }
      }
    }
  }).chatCompletion()
);

/**
 * Model_name is mandatory in llm_module_config.
 */
expectError<any>(
  new OrchestrationClient({
    promptTemplating: {
      model: {
        params: { max_tokens: 50 }
      },
      prompt: {
        template: [{ role: 'user', content: 'Hello!' }]
      }
    }
  }).chatCompletion()
);

/**
 * Template role should be predefined string literals.
 */
expectError<any>(
  new OrchestrationClient({
    promptTemplating: {
      model: {
        name: 'gpt-4o'
      },
      prompt: {
        template: [{ role: 'not-exist', content: 'Hello!' }]
      }
    }
  })
);

/**
 * Tool message should have tool_call_id.
 */
expectError<any>(
  new OrchestrationClient({
    promptTemplating: {
      model: {
        name: 'gpt-4o'
      },
      prompt: {
        template: [{ role: 'tool', content: 'Hello!' }]
      }
    }
  })
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
    promptTemplating: {
      model: {
        name: 'gpt-4o',
        params: {
          max_tokens: 50,
          temperature: 0.1,
          random_property: 'random - value'
        }
      },
      prompt: {
        template: [{ role: 'user', content: 'Hello!' }]
      }
    }
  }).chatCompletion()
);

expect<ChatModel>('custom-model');

/**
 * Filtering Util for Azure content safety.
 */
expectType<AzureContentSafetyFilterReturnType<'input'>>(
  buildAzureContentSafetyFilter('input', {
    hate: 'ALLOW_ALL',
    self_harm: 'ALLOW_SAFE_LOW',
    sexual: 'ALLOW_SAFE_LOW_MEDIUM',
    violence: 'ALLOW_SAFE',
    prompt_shield: true
  })
);

expectError<AzureContentSafetyFilterReturnType<'input'>>(
  buildAzureContentSafetyFilter('input', {
    hate: 2,
    self_harm: 4
  })
);

expectError<AzureContentSafetyFilterReturnType<'output'>>(
  buildAzureContentSafetyFilter('output', {
    hate: 'ALLOW_ALL',
    self_harm: 'ALLOW_SAFE_LOW',
    sexual: 'ALLOW_SAFE_LOW_MEDIUM',
    violence: 'ALLOW_SAFE',
    prompt_shield: true
  })
);

expectType<AzureContentSafetyFilterReturnType<'output'>>(
  buildAzureContentSafetyFilter('output', {
    hate: 'ALLOW_SAFE',
    protected_material_code: true
  })
);

expectError<AzureContentSafetyFilterReturnType<'input'>>(
  buildAzureContentSafetyFilter('input', {
    hate: 'ALLOW_SAFE',
    protected_material_code: true
  })
);

/**
 * Filtering Util for Llama guard.
 */
expectType<LlamaGuard38BFilterReturnType<'input'>>(
  buildLlamaGuard38BFilter('input', ['code_interpreter_abuse', 'defamation'])
);

expectType<LlamaGuard38BFilterReturnType<'output'>>(
  buildLlamaGuard38BFilter('output', ['elections'])
);

expectError<LlamaGuard38BFilterReturnType<'input'>>(
  buildLlamaGuard38BFilter('input')
);

expectError<LlamaGuard38BFilterReturnType<'input'>>(
  buildLlamaGuard38BFilter('input', 'unknown-string')
);

expectError<LlamaGuard38BFilterReturnType<'input'>>(
  buildLlamaGuard38BFilter('output', [])
);

/**
 * Grounding util.
 */
expectType<GroundingModule>(
  buildDocumentGroundingConfig({
    placeholders: {
      input: ['test'],
      output: 'test'
    }
  })
);

expectError<GroundingModule>(
  buildDocumentGroundingConfig({
    placeholders: {
      input: ['test']
    }
  })
);

expectType<GroundingModule>(
  buildDocumentGroundingConfig({
    placeholders: {
      input: ['test'],
      output: 'test'
    },
    filters: [{ id: 'test' }]
  })
);

/**
 * Translation util.
 */
expectType<TranslationReturnType<'input'>>(
  buildTranslationConfig('input', {
    sourceLanguage: 'de-DE',
    targetLanguage: 'en-US'
  })
);

expectType<TranslationReturnType<'output'>>(
  buildTranslationConfig('output', {
    sourceLanguage: 'en-US',
    targetLanguage: 'fr-FR'
  })
);

expectError<TranslationReturnType<'input'>>(buildTranslationConfig('input'));

expectError<TranslationReturnType<'input'>>(
  buildTranslationConfig('input', {
    sourceLanguage: 'de-DE'
  })
);

expectError<TranslationReturnType<'input'>>(
  buildTranslationConfig('input', {})
);

expectError<TranslationReturnType<'input'>>(
  buildTranslationConfig('unknown-type', {
    sourceLanguage: 'de-DE',
    targetLanguage: 'en-US'
  })
);

/**
 * Masking util.
 */
expectType<DpiConfig>(
  buildDpiMaskingProvider({
    method: 'anonymization',
    entities: ['profile-address'],
    allowlist: ['SAP', 'Joule'],
    mask_grounding_input: false
  })
);

expectError<DpiConfig>(
  buildDpiMaskingProvider({
    method: 'anonymization',
    entities: []
  })
);

/**
 * Translation config with applyTo selector for placeholders.
 */
expectType<TranslationReturnType<'input'>>(
  buildTranslationConfig('input', {
    sourceLanguage: 'de-DE',
    targetLanguage: 'en-US',
    applyTo: [
      {
        category: 'placeholders',
        items: ['user_input', 'context'],
        sourceLanguage: 'de-DE'
      }
    ]
  })
);

/**
 * Config Reference Types.
 */
expectAssignable<OrchestrationConfigRef>({
  id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
});

expectAssignable<OrchestrationConfigRef>({
  scenario: 'foundation-models',
  name: 'my-orchestration-config',
  version: '1.0.0'
});

/**
 * Config reference cannot have both ID and name/scenario/version (Xor enforcement).
 */
expectError<OrchestrationConfigRef>({
  id: 'some-id',
  scenario: 'foundation-models',
  name: 'my-orchestration-config',
  version: '1.0.0'
});

/**
 * Config reference by name requires all three fields: scenario, name, version.
 */
expectError<OrchestrationConfigRef>({
  scenario: 'foundation-models',
  name: 'my-orchestration-config'
});

expectError<OrchestrationConfigRef>({
  name: 'my-orchestration-config',
  version: '1.0.0'
});

/**
 * Empty config reference should be an error.
 */
expectError<OrchestrationConfigRef>({});

/**
 * Chat Completion with Config References.
 */

expectType<Promise<OrchestrationResponse>>(
  new OrchestrationClient({
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
  }).chatCompletion()
);

expectType<Promise<OrchestrationResponse>>(
  new OrchestrationClient({
    scenario: 'foundation-models',
    name: 'my-orchestration-config',
    version: '1.0.0'
  }).chatCompletion()
);

expectType<Promise<OrchestrationResponse>>(
  new OrchestrationClient({
    id: 'test-config-id'
  }).chatCompletion({
    placeholderValues: {
      topic: 'AI',
      context: 'technology'
    }
  })
);

expectType<Promise<OrchestrationResponse>>(
  new OrchestrationClient({
    id: 'test-config-id'
  }).chatCompletion({
    placeholderValues: { name: 'Alice' },
    messagesHistory: [
      { role: 'system', content: 'You are a helpful assistant.' }
    ]
  })
);

/**
 * Streaming with Config References.
 */
expectType<
  Promise<OrchestrationStreamResponse<OrchestrationStreamChunkResponse>>
>(
  new OrchestrationClient({
    id: 'test-config-id'
  }).stream()
);

expectType<
  Promise<OrchestrationStreamResponse<OrchestrationStreamChunkResponse>>
>(
  new OrchestrationClient({
    scenario: 'streaming-test',
    name: 'stream-config',
    version: '1.0.0'
  }).stream({
    placeholderValues: { topic: 'AI' }
  })
);

/**
 * isConfigReference function should be importable as a value (not just a type).
 */
expectType<boolean>(
  isConfigReference({
    id: 'test-config-id'
  })
);

expectType<boolean>(
  isConfigReference({
    scenario: 'foundation-models',
    name: 'my-orchestration-config',
    version: '1.0.0'
  })
);

expectType<boolean>(
  isConfigReference({
    promptTemplating: {
      model: {
        name: 'gpt-4o'
      }
    }
  })
);
