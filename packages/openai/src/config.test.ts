import nock from 'nock';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  mockClientCredentialsGrantCall,
  aiCoreDestination
} from '../../../test-util/mock-http.js';
import { createOpenAIConfig } from './config.js';

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

describe('createOpenAIConfig', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('baseURL resolution', () => {
    it('resolves URL via model name', async () => {
      mockDeploymentWithUrl(
        { scenarioId: 'foundation-models', executableId: 'azure-openai' },
        { id: 'dep-001', model: { name: 'gpt-4.1', version: 'latest' } }
      );

      const config = await createOpenAIConfig({ modelDeployment: 'gpt-4.1' });

      expect(config.baseURL).toContain('inference/deployments/dep-001');
    });

    it('resolves URL via deployment ID', async () => {
      nock(aiCoreDestination.url)
        .get('/v2/lm/deployments/dep-123')
        .reply(200, {
          id: 'dep-123',
          deploymentUrl: `${aiCoreDestination.url}/v2/inference/deployments/dep-123`
        });

      const config = await createOpenAIConfig({
        modelDeployment: { deploymentId: 'dep-123' }
      });

      expect(config.baseURL).toContain('dep-123');
    });

    it('throws when deployment ID resolves to no URL', async () => {
      nock(aiCoreDestination.url)
        .get('/v2/lm/deployments/no-url-dep')
        .reply(200, { id: 'no-url-dep' });

      await expect(
        createOpenAIConfig({ modelDeployment: { deploymentId: 'no-url-dep' } })
      ).rejects.toThrow(
        "Deployment for ID 'no-url-dep' has no deployment URL. Ensure the deployment is running."
      );
    });
  });

  describe('apiVersion', () => {
    beforeEach(() => {
      mockDeploymentWithUrl(
        { scenarioId: 'foundation-models', executableId: 'azure-openai' },
        { id: 'dep-001', model: { name: 'gpt-4.1', version: 'latest' } }
      );
    });

    it("defaults to '2024-10-21'", async () => {
      const config = await createOpenAIConfig({ modelDeployment: 'gpt-4.1' });
      expect(config.apiVersion).toBe('2024-10-21');
    });

    it('uses provided apiVersion', async () => {
      const config = await createOpenAIConfig({
        modelDeployment: 'gpt-4.1',
        apiVersion: '2025-01-01'
      });
      expect(config.apiVersion).toBe('2025-01-01');
    });
  });

  describe('resource group header', () => {
    it("defaults to 'default'", async () => {
      mockDeploymentWithUrl(
        { scenarioId: 'foundation-models', executableId: 'azure-openai' },
        { id: 'dep-001', model: { name: 'gpt-4.1', version: 'latest' } }
      );

      const config = await createOpenAIConfig({ modelDeployment: 'gpt-4.1' });

      expect(
        (config.defaultHeaders as Record<string, string>)['ai-resource-group']
      ).toBe('default');
    });

    it('uses the provided resource group', async () => {
      mockDeploymentWithUrl(
        {
          scenarioId: 'foundation-models',
          executableId: 'azure-openai',
          resourceGroup: 'custom-rg'
        },
        { id: 'dep-002', model: { name: 'gpt-4.1', version: 'latest' } }
      );

      const config = await createOpenAIConfig({
        modelDeployment: { modelName: 'gpt-4.1', resourceGroup: 'custom-rg' }
      });

      expect(
        (config.defaultHeaders as Record<string, string>)['ai-resource-group']
      ).toBe('custom-rg');
    });
  });

  describe('ai-client-type header', () => {
    beforeEach(() => {
      mockDeploymentWithUrl(
        { scenarioId: 'foundation-models', executableId: 'azure-openai' },
        { id: 'dep-001', model: { name: 'gpt-4.1', version: 'latest' } }
      );
    });

    it("sets 'AI SDK JavaScript' when no clientType is given", async () => {
      const config = await createOpenAIConfig({ modelDeployment: 'gpt-4.1' });
      expect(
        (config.defaultHeaders as Record<string, string>)['ai-client-type']
      ).toBe('AI SDK JavaScript');
    });

    it('appends clientType to the header', async () => {
      const config = await createOpenAIConfig({
        modelDeployment: 'gpt-4.1',
        clientType: 'MyApp'
      });
      expect(
        (config.defaultHeaders as Record<string, string>)['ai-client-type']
      ).toBe('AI SDK JavaScript,MyApp');
    });
  });

  it('wires up azureADTokenProvider as a function', async () => {
    mockDeploymentWithUrl(
      { scenarioId: 'foundation-models', executableId: 'azure-openai' },
      { id: 'dep-001', model: { name: 'gpt-4.1', version: 'latest' } }
    );

    const config = await createOpenAIConfig({ modelDeployment: 'gpt-4.1' });

    expect(typeof config.azureADTokenProvider).toBe('function');
  });
});
