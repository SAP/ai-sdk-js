import fs from 'fs';
import path from 'path';
import nock from 'nock';
import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import { BaseLlmParametersWithDeploymentId } from '../core/index.js';
import { mockGetAiCoreDestination } from '../../test-util/mock-context.js';
import { mockInference } from '../../test-util/mock-http.js';
import {
  GenAiHubClient,
  GenAiHubCompletionParameters
} from './orchestration-client.js';
import { CompletionPostResponse, ModuleConfigs } from './api/index.js';

describe('GenAiHubClient', () => {
  let destination: HttpDestination;
  let deploymentConfiguration: BaseLlmParametersWithDeploymentId;
  let client: GenAiHubClient;

  beforeAll(() => {
    deploymentConfiguration = {
      deploymentId: 'deployment-id'
    };
    destination = mockGetAiCoreDestination();
    client = new GenAiHubClient();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it(' calls chatCompletion and parses response', async () => {
    const module_configurations: ModuleConfigs = {
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
    };
    const request: GenAiHubCompletionParameters = {
      deploymentConfiguration,
      orchestration_config: { module_configurations }
    };

    const mockResponse = fs.readFileSync(
      path.join(
        'test-util',
        'mock-data',
        'orchestration',
        'genaihub-chat-completion-success-response.json'
      ),
      'utf-8'
    );

    mockInference(
      {
        data: { ...request, input_params: {} }
      },
      {
        data: JSON.parse(mockResponse),
        status: 200
      },
      destination,
      {
        url: 'completion'
      }
    );
    const result = await client.chatCompletion(request);
    const expectedResponse: CompletionPostResponse = JSON.parse(mockResponse);
    expect(result).toEqual(expectedResponse);
  });

  it('throws error for incorrect input parameters', async () => {
    const module_configurations: ModuleConfigs = {
      templating_module_config: {
        template: [{ role: 'actor', content: 'Hello' }]
      },
      llm_module_config: {
        model_name: 'gpt-35-turbo-16k',
        model_params: {
          max_tokens: 50,
          temperature: 0.1
        }
      }
    };
    const request: GenAiHubCompletionParameters = {
      deploymentConfiguration,
      orchestration_config: { module_configurations }
    };
    const mockResponse = fs.readFileSync(
      path.join(
        'test-util',
        'mock-data',
        'orchestration',
        'genaihub-error-response.json'
      ),
      'utf-8'
    );

    mockInference(
      {
        data: { ...request, input_params: {} }
      },
      {
        data: JSON.parse(mockResponse),
        status: 400
      },
      destination,
      {
        url: 'completion'
      }
    );
    await expect(client.chatCompletion(request)).rejects.toThrow();
  });
});
