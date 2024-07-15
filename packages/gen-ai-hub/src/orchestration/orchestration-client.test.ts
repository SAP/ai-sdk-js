import nock from 'nock';
import { CustomRequestConfig } from '../core/http-client.js';
import {
  GenAiHubClient,
  GenAiHubCompletionParameters
} from './orchestration-client.js';
import { CompletionPostResponse } from './api/schema/index.js';

describe('GenAiHubClient', () => {
  const response: CompletionPostResponse = {
    request_id: 'some_id',
    module_results: {},
    orchestration_result: {
      id: '',
      object: '',
      created: 123,
      model: 'gpt-35-turbo-16k',
      choices: [],
      usage: {
        completion_tokens: 123,
        prompt_tokens: 456,
        total_tokens: 789
      }
    }
  };

  const data: GenAiHubCompletionParameters = {
    deploymentConfiguration: { deploymentId: 'deploymentId' },
    orchestration_config: {
      module_configurations: {
        templating_module_config: {
          template: [{ role: 'user', content: 'Hello!' }]
        },
        llm_module_config: {
          model_name: 'gpt-35-turbo-16k',
          model_params: {
            max_tokens: 50,
            temperature: 0.1
          }
        }
      }
    }
  };
  const client = new GenAiHubClient();

  afterEach(() => {
    nock.cleanAll();
  });

  it('should successfully call chatCompletion and return response', async () => {
    nock('https://api.example.com', {
      reqheaders: {
        'ai-resource-group': 'default'
      }
    })
      .post('/completion', {
        ...data,
        input_params: {}
      } as any)
      .reply(200, response);

    const result = await client.chatCompletion(data);

    expect(result).toEqual(response);
  });

  it('calls chatCompletion with default + custom request config', async () => {
    const customRequestConfig: CustomRequestConfig = {
      headers: {
        'X-Custom-Header': 'CustomValue'
      }
    };

    nock('https://api.example.com', {
      reqheaders: {
        'ai-resource-group': 'default',
        'X-Custom-Header': 'CustomValue'
      }
    })
      .post('/completion', {
        ...data,
        input_params: {}
      } as any)
      .reply(200, response);

    const result = await client.chatCompletion(data, customRequestConfig);

    expect(result).toEqual(response);
  });

  it('should handle errors from chatCompletion', async () => {
    const errorMessage = 'Something went wrong';

    nock('https://api.example.com', {
      reqheaders: {
        'ai-resource-group': 'default'
      }
    })
      .post('/completion', {
        ...data,
        input_params: {}
      })
      .replyWithError(errorMessage);

    await expect(client.chatCompletion(data)).rejects.toThrow(errorMessage);
  });
});
