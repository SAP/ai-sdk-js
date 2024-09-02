import { type AiDeployment } from '@sap-ai-sdk/ai-core';
import { deploymentIdCache } from './deployment-cache.js';
import { FoundationModel } from './model.js';

describe('deployment id cache', () => {
  afterEach(() => {
    deploymentIdCache.clear();
  });

  it('should cache the deployment', () => {
    const opts = {
      scenarioId: 'foundation-models',
      executableId: 'execution-id',
      model: { name: 'gpt-4o', version: 'latest' }
    };
    deploymentIdCache.set(opts, {
      id: 'deployment-id',
      details: {
        resources: {
          backend_details: { model: { name: 'gpt-4o', version: 'latest' } }
        }
      }
    } as unknown as AiDeployment);

    expect(deploymentIdCache.get(opts)).toEqual({
      id: 'deployment-id',
      model: { name: 'gpt-4o', version: 'latest' }
    });
  });

  it('should cache all deployments independent of potentially given models', () => {
    const opts = {
      scenarioId: 'foundation-models',
      model: { name: 'gpt-4o', version: 'latest' }
    };

    deploymentIdCache.setAll(opts, [
      mockAiDeployment('deployment-id1', {
        name: 'gpt-35-turbo',
        version: 'latest'
      }),
      mockAiDeployment('deployment-id2', {
        name: 'gpt-35-turbo',
        version: '123'
      })
    ]);

    expect(deploymentIdCache.get(opts)).toBeUndefined();
    expect(
      deploymentIdCache.get({
        ...opts,
        model: {
          name: 'gpt-35-turbo',
          version: 'latest'
        }
      })?.id
    ).toEqual('deployment-id1');
    expect(
      deploymentIdCache.get({
        ...opts,
        model: {
          name: 'gpt-35-turbo',
          version: '123'
        }
      })?.id
    ).toEqual('deployment-id2');
  });

  it('should cache only the first deployments for equal models and versions', () => {
    const opts = {
      scenarioId: 'foundation-models'
    };

    deploymentIdCache.setAll(opts, [
      mockAiDeployment('deployment-id1', { name: 'gpt-4o', version: 'latest' }),
      mockAiDeployment('deployment-id2', { name: 'gpt-4o', version: 'latest' })
    ]);

    expect(
      deploymentIdCache.get({
        ...opts,
        model: { name: 'gpt-4o', version: 'latest' }
      })?.id
    ).toEqual('deployment-id1');
  });

  it('should cache only the first deployments for equal models and no versions', () => {
    const opts = {
      scenarioId: 'foundation-models'
    };

    deploymentIdCache.setAll(opts, [
      mockAiDeployment('deployment-id1', { name: 'gpt-4o' }),
      mockAiDeployment('deployment-id2', { name: 'gpt-4o' })
    ]);

    expect(
      deploymentIdCache.get({
        ...opts,
        model: { name: 'gpt-4o' }
      })?.id
    ).toEqual('deployment-id1');
  });

  it('should ignore model versions without model name', () => {
    const opts = {
      scenarioId: 'foundation-models'
    };

    deploymentIdCache.setAll(opts, [
      mockAiDeployment('deployment-id1'),
      mockAiDeployment('deployment-id2', { version: 'latest' })
    ]);

    expect(deploymentIdCache.get(opts)?.id).toEqual('deployment-id1');
  });
});

function mockAiDeployment(id: string, model?: Partial<FoundationModel>) {
  const backendDetails = model ? { model } : model;
  return {
    id,
    details: {
      resources: { backend_details: backendDetails }
    }
  } as unknown as AiDeployment;
}
