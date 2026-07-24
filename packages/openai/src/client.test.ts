import nock from 'nock';
import {
  mockClientCredentialsGrantCall,
  aiCoreDestination,
  mockDeploymentsList
} from '../../../test-util/mock-http.js';
import { SapOpenAi } from './client.js';
import { SapChat } from './chat.js';
import { SapEmbeddings } from './embeddings.js';
import { SapResponses } from './responses.js';

const defaultDeployment = {
  id: 'dep-001',
  model: { name: 'gpt-4.1', version: 'latest' },
  deploymentUrl: `${aiCoreDestination.url}/v2/inference/deployments/dep-001`
};

describe('SapOpenAi', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
    mockDeploymentsList(
      { scenarioId: 'foundation-models', executableId: 'azure-openai' },
      defaultDeployment
    );
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('createClient', () => {
    it('exposes chat, embeddings and responses namespaces', async () => {
      const client = await SapOpenAi.createClient({
        deployment: 'gpt-4.1'
      });

      expect(client.chat).toBeInstanceOf(SapChat);
      expect(client.embeddings).toBeInstanceOf(SapEmbeddings);
      expect(client.responses).toBeInstanceOf(SapResponses);
    });

    it('accepts a bare model name string', async () => {
      const client = await SapOpenAi.createClient('gpt-4.1');

      expect(client.chat).toBeInstanceOf(SapChat);
    });

    it('resolves with a custom resource group', async () => {
      nock.cleanAll();
      mockClientCredentialsGrantCall();
      mockDeploymentsList(
        {
          scenarioId: 'foundation-models',
          executableId: 'azure-openai',
          resourceGroup: 'my-rg'
        },
        {
          id: 'dep-002',
          model: { name: 'gpt-4.1', version: 'latest' },
          deploymentUrl: `${aiCoreDestination.url}/v2/inference/deployments/dep-002`
        }
      );

      const client = await SapOpenAi.createClient({
        deployment: { modelName: 'gpt-4.1', resourceGroup: 'my-rg' }
      });

      expect(client.chat).toBeInstanceOf(SapChat);
    });
  });
});
