import {
  CompletionPostRequest,
  FilteringModuleConfig
} from './client/api/index.js';
import { constructCompletionPostRequest } from './orchestration-client.js';
import { azureContentFilter } from './orchestration-filter-utility.js';
import { OrchestrationCompletionParameters } from './orchestration-types.js';

describe('Filter utility', () => {
  const input: OrchestrationCompletionParameters = {
    llmConfig: {
      model_name: 'gpt-35-turbo-16k',
      model_params: { max_tokens: 50, temperature: 0.1 }
    },
    prompt: {
      template: [
        { role: 'user', content: 'Create {number} paraphrases of {phrase}' }
      ],
      template_params: { phrase: 'I hate you.', number: '3' }
    }
  };

  afterEach(() => {
    input.filterConfig = undefined;
  });

  it('constructs filter configuration with only input', async () => {
    const filterConfig: FilteringModuleConfig = {
      input: azureContentFilter({ Hate: 4, SelfHarm: 0 })
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
    input.filterConfig = filterConfig;
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(input);
    expect(
      completionPostRequest.orchestration_config.module_configurations
        .filtering_module_config
    ).toEqual(expectedFilterConfig);
  });

  it('constructs filter configuration with only output', async () => {
    const filterConfig: FilteringModuleConfig = {
      output: azureContentFilter({ Sexual: 2, Violence: 6 })
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
    input.filterConfig = filterConfig;
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(input);
    expect(
      completionPostRequest.orchestration_config.module_configurations
        .filtering_module_config
    ).toEqual(expectedFilterConfig);
  });

  it('constructs filter configuration with both input and ouput', async () => {
    const filterConfig: FilteringModuleConfig = {
      input: azureContentFilter({
        Hate: 4,
        SelfHarm: 0,
        Sexual: 2,
        Violence: 6
      }),
      output: azureContentFilter({ Sexual: 2, Violence: 6 })
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
    input.filterConfig = filterConfig;
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(input);
    expect(
      completionPostRequest.orchestration_config.module_configurations
        .filtering_module_config
    ).toEqual(expectedFilterConfig);
  });

  it('omits filters if not set', async () => {
    const filterConfig: FilteringModuleConfig = {
      input: azureContentFilter(),
      output: azureContentFilter()
    };
    input.filterConfig = filterConfig;
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(input);
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
    const filterConfig: FilteringModuleConfig = {};
    input.filterConfig = filterConfig;
    const completionPostRequest: CompletionPostRequest =
      constructCompletionPostRequest(input);
    expect(
      completionPostRequest.orchestration_config.module_configurations
        .filtering_module_config
    ).toBeUndefined();
  });

  it('throw error when configuring empty filter', async () => {
    const createFilterConfig = () => {
      {
        azureContentFilter({});
      }
    };
    expect(createFilterConfig).toThrow(
      'Filter property cannot be an empty object'
    );
  });
});
