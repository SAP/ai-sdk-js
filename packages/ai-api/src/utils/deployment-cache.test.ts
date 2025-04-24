import { type AiDeployment } from '../client/AI_CORE_API';
import { deploymentCache } from './deployment-cache.js';
import type { FoundationModel } from './model.js';

describe('deployment cache', () => {
  afterEach(() => {
    deploymentCache.clear();
  });

  it('should cache the deployment', () => {
    const opts = {
      scenarioId: 'foundation-models',
      executableId: 'execution-id',
      model: { name: 'gpt-4o', version: 'latest' }
    };
    deploymentCache.set(opts, {
      id: 'deployment-id',
      details: {
        resources: {
          backendDetails: { model: { name: 'gpt-4o', version: 'latest' } }
        }
      }
    } as unknown as AiDeployment);

    expect(deploymentCache.get(opts)).toEqual({
      id: 'deployment-id',
      model: { name: 'gpt-4o', version: 'latest' }
    });
  });

  describe('should cache all deployments independent of potentially given models', () => {
    beforeEach(() => {
      deploymentCache.setAll(
        {
          scenarioId: 'foundation-models',
          model: { name: 'gpt-4o', version: 'latest' }
        },
        [
          mockAiDeployment('deployment-id1', {
            name: 'gpt-4o',
            version: 'latest'
          }),
          mockAiDeployment('deployment-id2', {
            name: 'gpt-4o',
            version: '123'
          })
        ]
      );
    });

    it('cache nothing for unlisted model names', () => {
      expect(
        deploymentCache.get({
          scenarioId: 'foundation-models',
          model: { name: 'gpt-4', version: 'latest' }
        })
      ).toBeUndefined();
    });

    it('retrieve the deployment matching the model name and version', () => {
      expect(
        deploymentCache.get({
          scenarioId: 'foundation-models',
          model: {
            name: 'gpt-4o',
            version: '123'
          }
        })?.id
      ).toEqual('deployment-id2');
    });

    it('retrieve the first deployment matching the model name when version is missing', () => {
      expect(
        deploymentCache.get({
          scenarioId: 'foundation-models',
          model: {
            name: 'gpt-4o'
          }
        })?.id
      ).toEqual('deployment-id1');
    });

    it('retrieve the deployment when model is missing', () => {
      expect(
        deploymentCache.get({
          scenarioId: 'foundation-models'
        })?.id
      ).toEqual('deployment-id1');
    });
  });

  it('should cache only the first deployments for equal models and versions', () => {
    const opts = {
      scenarioId: 'foundation-models'
    };

    deploymentCache.setAll(opts, [
      mockAiDeployment('deployment-id1', { name: 'gpt-4o', version: 'latest' }),
      mockAiDeployment('deployment-id2', { name: 'gpt-4o', version: 'latest' })
    ]);

    expect(
      deploymentCache.get({
        ...opts,
        model: { name: 'gpt-4o', version: 'latest' }
      })?.id
    ).toEqual('deployment-id1');
  });

  it('should cache only the first deployments for equal models and no versions', () => {
    const opts = {
      scenarioId: 'foundation-models'
    };

    deploymentCache.setAll(opts, [
      mockAiDeployment('deployment-id1', { name: 'gpt-4o' }),
      mockAiDeployment('deployment-id2', { name: 'gpt-4o' })
    ]);

    expect(
      deploymentCache.get({
        ...opts,
        model: { name: 'gpt-4o' }
      })?.id
    ).toEqual('deployment-id1');
  });

  it('should ignore model versions without model name', () => {
    const opts = {
      scenarioId: 'foundation-models'
    };

    deploymentCache.setAll(opts, [
      mockAiDeployment('deployment-id1'),
      mockAiDeployment('deployment-id2', { version: 'latest' })
    ]);

    expect(deploymentCache.get(opts)?.id).toEqual('deployment-id1');
  });
});

function mockAiDeployment(id: string, model?: Partial<FoundationModel>) {
  const backendDetails = model ? { model } : model;
  return {
    id,
    details: {
      resources: { backendDetails }
    }
  } as unknown as AiDeployment;
}
