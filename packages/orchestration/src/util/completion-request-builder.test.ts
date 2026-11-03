import { isOrchestrationModuleConfigList } from '../orchestration-types.ts';
import {
  constructCompletionPostRequest,
  constructCompletionPostRequestFromConfigReference
} from './completion-request-builder.ts';

import type { CompletionRequestConfiguration } from '../client/api/schema/completion-request-configuration.ts';
import type { ModuleConfigs } from '../client/api/schema/index.ts';
import type {
  OrchestrationModuleConfig,
  OrchestrationConfigRef,
  ChatCompletionRequest,
  OrchestrationModuleConfigList
} from '../orchestration-types.ts';

describe('constructCompletionPostRequestFromConfigReference', () => {
  it('throws when a request-level prompt is combined with a config reference', () => {
    const configRef: OrchestrationConfigRef = {
      id: 'test-config-id'
    };
    const request: ChatCompletionRequest = {
      prompt: {
        template: [{ role: 'user', content: 'Current turn' }]
      }
    };

    expect(() =>
      constructCompletionPostRequestFromConfigReference(configRef, request)
    ).toThrowError(
      "Cannot set 'prompt' in the request when using a config reference. A config reference is single-turn and defines the template server-side. Use 'messagesHistory' for prior turns instead."
    );
  });

  it('constructs request with config reference by ID', () => {
    const configRef: OrchestrationConfigRef = {
      id: 'test-config-id'
    };

    const result = constructCompletionPostRequestFromConfigReference(configRef);

    expect(result).toEqual({
      config_ref: { id: 'test-config-id' },
      config: { stream: { enabled: false } }
    });
  });

  it('constructs request with config reference by ID and placeholder values', () => {
    const configRef: OrchestrationConfigRef = {
      id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    };
    const request: ChatCompletionRequest = {
      placeholderValues: { topic: 'AI', context: 'technology' }
    };

    const result = constructCompletionPostRequestFromConfigReference(
      configRef,
      request
    );

    expect(result).toEqual({
      config_ref: { id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
      config: { stream: { enabled: false } },
      placeholder_values: { topic: 'AI', context: 'technology' }
    });
  });

  it('constructs request with config reference by name/scenario/version', () => {
    const configRef: OrchestrationConfigRef = {
      scenario: 'foundation-models',
      name: 'my-orchestration-config',
      version: '1.0.0'
    };

    const result = constructCompletionPostRequestFromConfigReference(configRef);

    expect(result).toEqual({
      config_ref: {
        scenario: 'foundation-models',
        name: 'my-orchestration-config',
        version: '1.0.0'
      },
      config: { stream: { enabled: false } }
    });
  });

  it('constructs request with config reference by name and messages history', () => {
    const configRef: OrchestrationConfigRef = {
      scenario: 'customer-support',
      name: 'example-config',
      version: '0.0.1'
    };
    const request: ChatCompletionRequest = {
      messagesHistory: [
        { role: 'user', content: 'Previous question' },
        { role: 'assistant', content: 'Previous answer' }
      ]
    };

    const result = constructCompletionPostRequestFromConfigReference(
      configRef,
      request
    );

    expect(result).toEqual({
      config_ref: {
        scenario: 'customer-support',
        name: 'example-config',
        version: '0.0.1'
      },
      config: { stream: { enabled: false } },
      messages_history: [
        { role: 'user', content: 'Previous question' },
        { role: 'assistant', content: 'Previous answer' }
      ]
    });
  });

  it('constructs request with both placeholder values and messages history', () => {
    const configRef: OrchestrationConfigRef = {
      id: 'test-id'
    };
    const request: ChatCompletionRequest = {
      placeholderValues: { key: 'value' },
      messagesHistory: [{ role: 'user', content: 'test message' }]
    };

    const result = constructCompletionPostRequestFromConfigReference(
      configRef,
      request
    );

    expect(result).toEqual({
      config_ref: { id: 'test-id' },
      config: { stream: { enabled: false } },
      placeholder_values: { key: 'value' },
      messages_history: [{ role: 'user', content: 'test message' }]
    });
  });

  it('passes config to the request with stream.enabled=false', () => {
    const configRef: OrchestrationConfigRef = {
      id: 'test-id',
      overrideConfig: {
        modules: {
          prompt_templating: {
            model: {
              name: 'gpt-5.4-nano',
              version: '1',
              params: {}
            }
          }
        }
      }
    };

    const result = constructCompletionPostRequestFromConfigReference(configRef);

    expect(result).toEqual({
      config_ref: { id: 'test-id' },
      config: {
        modules: {
          prompt_templating: {
            model: {
              name: 'gpt-5.4-nano',
              version: '1',
              params: {}
            }
          }
        },
        stream: { enabled: false }
      }
    });
  });

  it('enables streaming when stream=true, no config', () => {
    const configRef: OrchestrationConfigRef = { id: 'test-id' };

    const result = constructCompletionPostRequestFromConfigReference(
      configRef,
      undefined,
      true
    );

    expect(result).toEqual({
      config_ref: { id: 'test-id' },
      config: { stream: { enabled: true } }
    });
  });

  it('enables streaming and merges with existing config stream field', () => {
    const configRef: OrchestrationConfigRef = {
      id: 'test-id',
      overrideConfig: {
        stream: { chunk_size: 50 }
      }
    };

    const result = constructCompletionPostRequestFromConfigReference(
      configRef,
      undefined,
      true
    );

    expect(result).toEqual({
      config_ref: { id: 'test-id' },
      config: { stream: { chunk_size: 50, enabled: true } }
    });
  });

  it('sets stream.enabled=false when stream=false and no config', () => {
    const configRef: OrchestrationConfigRef = { id: 'test-id' };

    const result = constructCompletionPostRequestFromConfigReference(
      configRef,
      undefined,
      false
    );

    expect(result).toEqual({
      config_ref: { id: 'test-id' },
      config: { stream: { enabled: false } }
    });
  });

  it('sets stream.enabled=false and preserves overrideConfig when stream=false', () => {
    const configRef: OrchestrationConfigRef = {
      id: 'test-id',
      overrideConfig: {
        stream: { chunk_size: 50 }
      }
    };

    const result = constructCompletionPostRequestFromConfigReference(
      configRef,
      undefined,
      false
    );

    expect(result).toEqual({
      config_ref: { id: 'test-id' },
      config: { stream: { chunk_size: 50, enabled: false } }
    });
  });
});

describe('constructCompletionPostRequest with module fallback configs', () => {
  const primaryConfig: OrchestrationModuleConfig = {
    promptTemplating: {
      prompt: {
        template: [{ role: 'user', content: 'Hello {{?name}}' }]
      },
      model: {
        name: 'gpt-5.4',
        timeout: 5,
        params: { max_tokens: 100 }
      }
    }
  };

  const fallbackConfig: OrchestrationModuleConfig = {
    promptTemplating: {
      prompt: {
        template: [{ role: 'user', content: 'Hello {{?name}}' }]
      },
      model: {
        name: 'gpt-5.4-nano',
        params: { max_tokens: 50 }
      }
    }
  };

  it('should construct request with single config (preserves single format)', () => {
    const request: ChatCompletionRequest = {
      placeholderValues: { name: 'World' }
    };

    const result = constructCompletionPostRequest(
      primaryConfig,
      request
    ) as CompletionRequestConfiguration;
    expect(isOrchestrationModuleConfigList(result.config.modules as any)).toBe(
      false
    );
    expect(
      (result.config.modules as ModuleConfigs).prompt_templating
    ).toBeDefined();
  });

  it('should construct request with module fallback config array (ModuleConfigsList)', () => {
    const fallbackList: OrchestrationModuleConfigList = [
      primaryConfig,
      fallbackConfig
    ];
    const request: ChatCompletionRequest = {
      placeholderValues: { name: 'World' }
    };

    const result = constructCompletionPostRequest(
      fallbackList,
      request
    ) as CompletionRequestConfiguration;

    // Array config should produce ModuleConfigs[]
    expect(Array.isArray(result.config.modules)).toBe(true);
    const modules = result.config.modules as ModuleConfigs[];
    expect(modules).toHaveLength(2);
    expect(modules[0].prompt_templating.model.name).toBe('gpt-5.4');
    expect(modules[1].prompt_templating.model.name).toBe('gpt-5.4-nano');
  });

  it('should apply request messages to each config in the module fallback array', () => {
    const fallbackList: OrchestrationModuleConfigList = [
      primaryConfig,
      fallbackConfig
    ];
    const request: ChatCompletionRequest = {
      messages: [{ role: 'user', content: 'Additional message' }]
    };

    const result = constructCompletionPostRequest(
      fallbackList,
      request
    ) as CompletionRequestConfiguration;

    const modules = result.config.modules as ModuleConfigs[];
    expect(
      (modules[0].prompt_templating.prompt as any).template
    ).toContainEqual({
      role: 'user',
      content: 'Additional message'
    });
    expect(
      (modules[1].prompt_templating.prompt as any).template
    ).toContainEqual({
      role: 'user',
      content: 'Additional message'
    });
  });

  it('should handle streaming with module fallback configs', () => {
    const fallbackList: OrchestrationModuleConfigList = [
      primaryConfig,
      fallbackConfig
    ];

    const result = constructCompletionPostRequest(
      fallbackList,
      undefined,
      true
    ) as CompletionRequestConfiguration;

    expect(result.config.stream?.enabled).toBe(true);
    const modules = result.config.modules as ModuleConfigs[];
    expect(Array.isArray(modules)).toBe(true);
    expect(modules).toHaveLength(2);
    // Stream options should be applied to each config
    expect(
      modules[0].prompt_templating.model.params?.stream_options
    ).toBeDefined();
    expect(
      modules[1].prompt_templating.model.params?.stream_options
    ).toBeDefined();
  });
});
