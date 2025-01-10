import { createLogger } from '@sap-cloud-sdk/util';
import { jest } from '@jest/globals';
import {
  addStreamOptions,
  addStreamOptionsToLlmModuleConfig,
  addStreamOptionsToOutputFilteringConfig
} from './orchestration-utils.js';
import { buildAzureContentFilter } from './orchestration-filter-utility.js';
import type {
  OrchestrationModuleConfig,
  StreamOptions
} from './orchestration-types.js';
import type {
  ModuleConfigs,
  OrchestrationConfig
} from './client/api/schema/index.js';

describe('construct completion post request', () => {
  const defaultConfig: OrchestrationModuleConfig = {
    llm: {
      model_name: 'gpt-35-turbo-16k',
      model_params: { max_tokens: 50, temperature: 0.1 }
    },
    templating: {
      template: [{ role: 'user', content: 'Create paraphrases of {{?phrase}}' }]
    }
  };

  const defaultModuleConfigs: ModuleConfigs = {
    llm_module_config: defaultConfig.llm,
    templating_module_config: defaultConfig.templating
  };

  const defaultStreamOptions: StreamOptions = {
    global: { chunk_size: 100 },
    llm: { include_usage: false },
    outputFiltering: { overlap: 100 }
  };

  it('should add include_usage to llm module config', () => {
    const llmConfig = addStreamOptionsToLlmModuleConfig(defaultConfig.llm);
    expect(llmConfig.model_params.stream_options).toEqual({
      include_usage: true
    });
  });

  it('should set include_usage to false in llm module config', () => {
    const llmConfig = addStreamOptionsToLlmModuleConfig(
      defaultConfig.llm,
      defaultStreamOptions
    );
    expect(llmConfig.model_params.stream_options).toEqual({
      include_usage: false
    });
  });

  it('should not add any stream options to llm module config', () => {
    const llmConfig = addStreamOptionsToLlmModuleConfig(defaultConfig.llm, {
      llm: null
    });
    expect(
      Object.keys(llmConfig.model_params).every(key => key !== 'stream_options')
    ).toBe(true);
  });

  it('should add stream options to output filtering config', () => {
    const config: OrchestrationModuleConfig = {
      ...defaultConfig,
      filtering: {
        output: buildAzureContentFilter({ Hate: 4, SelfHarm: 0 })
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
      filtering_module_config: {
        output: buildAzureContentFilter({ Hate: 4, SelfHarm: 0 })
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { llm, ...streamOptions } = defaultStreamOptions;

    const expectedOrchestrationConfig: OrchestrationConfig = {
      stream: true,
      stream_options: streamOptions.global,
      module_configurations: {
        ...config,
        llm_module_config: {
          ...config.llm_module_config,
          model_params: {
            ...config.llm_module_config.model_params,
            stream_options: { include_usage: true }
          }
        },
        filtering_module_config: {
          output: {
            ...config.filtering_module_config!.output!,
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
      config.module_configurations.filtering_module_config
    ).toBeUndefined();
  });
});
