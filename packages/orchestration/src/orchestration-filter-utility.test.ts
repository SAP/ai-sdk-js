import { buildAzureContentFilter } from './orchestration-filter-utility.js';
import { constructCompletionPostRequest } from './orchestration-utils.js';
import type {
  CompletionPostRequest,
  FilteringModuleConfig
} from './client/api/schema/index.js';
import type { OrchestrationModuleConfig } from './orchestration-types.js';

describe('filter utility', () => {
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
      input: buildAzureContentFilter({ Hate: 4, SelfHarm: 0 })
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
      output: buildAzureContentFilter({ Sexual: 2, Violence: 6 })
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
        Hate: 4,
        SelfHarm: 0,
        Sexual: 2,
        Violence: 6
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
