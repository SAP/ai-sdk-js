import nock from 'nock';
import { AzureOpenAI } from 'openai';
import {
  mockClientCredentialsGrantCall,
  aiCoreDestination,
  mockDeploymentsList
} from '../../../test-util/mock-http.js';
import { SapAzureOpenAi } from './azure-openai.js';

const deploymentUrl = `${aiCoreDestination.url}/v2/inference/deployments/deployment-001`;

const defaultContext = {
  azureOptions: {
    baseURL: deploymentUrl,
    apiVersion: '2024-10-21',
    apiKey: 'token'
  },
  deployment: 'gpt-5.4' as const,
  destination: undefined,
  resourceGroup: 'default'
};

function makeClient() {
  return new SapAzureOpenAi(defaultContext);
}

describe('SapAzureOpenAi', () => {
  let superBuildRequest: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    superBuildRequest = vi
      .spyOn(AzureOpenAI.prototype, 'buildRequest')
      .mockResolvedValue({} as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    nock.cleanAll();
  });

  describe('buildRequest', () => {
    it('skips deployment resolution when model is not defined per request', async () => {
      await makeClient().buildRequest({
        path: '/chat/completions',
        method: 'post',
        headers: {},
        body: { messages: [] }
      });
      expect(superBuildRequest).toHaveBeenCalledWith(
        expect.objectContaining({ path: '/chat/completions' }),
        expect.anything()
      );
    });

    it('resolves deployment when different model is defined per request', async () => {
      mockClientCredentialsGrantCall();
      mockDeploymentsList(
        { scenarioId: 'foundation-models', executableId: 'azure-openai' },
        {
          id: 'deployment-001',
          model: { name: 'gpt-5.4-nano', version: 'latest' },
          deploymentUrl
        }
      );

      await makeClient().buildRequest({
        path: '/chat/completions',
        method: 'post',
        headers: {},
        body: { model: 'gpt-5.4-nano', messages: [] }
      });

      expect(superBuildRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          path: `${deploymentUrl}/chat/completions`
        }),
        expect.anything()
      );
    });

    it('skips deployment resolution when same model is defined per request', async () => {
      await makeClient().buildRequest({
        path: '/chat/completions',
        method: 'post',
        headers: {},
        body: { model: 'gpt-5.4', messages: [] }
      });

      expect(superBuildRequest).toHaveBeenCalledWith(
        expect.objectContaining({ path: '/chat/completions' }),
        expect.anything()
      );
    });

    it('uses resourceGroup from model when defined', async () => {
      const customResourceGroup = 'custom';
      mockClientCredentialsGrantCall();
      mockDeploymentsList(
        {
          scenarioId: 'foundation-models',
          executableId: 'azure-openai',
          resourceGroup: customResourceGroup
        },
        {
          id: 'deployment-001',
          model: { name: 'gpt-5.4', version: 'latest' },
          deploymentUrl
        }
      );

      await makeClient().buildRequest({
        path: '/chat/completions',
        method: 'post',
        headers: {},
        body: {
          model: { modelName: 'gpt-5.4', resourceGroup: customResourceGroup },
          messages: []
        }
      });

      expect(superBuildRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          path: `${deploymentUrl}/chat/completions`
        }),
        expect.anything()
      );
    });
  });

  describe('buildRequest headers', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    afterEach(() => {
      nock.cleanAll();
    });

    it('sends custom ai-resource-group header when resourceGroup is defined on model', async () => {
      const customResourceGroup = 'custom';
      mockClientCredentialsGrantCall();
      mockDeploymentsList(
        {
          scenarioId: 'foundation-models',
          executableId: 'azure-openai',
          resourceGroup: customResourceGroup
        },
        {
          id: 'deployment-001',
          model: { name: 'gpt-4.1', version: 'latest' },
          deploymentUrl
        }
      );

      const result = await makeClient().buildRequest({
        path: '/chat/completions',
        method: 'post',
        headers: {},
        body: {
          model: { modelName: 'gpt-4.1', resourceGroup: customResourceGroup },
          messages: []
        }
      });

      expect(result.req.headers.get('ai-resource-group')).toBe(
        customResourceGroup
      );
    });

    it('does not send ai-resource-group header when a per-request model is used', async () => {
      mockClientCredentialsGrantCall();
      mockDeploymentsList(
        { scenarioId: 'foundation-models', executableId: 'azure-openai' },
        {
          id: 'deployment-001',
          model: { name: 'gpt-4.1', version: 'latest' },
          deploymentUrl
        }
      );

      const result = await makeClient().buildRequest({
        path: '/chat/completions',
        method: 'post',
        body: { model: 'gpt-4.1', messages: [] }
      });

      expect(result.req.headers.get('ai-resource-group')).toBeNull();
    });

    it('does not send ai-resource-group header when no per-request model is used', async () => {
      const result = await makeClient().buildRequest({
        path: '/chat/completions',
        method: 'post',
        headers: {},
        body: { messages: [] }
      });

      expect(result.req.headers.get('ai-resource-group')).toBeNull();
    });
  });
});
