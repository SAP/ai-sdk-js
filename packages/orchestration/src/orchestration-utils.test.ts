import { createLogger } from '@sap-cloud-sdk/util';
import { jest } from '@jest/globals';
import {
  addStreamOptions,
  addStreamOptionsToLlmModuleConfig,
  addStreamOptionsToOutputFilteringConfig,
  buildAzureContentFilter,
  buildDocumentGroundingConfig,
  constructCompletionPostRequest
} from './orchestration-utils.js';
import {
  type OrchestrationModuleConfig,
  type DocumentGroundingServiceConfig,
  type StreamOptions,
  AzureFilterThreshold
} from './orchestration-types.js';
import type {
  CompletionPostRequest,
  FilteringModuleConfig,
  ModuleConfigs,
  OrchestrationConfig
} from './client/api/schema/index.js';

describe('orchestration utils', () => {
  describe('stream util tests', () => {
    const defaultOrchestrationModuleConfig: OrchestrationModuleConfig = {
      llm: {
        model_name: 'gpt-35-turbo-16k',
        model_params: { max_tokens: 50, temperature: 0.1 }
      },
      templating: {
        template: [
          { role: 'user', content: 'Create paraphrases of {{?phrase}}' }
        ]
      }
    };

    const defaultModuleConfigs: ModuleConfigs = {
      llm_module_config: defaultOrchestrationModuleConfig.llm,
      templating_module_config: defaultOrchestrationModuleConfig.templating
    };

    const defaultStreamOptions: StreamOptions = {
      global: { chunk_size: 100 },
      llm: { include_usage: false },
      outputFiltering: { overlap: 100 }
    };

    it('should add include_usage to llm module config', () => {
      const llmConfig = addStreamOptionsToLlmModuleConfig(
        defaultOrchestrationModuleConfig.llm
      );
      expect(llmConfig.model_params?.stream_options).toEqual({
        include_usage: true
      });
    });

    it('should set include_usage to false in llm module config', () => {
      const llmConfig = addStreamOptionsToLlmModuleConfig(
        defaultOrchestrationModuleConfig.llm,
        defaultStreamOptions
      );
      expect(llmConfig.model_params?.stream_options).toEqual({
        include_usage: false
      });
    });

    it('should not add any stream options to llm module config', () => {
      const llmConfig = addStreamOptionsToLlmModuleConfig(
        defaultOrchestrationModuleConfig.llm,
        {
          llm: null
        }
      );
      expect(
        Object.keys(llmConfig.model_params ?? {}).every(
          key => key !== 'stream_options'
        )
      ).toBe(true);
    });

    it('should add stream options to output filtering config', () => {
      const config: OrchestrationModuleConfig = {
        ...defaultOrchestrationModuleConfig,
        filtering: {
          output: buildAzureContentFilter({ Hate: 4, SelfHarm: 0 })
        }
      };
      const filteringConfig = addStreamOptionsToOutputFilteringConfig(
        config.filtering!.output!,
        defaultStreamOptions.outputFiltering!
      );
      expect(filteringConfig.filters).toEqual(
        config.filtering?.output?.filters
      );
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

      const config = addStreamOptions(
        defaultModuleConfigs,
        defaultStreamOptions
      );

      expect(warnSpy).toHaveBeenCalledWith(
        'Output filter stream options are not applied because filtering module is not configured.'
      );
      expect(
        config.module_configurations.filtering_module_config
      ).toBeUndefined();
    });
  });

  describe('azure filter', () => {
    const config: OrchestrationModuleConfig = {
      llm: {
        model_name: 'gpt-35-turbo-16k',
        model_params: { max_tokens: 50, temperature: 0.1 }
      },
      templating: {
        template: [
          { role: 'user', content: 'Create {number} paraphrases of {phrase}' }
        ]
      }
    };
    const prompt = { inputParams: { phrase: 'I hate you.', number: '3' } };

    afterEach(() => {
      config.filtering = undefined;
    });

    it('constructs filter configuration with only input', async () => {
      const filtering: FilteringModuleConfig = {
        input: buildAzureContentFilter({
          Hate: AzureFilterThreshold.ALLOW_SAFE_LOW_MEDIUM,
          SelfHarm: AzureFilterThreshold.ALLOW_SAFE
        })
      };
      const expectedFilterConfig: FilteringModuleConfig = {
        input: {
          filters: [
            {
              type: 'azure_content_safety',
              config: {
                Hate: 4,
                SelfHarm: 0
              }
            }
          ]
        }
      };
      config.filtering = filtering;
      const completionPostRequest: CompletionPostRequest =
        constructCompletionPostRequest(config, prompt);
      expect(
        completionPostRequest.orchestration_config.module_configurations
          .filtering_module_config
      ).toEqual(expectedFilterConfig);
    });

    it('constructs filter configuration with only output', async () => {
      const filtering: FilteringModuleConfig = {
        output: buildAzureContentFilter({
          Sexual: AzureFilterThreshold.ALLOW_SAFE_LOW,
          Violence: AzureFilterThreshold.ALLOW_ALL
        })
      };
      const expectedFilterConfig: FilteringModuleConfig = {
        output: {
          filters: [
            {
              type: 'azure_content_safety',
              config: {
                Sexual: 2,
                Violence: 6
              }
            }
          ]
        }
      };
      config.filtering = filtering;
      const completionPostRequest: CompletionPostRequest =
        constructCompletionPostRequest(config, prompt);
      expect(
        completionPostRequest.orchestration_config.module_configurations
          .filtering_module_config
      ).toEqual(expectedFilterConfig);
    });

    it('constructs filter configuration with both input and output', async () => {
      const filtering: FilteringModuleConfig = {
        input: buildAzureContentFilter({
          Hate: AzureFilterThreshold.ALLOW_SAFE_LOW_MEDIUM,
          SelfHarm: AzureFilterThreshold.ALLOW_SAFE,
          Sexual: AzureFilterThreshold.ALLOW_SAFE_LOW,
          Violence: AzureFilterThreshold.ALLOW_ALL
        }),
        output: buildAzureContentFilter({ Sexual: 2, Violence: 6 })
      };
      const expectedFilterConfig: FilteringModuleConfig = {
        input: {
          filters: [
            {
              type: 'azure_content_safety',
              config: {
                Hate: 4,
                SelfHarm: 0,
                Sexual: 2,
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
                Sexual: 2,
                Violence: 6
              }
            }
          ]
        }
      };
      config.filtering = filtering;
      const completionPostRequest: CompletionPostRequest =
        constructCompletionPostRequest(config, prompt);
      expect(
        completionPostRequest.orchestration_config.module_configurations
          .filtering_module_config
      ).toEqual(expectedFilterConfig);
    });

    it('omits filters if not set', async () => {
      const filtering: FilteringModuleConfig = {
        input: buildAzureContentFilter(),
        output: buildAzureContentFilter()
      };
      config.filtering = filtering;
      const completionPostRequest: CompletionPostRequest =
        constructCompletionPostRequest(config, prompt);
      const expectedFilterConfig: FilteringModuleConfig = {
        input: {
          filters: [
            {
              type: 'azure_content_safety'
            }
          ]
        },
        output: {
          filters: [
            {
              type: 'azure_content_safety'
            }
          ]
        }
      };
      expect(
        completionPostRequest.orchestration_config.module_configurations
          .filtering_module_config
      ).toEqual(expectedFilterConfig);
    });

    it('omits filter configuration if not set', async () => {
      const filtering: FilteringModuleConfig = {};
      config.filtering = filtering;
      const completionPostRequest: CompletionPostRequest =
        constructCompletionPostRequest(config, prompt);
      expect(
        completionPostRequest.orchestration_config.module_configurations
          .filtering_module_config
      ).toBeUndefined();
    });

    it('throw error when configuring empty filter', async () => {
      const createFilterConfig = () => {
        {
          buildAzureContentFilter({});
        }
      };
      expect(createFilterConfig).toThrow(
        'Filter property cannot be an empty object'
      );
    });
  });
  describe('document grounding', () => {
    it('builds grounding configuration with minimal required properties', () => {
      const groundingConfig: DocumentGroundingServiceConfig = {
        filters: [
          {
            id: 'filter-id'
          }
        ],
        input_params: ['input'],
        output_param: 'output'
      };
      expect(buildDocumentGroundingConfig(groundingConfig)).toEqual({
        type: 'document_grounding_service',
        config: {
          filters: [
            {
              id: 'filter-id',
              data_repository_type: 'vector'
            }
          ],
          input_params: ['input'],
          output_param: 'output'
        }
      });
    });

    it('overrides default data repository type', () => {
      const groundingConfig: DocumentGroundingServiceConfig = {
        filters: [
          {
            id: 'filter-id',
            data_repositories: ['repo1', 'repo2'],
            data_repository_type: 'custom-type'
          }
        ],
        input_params: ['input'],
        output_param: 'output'
      };
      expect(buildDocumentGroundingConfig(groundingConfig)).toEqual({
        type: 'document_grounding_service',
        config: {
          filters: [
            {
              id: 'filter-id',
              data_repositories: ['repo1', 'repo2'],
              data_repository_type: 'custom-type'
            }
          ],
          input_params: ['input'],
          output_param: 'output'
        }
      });
    });
  });
});
