import nock from 'nock';
import {
  mockClientCredentialsGrantCall,
  aiCoreDestination
} from '../../../../test-util/mock-http.js';
import { resolveDeployment } from './deployment-resolver.js';

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

    it('should return the first deployment, if multiple are given', async () => {
      const { id } = await resolveDeployment({
        scenarioId: 'foundation-models'
      });
      expect(id).toBe('1');
    });

    it('should return the first deployment with the correct model name', async () => {
      const { id } = await resolveDeployment({
        scenarioId: 'foundation-models',
        model: { name: 'gpt-4o' }
      });
      expect(id).toBe('1');
    });

    it('should return the deployment with the correct model name and version', async () => {
      const { id } = await resolveDeployment({
        scenarioId: 'foundation-models',
        model: { name: 'gpt-4o', version: '0613' }
      });
      expect(id).toBe('2');
    });

    it('should throw in case no deployment with the given model name is found', async () => {
      await expect(
        resolveDeployment({
          scenarioId: 'foundation-models',
          model: { name: 'not existing' }
        })
      ).rejects.toThrow('No deployment matched the given criteria');
    });

    it('should throw in case no deployment with the given model and version is found', async () => {
      await expect(
        resolveDeployment({
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
      resolveDeployment({
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

    const { id } = await resolveDeployment({
      scenarioId: 'foundation-models',
      model: { name: 'gpt-4o' },
      resourceGroup: 'otherId'
    });

    expect(id).toBe('5');
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
