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
    it('accepts a bare model name string', async () => {
      mockDeploymentsList(
        { scenarioId: 'foundation-models', executableId: 'azure-openai' },
        defaultDeployment
      );

      const config = await createOpenAiConfig('gpt-4.1');

      expect(config.baseURL).toContain('inference/deployments/dep-001');
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
