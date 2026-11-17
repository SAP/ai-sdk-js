import { apiVersion } from '@sap-ai-sdk/foundation-models/internal.js';

import nock from 'nock';

import {
  aiCoreDestination,
  mockClientCredentialsGrantCall,
  mockDeploymentsList
} from '../../../../test-util/mock-http.ts';
import { dummyToken } from '../../../../test-util/mock-jwt.ts';
import { LcAzureOpenAi } from './lc-azure-openai.ts';

describe('LcAzureOpenAi', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('resolves the deployment and sends SAP AI Core headers', async () => {
    mockClientCredentialsGrantCall();
    mockDeploymentsList(
      {
        scenarioId: 'foundation-models',
        executableId: 'azure-openai'
      },
      {
        id: '1234',
        model: { name: 'gpt-5.4-nano', version: 'latest' },
        deploymentUrl: `${aiCoreDestination.url}/v2/inference/deployments/1234`
      }
    );

    const inference = nock(aiCoreDestination.url, {
      reqheaders: {
        authorization: `Bearer ${dummyToken}`,
        'ai-client-type': 'AI SDK JavaScript,langchain-test',
        'ai-resource-group': 'default'
      }
    })
      .post('/v2/inference/deployments/1234/chat/completions', body => {
        expect(body).toMatchObject({
          model: 'gpt-5.4-nano',
          messages: [{ role: 'user', content: 'Hello' }]
        });
        return true;
      })
      .query({ 'api-version': apiVersion })
      .reply(200, {
        id: 'completion-1',
        choices: [
          {
            message: { role: 'assistant', content: 'Hi' },
            index: 0,
            finish_reason: 'stop'
          }
        ],
        usage: {
          prompt_tokens: 1,
          completion_tokens: 1,
          total_tokens: 2
        }
      });

    const client = await LcAzureOpenAi.createClient({
      deployment: 'gpt-5.4-nano',
      clientType: 'langchain-test'
    });

    const response = await client.invoke('Hello');

    expect(response.text).toBe('Hi');
    expect(inference.isDone()).toBe(true);
  });
});
