import nock from 'nock';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  mockClientCredentialsGrantCall,
  aiCoreDestination,
  mockDeploymentsList
} from '../../../test-util/mock-http.js';
import { createOpenAiConfig } from './config.js';

const defaultDeployment = {
  id: 'dep-001',
  model: { name: 'gpt-4.1', version: 'latest' },
  deploymentUrl: `${aiCoreDestination.url}/v2/inference/deployments/dep-001`
};

describe('createOpenAiConfig', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('baseURL resolution', () => {
    it('resolves URL via model name', async () => {
      mockDeploymentsList(
        { scenarioId: 'foundation-models', executableId: 'azure-openai' },
        defaultDeployment
      );

      const config = await createOpenAiConfig({ deployment: 'gpt-4.1' });

      expect(config.baseURL).toContain('inference/deployments/dep-001');
    });

    it('accepts a bare model name string', async () => {
      mockDeploymentsList(
        { scenarioId: 'foundation-models', executableId: 'azure-openai' },
        defaultDeployment
      );

      const config = await createOpenAiConfig('gpt-4.1');

      expect(config.baseURL).toContain('inference/deployments/dep-001');
    });

    it('resolves URL via deployment ID', async () => {
      nock(aiCoreDestination.url)
        .get('/v2/lm/deployments/dep-123')
        .reply(200, {
          id: 'dep-123',
          deploymentUrl: `${aiCoreDestination.url}/v2/inference/deployments/dep-123`
        });

      const config = await createOpenAiConfig({
        deployment: { deploymentId: 'dep-123' }
      });

      expect(config.baseURL).toContain('dep-123');
    });

    it('throws when deploymentGet returns a 404', async () => {
      nock(aiCoreDestination.url)
        .get('/v2/lm/deployments/missing-dep')
        .reply(404, { message: 'Not Found' });

      await expect(
        createOpenAiConfig({ deployment: { deploymentId: 'missing-dep' } })
      ).rejects.toThrow("Fetching deployment for ID 'missing-dep' failed.");
    });

    it('throws when deployment ID resolves to no URL', async () => {
      nock(aiCoreDestination.url)
        .get('/v2/lm/deployments/no-url-dep')
        .reply(200, { id: 'no-url-dep' });

      await expect(
        createOpenAiConfig({ deployment: { deploymentId: 'no-url-dep' } })
      ).rejects.toThrow(
        "Deployment for ID 'no-url-dep' has no deployment URL. Ensure the deployment is running."
      );
    });
  });

  describe('apiVersion', () => {
    beforeEach(() => {
      mockDeploymentsList(
        { scenarioId: 'foundation-models', executableId: 'azure-openai' },
        defaultDeployment
      );
    });

    it("defaults to '2024-10-21'", async () => {
      const config = await createOpenAiConfig({ deployment: 'gpt-4.1' });
      expect(config.apiVersion).toBe('2024-10-21');
    });

    it('uses provided apiVersion', async () => {
      const config = await createOpenAiConfig({
        deployment: 'gpt-4.1',
        apiVersion: '2025-01-01'
      });
      expect(config.apiVersion).toBe('2025-01-01');
    });
  });

  describe('resource group header', () => {
    it("defaults to 'default'", async () => {
      mockDeploymentsList(
        { scenarioId: 'foundation-models', executableId: 'azure-openai' },
        defaultDeployment
      );

      const config = await createOpenAiConfig({ deployment: 'gpt-4.1' });

      expect(
        (config.defaultHeaders as Record<string, string>)['ai-resource-group']
      ).toBe('default');
    });

    it('uses the provided resource group', async () => {
      mockDeploymentsList(
        {
          scenarioId: 'foundation-models',
          executableId: 'azure-openai',
          resourceGroup: 'custom-rg'
        },
        {
          id: 'dep-002',
          model: { name: 'gpt-4.1', version: 'latest' },
          deploymentUrl: `${aiCoreDestination.url}/v2/inference/deployments/dep-002`
        }
      );

      const config = await createOpenAiConfig({
        deployment: { modelName: 'gpt-4.1', resourceGroup: 'custom-rg' }
      });

      expect(
        (config.defaultHeaders as Record<string, string>)['ai-resource-group']
      ).toBe('custom-rg');
    });
  });

  describe('ai-client-type header', () => {
    beforeEach(() => {
      mockDeploymentsList(
        { scenarioId: 'foundation-models', executableId: 'azure-openai' },
        defaultDeployment
      );
    });

    it("sets 'AI SDK JavaScript' when no clientType is given", async () => {
      const config = await createOpenAiConfig({ deployment: 'gpt-4.1' });
      expect(
        (config.defaultHeaders as Record<string, string>)['ai-client-type']
      ).toBe('AI SDK JavaScript');
    });

    it('appends clientType to the header', async () => {
      const config = await createOpenAiConfig({
        deployment: 'gpt-4.1',
        clientType: 'MyApp'
      });
      expect(
        (config.defaultHeaders as Record<string, string>)['ai-client-type']
      ).toBe('AI SDK JavaScript,MyApp');
    });
  });

  it('wires up azureADTokenProvider as a function', async () => {
    mockDeploymentsList(
      { scenarioId: 'foundation-models', executableId: 'azure-openai' },
      defaultDeployment
    );

    const config = await createOpenAiConfig({ deployment: 'gpt-4.1' });

    expect(typeof config.azureADTokenProvider).toBe('function');
  });
});
