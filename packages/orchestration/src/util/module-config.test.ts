import { createLogger } from '@sap-cloud-sdk/util';
import { jest } from '@jest/globals';
import {
  addStreamOptions,
  addStreamOptionsToPromptTemplatingModuleConfig,
  addStreamOptionsToOutputFilteringConfig
} from './module-config.js';
import { buildAzureContentSafetyFilter } from './filtering.js';
import type {
  ModuleConfigs,
  OrchestrationConfig,
  PromptTemplatingModuleConfig
} from '../client/api/schema/index.js';
import type {
  OrchestrationModuleConfig,
  StreamOptions
} from '../orchestration-types.js';

describe('stream util tests', () => {
  const defaultOrchestrationModuleConfig: OrchestrationModuleConfig = {
    prompt_templating: {
      prompt: {
        template: [{ role: 'user', content: 'Create paraphrases of {{?phrase}}' }]
      },
      model: {
        name: 'gpt-4o',
        params: { max_tokens: 50, temperature: 0.1 }
      }
    }
  };

  const defaultModuleConfigs: ModuleConfigs = {
    prompt_templating: defaultOrchestrationModuleConfig.prompt_templating as PromptTemplatingModuleConfig
  };

  const defaultStreamOptions: StreamOptions = {
    global: { enabled: true, chunk_size: 100 },
    prompt_templating: { include_usage: false },
    outputFiltering: { overlap: 100 }
  };

  it('should add include_usage to prompt templating module config', () => {
    const prompt_templating = addStreamOptionsToPromptTemplatingModuleConfig(
      defaultModuleConfigs.prompt_templating
    );
    expect(prompt_templating.model.params?.stream_options).toEqual({
      include_usage: true
    });
  });

  it('should set include_usage to false in prompt templating module config', () => {
    const prompt_templating = addStreamOptionsToPromptTemplatingModuleConfig(
      defaultModuleConfigs.prompt_templating,
      defaultStreamOptions
    );
    expect(prompt_templating.model.params?.stream_options).toEqual({
      include_usage: false
    });
  });

  it('should not add any stream options to prompt templating module config', () => {
    const prompt_templating = addStreamOptionsToPromptTemplatingModuleConfig(
      defaultModuleConfigs.prompt_templating,
      {
        prompt_templating: null
      }
    );
    expect(
      Object.keys(prompt_templating.model.params ?? {}).every(
        key => key !== 'stream_options'
      )
    ).toBe(true);
  });

  it('should add stream options to output filtering config', () => {
    const config: OrchestrationModuleConfig = {
      ...defaultOrchestrationModuleConfig,
      filtering: {
        output: {
          filters: [
            buildAzureContentSafetyFilter({
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
            buildAzureContentSafetyFilter({
              hate: 'ALLOW_SAFE_LOW_MEDIUM',
              self_harm: 'ALLOW_SAFE'
            })
          ]
        }
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { prompt_templating, ...streamOptions } = defaultStreamOptions;

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
    expect(
      config.modules.filtering
    ).toBeUndefined();
  });
});
