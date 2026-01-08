import { createLogger } from '@sap-cloud-sdk/util';
import { jest } from '@jest/globals';
import {
  addStreamOptions,
  addStreamOptionsToPromptTemplatingModuleConfig,
  addStreamOptionsToOutputFilteringConfig,
  constructCompletionPostRequestFromConfigReference
} from './module-config.js';
import { buildAzureContentSafetyFilter } from './filtering.js';
import type {
  ModuleConfigs,
  OrchestrationConfig,
  PromptTemplatingModuleConfig
} from '../client/api/schema/index.js';
import type {
  OrchestrationModuleConfig,
  OrchestrationConfigRef,
  ChatCompletionRequest,
  StreamOptions
} from '../orchestration-types.js';

describe('stream util tests', () => {
  const defaultOrchestrationModules: OrchestrationModuleConfig = {
    promptTemplating: {
      prompt: {
        template: [
          { role: 'user', content: 'Create paraphrases of {{?phrase}}' }
        ]
      },
      model: {
        name: 'gpt-4o',
        params: { max_tokens: 50, temperature: 0.1 }
      }
    }
  };

  const defaultModuleConfigs: ModuleConfigs = {
    prompt_templating:
      defaultOrchestrationModules.promptTemplating as PromptTemplatingModuleConfig
  };

  const defaultStreamOptions: StreamOptions = {
    global: { enabled: true, chunk_size: 100 },
    promptTemplating: { include_usage: false },
    outputFiltering: { overlap: 100 }
  };

  it('should add include_usage to prompt templating module config', () => {
    const promptTemplating = addStreamOptionsToPromptTemplatingModuleConfig(
      defaultModuleConfigs.prompt_templating
    );
    expect(promptTemplating.model.params?.stream_options).toEqual({
      include_usage: true
    });
  });

  it('should set include_usage to false in prompt templating module config', () => {
    const promptTemplating = addStreamOptionsToPromptTemplatingModuleConfig(
      defaultModuleConfigs.prompt_templating,
      defaultStreamOptions
    );
    expect(promptTemplating.model.params?.stream_options).toEqual({
      include_usage: false
    });
  });

  it('should not add any stream options to prompt templating module config', () => {
    const promptTemplating = addStreamOptionsToPromptTemplatingModuleConfig(
      defaultModuleConfigs.prompt_templating,
      {
        promptTemplating: null
      }
    );
    expect(
      Object.keys(promptTemplating.model.params ?? {}).every(
        key => key !== 'stream_options'
      )
    ).toBe(true);
  });

  it('should add stream options to output filtering config', () => {
    const config: OrchestrationModuleConfig = {
      ...defaultOrchestrationModules,
      filtering: {
        output: {
          filters: [
            buildAzureContentSafetyFilter('output', {
              hate: 'ALLOW_SAFE_LOW_MEDIUM',
              self_harm: 'ALLOW_SAFE'
            })
          ]
        }
      }
    };
    const filteringConfig = addStreamOptionsToOutputFilteringConfig(
      config.filtering!.output!,
      defaultStreamOptions.outputFiltering!
    );
    expect(filteringConfig.filters).toEqual(config.filtering?.output?.filters);
    expect(filteringConfig.stream_options).toEqual({
      overlap: 100
    });
  });

  it('should add stream options to orchestration config', () => {
    const config: ModuleConfigs = {
      ...defaultModuleConfigs,
      filtering: {
        output: {
          filters: [
            buildAzureContentSafetyFilter('output', {
              hate: 'ALLOW_SAFE_LOW_MEDIUM',
              self_harm: 'ALLOW_SAFE'
            })
          ]
        }
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { promptTemplating, ...streamOptions } = defaultStreamOptions;

    const expectedOrchestrationConfig: OrchestrationConfig = {
      stream: streamOptions.global,
      modules: {
        ...config,
        prompt_templating: {
          ...config.prompt_templating,
          model: {
            ...config.prompt_templating.model,
            params: {
              ...(config.prompt_templating.model.params || {}),
              stream_options: { include_usage: true }
            }
          }
        },
        filtering: {
          output: {
            ...config.filtering!.output!,
            stream_options: streamOptions.outputFiltering
          }
        }
      }
    };
    const orchestrationConfig = addStreamOptions(config, streamOptions);
    expect(orchestrationConfig).toEqual(expectedOrchestrationConfig);
  });

  it('should warn if no filter config was set, but streaming options were set', () => {
    const logger = createLogger({
      package: 'orchestration',
      messageContext: 'orchestration-utils'
    });

    const warnSpy = jest.spyOn(logger, 'warn');

    const config = addStreamOptions(defaultModuleConfigs, defaultStreamOptions);

    expect(warnSpy).toHaveBeenCalledWith(
      'Output filter stream options are not applied because filtering module is not configured.'
    );
    expect(config.modules.filtering).toBeUndefined();
  });
});

describe('constructCompletionPostRequestFromConfigReference', () => {
  it('constructs request with config reference by ID', () => {
    const configRef: OrchestrationConfigRef = {
      id: 'test-config-id'
    };

    const result = constructCompletionPostRequestFromConfigReference(configRef);

    expect(result).toEqual({
      config_ref: { id: 'test-config-id' }
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
      }
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
      placeholder_values: { key: 'value' },
      messages_history: [{ role: 'user', content: 'test message' }]
    });
  });
});
