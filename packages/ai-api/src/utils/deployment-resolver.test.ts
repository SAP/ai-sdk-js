import nock from 'nock';
import {
  mockClientCredentialsGrantCall,
  aiCoreDestination,
  mockDeploymentsList
} from '../../../../test-util/mock-http.js';
import { type AiDeployment } from '../client/AI_CORE_API/index.js';
import {
  getAllDeployments,
  resolveDeploymentId,
  resolveDeploymentUrlById,
  resolveDeploymentUrlForModel
} from './deployment-resolver.js';
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
        model: { name: 'gpt-5-mini' }
      });
      expect(id).toEqual('1');
    });

    it('should return the deployment with the correct model name and version', async () => {
      const id = await resolveDeploymentId({
        scenarioId: 'foundation-models',
        model: { name: 'gpt-5-mini', version: '0613' }
      });
      expect(id).toEqual('2');
    });

    it('should retrieve deployment from cache if available', async () => {
      const options = {
        scenarioId: 'foundation-models',
        model: { name: 'gpt-5-mini', version: '0613' }
      };
      deploymentCache.set(options, { id: '1' } as AiDeployment);
      const id = await resolveDeploymentId(options);
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
          model: { name: 'gpt-5-mini', version: 'not existing' }
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
        model: { name: 'gpt-5-mini', version: '0613' }
      })
    ).rejects.toThrow('No deployment matched the given criteria');
  });

  it('should consider custom resource group', async () => {
    mockDeploymentsList(
      { scenarioId: 'foundation-models', resourceGroup: 'otherId' },
      { id: '5', model: { name: 'gpt-5-mini', version: 'latest' } }
    );

    const id = await resolveDeploymentId({
      scenarioId: 'foundation-models',
      model: { name: 'gpt-5-mini' },
      resourceGroup: 'otherId'
    });

    expect(id).toEqual('5');
  });

  describe('get all deployments', () => {
    it('should return all deployments', async () => {
      mockResponse();
      const expected = [
        {
          id: '1',
          details: {
            resources: {
              backendDetails: {
                model: {
                  name: 'gpt-5-mini',
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
              backendDetails: {
                model: {
                  name: 'gpt-5-mini',
                  version: '0613'
                }
              }
            }
          }
        }
      ];
      const deployments = await getAllDeployments({
        scenarioId: 'foundation-models'
      });
      expect(deployments).toStrictEqual(expected);
    });
  });
});

function mockResponse() {
  mockDeploymentsList(
    { scenarioId: 'foundation-models' },
    { id: '1', model: { name: 'gpt-5-mini', version: 'latest' } },
    { id: '2', model: { name: 'gpt-5-mini', version: '0613' } }
  );
}

describe('resolveDeploymentUrlById', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('returns the deployment URL for a known ID', async () => {
    nock(aiCoreDestination.url)
      .get('/v2/lm/deployments/dep-123')
      .reply(200, {
        id: 'dep-123',
        deploymentUrl: `${aiCoreDestination.url}/v2/inference/deployments/dep-123`
      });

    const url = await resolveDeploymentUrlById('dep-123', 'default');

    expect(url).toContain('dep-123');
  });

  it('throws when the deployment request fails', async () => {
    nock(aiCoreDestination.url)
      .get('/v2/lm/deployments/missing-dep')
      .reply(404, { message: 'Not Found' });

    await expect(
      resolveDeploymentUrlById('missing-dep', 'default')
    ).rejects.toThrow("Fetching deployment for ID 'missing-dep' failed.");
  });

  it('throws when the deployment has no URL', async () => {
    nock(aiCoreDestination.url)
      .get('/v2/lm/deployments/no-url-dep')
      .reply(200, { id: 'no-url-dep' });

    await expect(
      resolveDeploymentUrlById('no-url-dep', 'default')
    ).rejects.toThrow(
      "Deployment for ID 'no-url-dep' has no deployment URL. Ensure the deployment is running."
    );
  });
});

describe('resolveDeploymentUrlForModel', () => {
  const baseOptions = {
    scenarioId: 'foundation-models',
    executableId: 'azure-openai',
    resourceGroup: 'default'
  };

  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });

  afterEach(() => {
    nock.cleanAll();
    deploymentCache.clear();
  });

  it('resolves URL via model name', async () => {
    mockDeploymentsList(
      { scenarioId: 'foundation-models', executableId: 'azure-openai' },
      {
        id: 'dep-001',
        model: { name: 'gpt-4.1', version: 'latest' },
        deploymentUrl: `${aiCoreDestination.url}/v2/inference/deployments/dep-001`
      }
    );

    const url = await resolveDeploymentUrlForModel('gpt-4.1', baseOptions);

    expect(url).toContain('inference/deployments/dep-001');
  });

  it('throws when model deployment has no URL', async () => {
    mockDeploymentsList(
      { scenarioId: 'foundation-models', executableId: 'azure-openai' },
      { id: 'dep-no-url', model: { name: 'gpt-4.1', version: 'latest' } }
    );

    await expect(
      resolveDeploymentUrlForModel('gpt-4.1', baseOptions)
    ).rejects.toThrow(
      "Deployment for model 'gpt-4.1' has no deployment URL. Ensure the deployment is running."
    );
  });
});
