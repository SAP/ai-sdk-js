import { expectError, expectType, expectAssignable } from 'tsd';
import {
  OrchestrationClient,
  buildAzureContentSafetyFilter,
  buildDocumentGroundingConfig,
  buildLlamaGuard38BFilter,
  buildDpiMaskingProvider,
  buildTranslationConfig
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
  TranslationConfigParams,
  DocumentTranslationApplyToSelector,
  TranslationTargetLanguage
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
 * Test that new wrapper types are available and can be used.
 */
const selector: DocumentTranslationApplyToSelector = {
  category: 'placeholders',
  items: ['user_input'],
  source_language: 'de-DE'
};

const targetLang: TranslationTargetLanguage = 'en-US';

/**
 * Test buildTranslationConfig accepts the new targetLanguage types.
 */
expectType<TranslationReturnType<'input'>>(
  buildTranslationConfig('input', {
    targetLanguage: 'en-US'
  })
);

expectType<TranslationReturnType<'input'>>(
  buildTranslationConfig('input', {
    targetLanguage: selector
  })
);

expectType<TranslationReturnType<'output'>>(
  buildTranslationConfig('output', {
    targetLanguage: targetLang
  })
);

expectType<TranslationReturnType<'output'>>(
  buildTranslationConfig('output', {
    targetLanguage: {
      category: 'placeholders',
      items: ['assistant_response']
    }
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
 * Additional tests for DocumentTranslationApplyToSelector variations.
 */
const applyToSelector: DocumentTranslationApplyToSelector = {
  category: 'placeholders',
  items: ['user_input', 'retrieved_context'],
  source_language: 'fr-FR'
};

/**
 * Test that applyTo selectors are assignable.
 */
expectAssignable<DocumentTranslationApplyToSelector>(applyToSelector);

/**
 * Test error cases for invalid applyTo selectors.
 */
expectError<DocumentTranslationApplyToSelector>({ category: 'invalid' });

/**
 * Test chat completion with messagesHistory targeting specific message types.
 */
expectType<Promise<OrchestrationResponse>>(
  new OrchestrationClient({
    promptTemplating: {
      model: {
        name: 'gpt-4o'
      },
      prompt: {
        template: [{ role: 'user', content: 'Hello!' }]
      }
    },
    translation: {
      input: {
        type: 'sap_document_translation',
        config: {
          apply_to: [
            {
              category: 'template_roles',
              items: ['user'],
              source_language: 'en-US'
            }
          ],
          target_language: 'de-DE'
        }
      }
    }
  }).chatCompletion()
);

/**
 * Test translation config validation for messages_history selector.
 */
expectType<TranslationReturnType<'input'>>(
  buildTranslationConfig('input', {
    sourceLanguage: 'en-US',
    targetLanguage: 'de-DE',
    applyTo: [
      {
        category: 'template_roles',
        items: ['user'],
        source_language: 'en-US'
      }
    ]
  })
);

/**
 * Test invalid messages_history selector items.
 */
expectError<TranslationReturnType<'input'>>(
  buildTranslationConfig('input', {
    apply_to: {
      category: 'messages_history',
      items: ['invalid_role'],
      source_language: 'en-US'
    },
    target_language: 'fr-FR'
  })
);
