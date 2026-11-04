import { createLogger } from '@sap-cloud-sdk/util';

import {
  addStreamOptions,
  addStreamOptionsToOutputFilteringConfig,
  addStreamOptionsToPromptTemplatingModuleConfig
} from './completion-stream-options.ts';
import { buildAzureContentSafetyFilter } from './filtering.ts';

import type {
  ModuleConfigs,
  OrchestrationConfig,
  PromptTemplatingModuleConfig
} from '../client/api/schema/index.ts';
import type {
  OrchestrationModuleConfig,
  StreamOptions,
  ModuleStreamOptions
} from '../orchestration-types.ts';

describe('stream util tests', () => {
  const defaultOrchestrationModules: OrchestrationModuleConfig = {
    promptTemplating: {
      prompt: {
        template: [
          { role: 'user', content: 'Create paraphrases of {{?phrase}}' }
        ]
      },
      model: {
        name: 'gpt-5.4-nano',
        params: { max_tokens: 50 }
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

    // oxlint-disable-next-line no-unused-vars
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
              ...config.prompt_templating.model.params,
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

    const warnSpy = vi.spyOn(logger, 'warn');

    const config = addStreamOptions(defaultModuleConfigs, defaultStreamOptions);

    expect(warnSpy).toHaveBeenCalledWith(
      'Output filter stream options are not applied because no module configuration has output filtering enabled.'
    );
    expect((config.modules as ModuleConfigs).filtering).toBeUndefined();
  });
});

describe('addStreamOptions with module fallback configs', () => {
  const createModuleConfig = (modelName: string): ModuleConfigs => ({
    prompt_templating: {
      prompt: { template: [{ role: 'user', content: 'test' }] },
      model: { name: modelName, params: { max_tokens: 100 } }
    }
  });

  it('should add stream options to array of module configs', () => {
    const configs: ModuleConfigs[] = [
      createModuleConfig('gpt-5.4'),
      createModuleConfig('gpt-5.4-nano')
    ];

    const result = addStreamOptions(configs, {
      promptTemplating: {
        include_usage: true
      }
    });

    expect(result.stream?.enabled).toBe(true);
    expect(Array.isArray(result.modules)).toBe(true);
    const modules = result.modules as ModuleConfigs[];
    expect(modules).toHaveLength(2);
    expect(modules[0].prompt_templating.model.params?.stream_options).toEqual({
      include_usage: true
    });
    expect(modules[1].prompt_templating.model.params?.stream_options).toEqual({
      include_usage: true
    });
  });

  it('should apply global stream options to array configs', () => {
    const configs: ModuleConfigs[] = [
      createModuleConfig('gpt-5.4'),
      createModuleConfig('gpt-5.4-nano')
    ];
    const streamOptions: StreamOptions = {
      global: { chunk_size: 100 }
    };

    const result = addStreamOptions(configs, streamOptions);

    expect(result.stream).toEqual({ enabled: true, chunk_size: 100 });
  });

  it('should throw when overrides are provided for a single module config', () => {
    const config = createModuleConfig('gpt-5.4-nano');
    const streamOptions: StreamOptions = {
      overrides: {
        0: { promptTemplating: { include_usage: true } }
      }
    };

    expect(() => addStreamOptions(config, streamOptions)).toThrow(
      'Overrides in stream options are not supported when a single module configuration is provided.'
    );
  });

  it('should warn only once when output filtering options are set but no config has filtering', () => {
    const logger = createLogger({
      package: 'orchestration',
      messageContext: 'orchestration-utils'
    });
    const warnSpy = vi.spyOn(logger, 'warn');

    const configs: ModuleConfigs[] = [
      createModuleConfig('gpt-5.4'),
      createModuleConfig('gpt-5.4-nano')
    ];
    const streamOptions: StreamOptions = {
      outputFiltering: { overlap: 50 }
    };

    addStreamOptions(configs, streamOptions);

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      'Output filter stream options are not applied because no module configuration has output filtering enabled.'
    );
  });

  it('should warn for specific configs without output filtering when some configs have it', () => {
    const logger = createLogger({
      package: 'orchestration',
      messageContext: 'orchestration-utils'
    });
    const warnSpy = vi.spyOn(logger, 'warn');
    warnSpy.mockClear();

    const configWithFilter: ModuleConfigs = {
      prompt_templating: {
        prompt: { template: [{ role: 'user', content: 'test' }] },
        model: { name: 'gpt-5.4-nano', params: { max_tokens: 100 } }
      },
      filtering: {
        output: {
          filters: [
            buildAzureContentSafetyFilter('output', { hate: 'ALLOW_SAFE' })
          ]
        }
      }
    };

    const configs: ModuleConfigs[] = [
      createModuleConfig('gpt-5.4-nano'),
      configWithFilter
    ];
    const streamOptions: StreamOptions = {
      outputFiltering: { overlap: 50 }
    };

    addStreamOptions(configs, streamOptions);

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      'Output filter stream options will not be applied to configuration #1 because output filtering is not configured for those modules.'
    );
  });

  it('should not warn when all configs have output filtering', () => {
    const logger = createLogger({
      package: 'orchestration',
      messageContext: 'orchestration-utils'
    });
    const warnSpy = vi.spyOn(logger, 'warn');
    warnSpy.mockClear();

    const configWithFilter1: ModuleConfigs = {
      prompt_templating: {
        prompt: { template: [{ role: 'user', content: 'test' }] },
        model: { name: 'gpt-5.4-nano', params: { max_tokens: 100 } }
      },
      filtering: {
        output: {
          filters: [
            buildAzureContentSafetyFilter('output', { hate: 'ALLOW_SAFE' })
          ]
        }
      }
    };

    const configWithFilter2: ModuleConfigs = {
      prompt_templating: {
        prompt: { template: [{ role: 'user', content: 'test2' }] },
        model: { name: 'gpt-5.4-nano', params: { max_tokens: 50 } }
      },
      filtering: {
        output: {
          filters: [
            buildAzureContentSafetyFilter('output', { self_harm: 'ALLOW_SAFE' })
          ]
        }
      }
    };

    const configs: ModuleConfigs[] = [configWithFilter1, configWithFilter2];
    const streamOptions: StreamOptions = {
      outputFiltering: { overlap: 50 }
    };

    addStreamOptions(configs, streamOptions);

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('should handle structured stream options with overrides', () => {
    const configs: ModuleConfigs[] = [
      createModuleConfig('gpt-5.4'),
      createModuleConfig('gpt-5.4-nano')
    ];
    const streamOptions: StreamOptions = {
      global: { chunk_size: 100 },
      promptTemplating: { include_usage: false },
      overrides: {
        0: { promptTemplating: { include_usage: true } }
      }
    };

    const result = addStreamOptions(configs, streamOptions);

    expect(result.stream).toEqual({ enabled: true, chunk_size: 100 });
    const modules = result.modules as ModuleConfigs[];
    expect(modules[0].prompt_templating.model.params?.stream_options).toEqual({
      include_usage: true
    });
    expect(modules[1].prompt_templating.model.params?.stream_options).toEqual({
      include_usage: false
    });
  });

  it('should handle structured stream options with array-based overrides', () => {
    const configs: ModuleConfigs[] = [
      createModuleConfig('gpt-5.4'),
      createModuleConfig('gpt-5.4-nano'),
      createModuleConfig('claude-3'),
      createModuleConfig('claude-4')
    ];
    const streamOptions: StreamOptions = {
      global: { chunk_size: 100 },
      promptTemplating: { include_usage: false },
      overrides: [
        { promptTemplating: { include_usage: true } },
        { outputFiltering: { overlap: 50 } },
        { promptTemplating: { include_usage: true } },
        undefined
      ]
    };

    const result = addStreamOptions(configs, streamOptions);

    expect(result.stream).toEqual({ enabled: true, chunk_size: 100 });
    const modules = result.modules as ModuleConfigs[];
    expect(modules[0].prompt_templating.model.params?.stream_options).toEqual({
      include_usage: true
    });
    // Override at index 1 has no promptTemplating, so default include_usage is applied
    expect(modules[1].prompt_templating.model.params?.stream_options).toEqual({
      include_usage: true
    });
    expect(modules[2].prompt_templating.model.params?.stream_options).toEqual({
      include_usage: true
    });
    expect(modules[3].prompt_templating.model.params?.stream_options).toEqual({
      include_usage: false
    });
  });

  it('should handle sparse array-based overrides', () => {
    const configs: ModuleConfigs[] = [
      createModuleConfig('gpt-5.4'),
      createModuleConfig('gpt-5.4-nano'),
      createModuleConfig('claude-3'),
      createModuleConfig('claude-4')
    ];

    // Sparse overrides: only indices 0 and 3 set, others resolve to shared options
    const overridesArray: Partial<Record<number, ModuleStreamOptions>> = {};
    overridesArray[0] = { promptTemplating: { include_usage: true } };
    overridesArray[3] = { promptTemplating: { include_usage: true } };

    const streamOptions: StreamOptions = {
      promptTemplating: { include_usage: false },
      overrides: overridesArray
    };

    const result = addStreamOptions(configs, streamOptions);

    const modules = result.modules as ModuleConfigs[];
    expect(modules[0].prompt_templating.model.params?.stream_options).toEqual({
      include_usage: true
    });
    expect(modules[1].prompt_templating.model.params?.stream_options).toEqual({
      include_usage: false
    });
    expect(modules[2].prompt_templating.model.params?.stream_options).toEqual({
      include_usage: false
    });
    expect(modules[3].prompt_templating.model.params?.stream_options).toEqual({
      include_usage: true
    });
  });

  it('should warn for multiple non-consecutive configs without output filtering', () => {
    const logger = createLogger({
      package: 'orchestration',
      messageContext: 'orchestration-utils'
    });
    const warnSpy = vi.spyOn(logger, 'warn');
    warnSpy.mockClear();

    const configWithFilter: ModuleConfigs = {
      prompt_templating: {
        prompt: { template: [{ role: 'user', content: 'test' }] },
        model: { name: 'gpt-5.4-nano', params: { max_tokens: 100 } }
      },
      filtering: {
        output: {
          filters: [
            buildAzureContentSafetyFilter('output', { hate: 'ALLOW_SAFE' })
          ]
        }
      }
    };

    const configs: ModuleConfigs[] = [
      createModuleConfig('gpt-5.4'),
      configWithFilter,
      createModuleConfig('gpt-5.4-nano')
    ];
    const streamOptions: StreamOptions = {
      outputFiltering: { overlap: 50 }
    };

    addStreamOptions(configs, streamOptions);

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      'Output filter stream options will not be applied to configurations #1, #3 because output filtering is not configured for those modules.'
    );
  });

  it('should warn for structured stream options when config lacks output filtering', () => {
    const logger = createLogger({
      package: 'orchestration',
      messageContext: 'orchestration-utils'
    });
    const warnSpy = vi.spyOn(logger, 'warn');
    warnSpy.mockClear();

    const configWithFilter: ModuleConfigs = {
      prompt_templating: {
        prompt: { template: [{ role: 'user', content: 'test' }] },
        model: { name: 'gpt-5.4-nano', params: { max_tokens: 100 } }
      },
      filtering: {
        output: {
          filters: [
            buildAzureContentSafetyFilter('output', { hate: 'ALLOW_SAFE' })
          ]
        }
      }
    };

    const configs: ModuleConfigs[] = [
      createModuleConfig('gpt-5.4-nano'),
      configWithFilter
    ];

    const streamOptions: StreamOptions = {
      outputFiltering: { overlap: 50 },
      overrides: {
        1: { outputFiltering: { overlap: 100 } }
      }
    };

    addStreamOptions(configs, streamOptions);

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      'Output filter stream options will not be applied to configuration #1 because output filtering is not configured for those modules.'
    );
  });

  it('should not warn for structured stream options when all configs have output filtering', () => {
    const logger = createLogger({
      package: 'orchestration',
      messageContext: 'orchestration-utils'
    });
    const warnSpy = vi.spyOn(logger, 'warn');
    warnSpy.mockClear();

    const configWithFilter1: ModuleConfigs = {
      prompt_templating: {
        prompt: { template: [{ role: 'user', content: 'test' }] },
        model: { name: 'gpt-5.4-nano', params: { max_tokens: 100 } }
      },
      filtering: {
        output: {
          filters: [
            buildAzureContentSafetyFilter('output', { hate: 'ALLOW_SAFE' })
          ]
        }
      }
    };

    const configWithFilter2: ModuleConfigs = {
      prompt_templating: {
        prompt: { template: [{ role: 'user', content: 'test' }] },
        model: { name: 'gpt-5.4-nano', params: { max_tokens: 100 } }
      },
      filtering: {
        output: {
          filters: [
            buildAzureContentSafetyFilter('output', { violence: 'ALLOW_SAFE' })
          ]
        }
      }
    };

    const configs: ModuleConfigs[] = [configWithFilter1, configWithFilter2];

    const streamOptions: StreamOptions = {
      outputFiltering: { overlap: 50 },
      overrides: {
        1: { outputFiltering: { overlap: 100 } }
      }
    };

    addStreamOptions(configs, streamOptions);

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('should warn for all configs without output filtering when using structured stream options', () => {
    const logger = createLogger({
      package: 'orchestration',
      messageContext: 'orchestration-utils'
    });
    const warnSpy = vi.spyOn(logger, 'warn');
    warnSpy.mockClear();

    const configs: ModuleConfigs[] = [
      createModuleConfig('gpt-5.4'),
      createModuleConfig('gpt-5.4-nano')
    ];

    const streamOptions: StreamOptions = {
      outputFiltering: { overlap: 50 },
      overrides: {
        1: { outputFiltering: { overlap: 100 } }
      }
    };

    addStreamOptions(configs, streamOptions);

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      'Output filter stream options are not applied because no module configuration has output filtering enabled.'
    );
  });

  it('should only warn for configs with output filtering stream options but no filtering config', () => {
    const logger = createLogger({
      package: 'orchestration',
      messageContext: 'orchestration-utils'
    });
    const warnSpy = vi.spyOn(logger, 'warn');
    warnSpy.mockClear();

    const configs: ModuleConfigs[] = [
      createModuleConfig('gpt-5.4'),
      createModuleConfig('gpt-5.4-nano')
    ];

    const streamOptions: StreamOptions = {
      promptTemplating: { include_usage: true },
      overrides: {
        1: { outputFiltering: { overlap: 100 } }
      }
    };

    addStreamOptions(configs, streamOptions);

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      'Output filter stream options will not be applied to configuration #2 because output filtering is not configured for those modules.'
    );
  });
});

