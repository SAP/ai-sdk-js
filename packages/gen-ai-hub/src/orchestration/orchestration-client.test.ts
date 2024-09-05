import nock from 'nock';
import {
  mockClientCredentialsGrantCall,
  mockDeploymentsList,
  mockInference,
  parseMockResponse
} from '../../../../test-util/mock-http.js';
import { CompletionPostResponse } from './client/api/index.js';
import {
  constructCompletionPostRequest,
  OrchestrationClient
} from './orchestration-client.js';
import { azureContentFilter } from './orchestration-filter-utility.js';

describe('orchestration service client', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
    mockDeploymentsList({ scenarioId: 'orchestration' }, { id: '1234' });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('calls chatCompletion with filter configuration supplied using convenience function', async () => {
    const config = {
      llmConfig: {
        model_name: 'gpt-35-turbo-16k',
        model_params: { max_tokens: 50, temperature: 0.1 }
      },
      templatingConfig: {
        template: [
          {
            role: 'user',
            content: 'Create {{?number}} paraphrases of {{?phrase}}'
          }
        ]
      },
      filterConfig: {
        input: azureContentFilter({ Hate: 4, SelfHarm: 2 }),
        output: azureContentFilter({ Sexual: 0, Violence: 4 })
      }
    };
    const prompt = {
      inputParams: { phrase: 'I hate you.', number: '3' }
    };
    const mockResponse = parseMockResponse<CompletionPostResponse>(
      'orchestration',
      'genaihub-chat-completion-filter-config.json'
    );

    mockInference(
      {
        data: constructCompletionPostRequest(config, prompt)
      },
      {
        data: mockResponse,
        status: 200
      },
      {
        url: 'inference/deployments/1234/completion'
      }
    );
    const response = await new OrchestrationClient(config).chatCompletion(
      prompt
    );
    expect(response).toEqual(mockResponse);
  });
});
