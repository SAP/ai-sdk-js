import nock from 'nock';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  mockClientCredentialsGrantCall,
  aiCoreDestination
} from '../../../test-util/mock-http.js';
import { SapAzureOpenAI } from './client.js';
import { SapChat } from './chat.js';
import { SapEmbeddings } from './embeddings.js';
import { SapResponses } from './responses.js';

function mockDeploymentWithUrl(
  opts: { scenarioId: string; executableId: string; resourceGroup?: string },
  deployment: { id: string; model: { name: string; version: string } }
): void {
  nock(aiCoreDestination.url, {
    reqheaders: { 'ai-resource-group': opts.resourceGroup ?? 'default' }
  })
    .get('/v2/lm/deployments')
    .query({
      status: 'RUNNING',
      scenarioId: opts.scenarioId,
      executableIds: opts.executableId
    })
    .reply(200, {
      resources: [
        {
          id: deployment.id,
          deploymentUrl: `${aiCoreDestination.url}/v2/inference/deployments/${deployment.id}`,
          details: {
            resources: {
              backendDetails: { model: deployment.model }
            }
          }
        }
      ]
    });
}

describe('SapAzureOpenAI', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
    mockDeploymentWithUrl(
      { scenarioId: 'foundation-models', executableId: 'azure-openai' },
      { id: 'dep-001', model: { name: 'gpt-4.1', version: 'latest' } }
    );
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('createClient', () => {
    it('exposes chat, embeddings and responses namespaces', async () => {
      const client = await SapAzureOpenAI.createClient({
        modelDeployment: 'gpt-4.1'
      });

      expect(client.chat).toBeInstanceOf(SapChat);
      expect(client.embeddings).toBeInstanceOf(SapEmbeddings);
      expect(client.responses).toBeInstanceOf(SapResponses);
    });

    it('resolves with a custom resource group', async () => {
      nock.cleanAll();
      mockClientCredentialsGrantCall();
      mockDeploymentWithUrl(
        {
          scenarioId: 'foundation-models',
          executableId: 'azure-openai',
          resourceGroup: 'my-rg'
        },
        { id: 'dep-002', model: { name: 'gpt-4.1', version: 'latest' } }
      );

      const client = await SapAzureOpenAI.createClient({
        modelDeployment: { modelName: 'gpt-4.1', resourceGroup: 'my-rg' }
      });

      expect(client.chat).toBeInstanceOf(SapChat);
    });
  });
});