describe('warnAboutUnusedOverrides', () => {
  const createModuleConfig = (modelName: string): ModuleConfigs => ({
    prompt_templating: {
      prompt: { template: [{ role: 'user', content: 'test' }] },
      model: { name: modelName, params: { max_tokens: 100 } }
    }
  });

  it('should warn when override index is out of bounds', () => {
    const logger = createLogger({
      package: 'orchestration',
      messageContext: 'orchestration-utils'
    });
    const debugSpy = vi.spyOn(logger, 'debug');
    debugSpy.mockClear();

    const configs = [createModuleConfig('gpt-5.4-nano')];
    const streamOptions: StreamOptions = {
      overrides: {
        0: { promptTemplating: { include_usage: true } },
        1: { promptTemplating: { include_usage: false } },
        5: { promptTemplating: { include_usage: true } }
      }
    };

    addStreamOptions(configs, streamOptions);

    expect(debugSpy).toHaveBeenCalledWith(expect.stringContaining('1, 5'));
    expect(debugSpy).toHaveBeenCalledWith(
      expect.stringContaining('do not correspond to any module configuration')
    );
  });

  it('should warn for negative indices', () => {
    const logger = createLogger({
      package: 'orchestration',
      messageContext: 'orchestration-utils'
    });
    const debugSpy = vi.spyOn(logger, 'debug');
    debugSpy.mockClear();

    const configs = [
      createModuleConfig('gpt-5.4'),
      createModuleConfig('gpt-5.4-nano')
    ];
    const streamOptions = {
      overrides: {
        '-1': { promptTemplating: { include_usage: true } }
      }
    };

    addStreamOptions(configs, streamOptions);

    expect(debugSpy).toHaveBeenCalledWith(expect.stringContaining('-1'));
  });

  it('should warn for non-numeric keys', () => {
    const logger = createLogger({
      package: 'orchestration',
      messageContext: 'orchestration-utils'
    });
    const debugSpy = vi.spyOn(logger, 'debug');
    debugSpy.mockClear();

    const configs = [createModuleConfig('gpt-5.4-nano')];
    const streamOptions = {
      overrides: {
        invalid: { promptTemplating: { include_usage: true } }
      } as any
    };

    addStreamOptions(configs, streamOptions);

    expect(debugSpy).toHaveBeenCalledWith(expect.stringContaining('invalid'));
  });

  it('should warn for non-integer (float) number keys', () => {
    const logger = createLogger({
      package: 'orchestration',
      messageContext: 'orchestration-utils'
    });
    const debugSpy = vi.spyOn(logger, 'debug');
    debugSpy.mockClear();

    const configs = [createModuleConfig('gpt-5.4-nano')];
    const streamOptions = {
      overrides: {
        '0.5': { promptTemplating: { include_usage: true } }
      }
    };

    addStreamOptions(configs, streamOptions);

    expect(debugSpy).toHaveBeenCalledWith(expect.stringContaining('0.5'));
  });

  it('should not warn for valid override indices', () => {
    const logger = createLogger({
      package: 'orchestration',
      messageContext: 'orchestration-utils'
    });
    const debugSpy = vi.spyOn(logger, 'debug');
    debugSpy.mockClear();

    const configs = [
      createModuleConfig('gpt-5.4'),
      createModuleConfig('gpt-5.4-nano')
    ];
    const streamOptions: StreamOptions = {
      overrides: {
        0: { promptTemplating: { include_usage: true } },
        1: { promptTemplating: { include_usage: false } }
      }
    };

    addStreamOptions(configs, streamOptions);

    // Should not have warnings about unused overrides
    expect(debugSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('do not correspond to any module configuration')
    );
  });

  it('should warn when array overrides is shorter than config count', () => {
    const logger = createLogger({
      package: 'orchestration',
      messageContext: 'orchestration-utils'
    });
    const debugSpy = vi.spyOn(logger, 'debug');
    debugSpy.mockClear();

    const configs = [
      createModuleConfig('gpt-5.4'),
      createModuleConfig('gpt-5.4-nano'),
      createModuleConfig('claude-3')
    ];
    const streamOptions: StreamOptions = {
      overrides: [
        { promptTemplating: { include_usage: true } },
        { promptTemplating: { include_usage: false } }
        // Missing third element
      ]
    };

    addStreamOptions(configs, streamOptions);

    expect(debugSpy).toHaveBeenCalled();
    const debugMessage = debugSpy.mock.calls[0][0];
    expect(debugMessage).toContain('Override array has 2 element(s)');
    expect(debugMessage).toContain('but there are 3 module');
    expect(debugMessage).toContain('configuration(s)');
    expect(debugMessage).toContain('{...streamOptionsArray}');
  });

  it('should not warn when using object syntax for sparse overrides', () => {
    const logger = createLogger({
      package: 'orchestration',
      messageContext: 'orchestration-utils'
    });
    const debugSpy = vi.spyOn(logger, 'debug');
    debugSpy.mockClear();

    const configs = [
      createModuleConfig('gpt-5.4'),
      createModuleConfig('gpt-5.4-nano'),
      createModuleConfig('claude-3')
    ];

    // Explicitly using object syntax (spread array)
    const streamOptions: StreamOptions = {
      overrides: {
        0: { promptTemplating: { include_usage: true } },
        1: { promptTemplating: { include_usage: false } }
      }
    };

    addStreamOptions(configs, streamOptions);

    // Should not warn about array length
    expect(debugSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('Override array has')
    );
  });
});
