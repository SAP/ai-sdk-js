import nock from 'nock';
import {
  mockClientCredentialsGrantCall,
  mockAiCoreEnvVariable,
  aiCoreDestination
} from '../../../../test-util/mock-http.js';
import { resolveDeployment } from './deployment-resolver.js';

describe('Deployment resolver', () => {
  beforeEach(() => {
    mockAiCoreEnvVariable();
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
      const { id, configurationId } = await resolveDeployment({
        scenarioId: 'foundation-models'
      });
      expect(id).toBe('1');
      expect(configurationId).toBe('c1');
    });
    it('should return the deployment with the correct model name', async () => {
      const { id, configurationId } = await resolveDeployment({
        scenarioId: 'foundation-models',
        modelName: 'gpt-4o'
      });
      expect(id).toBe('2');
      expect(configurationId).toBe('c2');
    });
    it('should return the deployment with the correct model name', async () => {
      const { id, configurationId } = await resolveDeployment({
        scenarioId: 'foundation-models',
        modelVersion: '0613'
      });
      expect(id).toBe('2');
      expect(configurationId).toBe('c2');
    });
    it('should throw in case no deployment with the given model name is found', async () => {
      await expect(
        resolveDeployment({
          scenarioId: 'foundation-models',
          modelName: 'not existing'
        })
      ).rejects.toThrow('No deployment matched the given criteria');
    });
    it('should throw in case no deployment with the given model version is found', async () => {
      await expect(
        resolveDeployment({
          scenarioId: 'foundation-models',
          modelName: 'gpt-4o',
          modelVersion: 'not existing'
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
      resolveDeployment({ scenarioId: 'foundation-models' })
    ).rejects.toThrow('No deployment matched the given criteria');
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
      count: 1,
      resources: [
        {
          configurationId: 'c1',
          id: '1',
          deploymentUrl: 'https://foo.com/v2/inference/deployments/1',
          details: {
            resources: {
              backend_details: {
                model: {
                  name: 'gpt-4-32k',
                  version: 'latest'
                }
              }
            },
            scaling: {
              backend_details: {}
            }
          },
          lastOperation: 'CREATE',
          status: 'RUNNING'
        },
        {
          configurationId: 'c2',
          id: '2',
          deploymentUrl: 'https://foo.com/v2/inference/deployments/2',
          details: {
            resources: {
              backend_details: {
                model: {
                  name: 'gpt-4o',
                  version: '0613'
                }
              }
            }
          },
          status: 'RUNNING'
        }
      ]
    });
}
