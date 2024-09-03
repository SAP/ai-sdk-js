import nock from 'nock';
import { AiDeployment } from '@sap-ai-sdk/ai-core';
import {
  mockClientCredentialsGrantCall,
  aiCoreDestination
} from '../../../../test-util/mock-http.js';
import { resolveDeploymentId } from './deployment-resolver.js';
import { deploymentCache } from './deployment-cache.js';

describe('deployment resolver', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('should lookup the deployment ID based on a scenario', () => {
    beforeEach(() => {
      mockResponse();
    });

    afterEach(() => {
      deploymentCache.clear();
    });

    it('should return the first deployment, if multiple are given', async () => {
      const id = await resolveDeploymentId({
        scenarioId: 'foundation-models'
      });
      expect(id).toEqual('1');
    });

    it('should return the first deployment with the correct model name', async () => {
      const id = await resolveDeploymentId({
        scenarioId: 'foundation-models',
        model: { name: 'gpt-4o' }
      });
      expect(id).toEqual('1');
    });

    it('should return the deployment with the correct model name and version', async () => {
      const id = await resolveDeploymentId({
        scenarioId: 'foundation-models',
        model: { name: 'gpt-4o', version: '0613' }
      });
      expect(id).toEqual('2');
    });

    it('should retrieve deployment from cache if available', async () => {
      const opts = {
        scenarioId: 'foundation-models',
        model: { name: 'gpt-4o', version: '0613' }
      };
      deploymentCache.set(opts, { id: '1' } as AiDeployment);
      const id = await resolveDeploymentId(opts);
      expect(id).toEqual('1');
      expect(nock.isDone()).toEqual(false);
    });

    it('should throw in case no deployment with the given model name is found', async () => {
      await expect(
        resolveDeploymentId({
          scenarioId: 'foundation-models',
          model: { name: 'not existing' }
        })
      ).rejects.toThrow('No deployment matched the given criteria');
    });

    it('should throw in case no deployment with the given model and version is found', async () => {
      await expect(
        resolveDeploymentId({
          scenarioId: 'foundation-models',
          model: { name: 'gpt-4o', version: 'not existing' }
        })
      ).rejects.toThrow('No deployment matched the given criteria');
    });
  });

  it('should throw on empty list', async () => {
    nock(aiCoreDestination.url, {
      reqheaders: {
        'ai-resource-group': 'default'
      }
    })
      .get('/v2/lm/deployments')
      .query({ scenarioId: 'foundation-models', status: 'RUNNING' })
      .reply(200, {
        count: 0,
        resources: []
      });

    await expect(
      resolveDeploymentId({
        scenarioId: 'foundation-models',
        model: { name: 'gpt-4o', version: '0613' }
      })
    ).rejects.toThrow('No deployment matched the given criteria');
  });

  it('should consider custom resource group', async () => {
    nock(aiCoreDestination.url, {
      reqheaders: {
        'ai-resource-group': 'otherId'
      }
    })
      .get('/v2/lm/deployments')
      .query({ scenarioId: 'foundation-models', status: 'RUNNING' })
      .reply(200, {
        resources: [
          {
            id: '5',
            details: {
              resources: {
                backend_details: {
                  model: {
                    name: 'gpt-4o',
                    version: 'latest'
                  }
                }
              }
            }
          }
        ]
      });

    const id = await resolveDeploymentId({
      scenarioId: 'foundation-models',
      model: { name: 'gpt-4o' },
      resourceGroup: 'otherId'
    });

    expect(id).toEqual('5');
  });
});

function mockResponse() {
  nock(aiCoreDestination.url, {
    reqheaders: {
      'ai-resource-group': 'default'
    }
  })
    .get('/v2/lm/deployments')
    .query({ scenarioId: 'foundation-models', status: 'RUNNING' })
    .reply(200, {
      resources: [
        {
          id: '1',
          details: {
            resources: {
              backend_details: {
                model: {
                  name: 'gpt-4o',
                  version: 'latest'
                }
              }
            }
          }
        },
        {
          id: '2',
          details: {
            resources: {
              backend_details: {
                model: {
                  name: 'gpt-4o',
                  version: '0613'
                }
              }
            }
          }
        }
      ]
    });
}
