import nock from 'nock';
import { ErrorWithCause } from '@sap-cloud-sdk/util';
import {
  mockClientCredentialsGrantCall,
  aiCoreDestination,
  mockDeploymentsList
} from '../../../../test-util/mock-http.js';
import { type AiDeployment } from '../client/AI_CORE_API';
import { getAllDeployments, resolveDeploymentId } from './deployment-resolver.js';
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
    mockDeploymentsList(
      { scenarioId: 'foundation-models', resourceGroup: 'otherId' },
      { id: '5', model: { name: 'gpt-4o', version: 'latest' } }
    );

    const id = await resolveDeploymentId({
      scenarioId: 'foundation-models',
      model: { name: 'gpt-4o' },
      resourceGroup: 'otherId'
    });

    expect(id).toEqual('5');
  });

  describe('get all deployments', () => {
    it('should return all deployments', async () => {
      mockResponse();
      const expected = [
        {
          'id': '1',
          'details': {
            'resources': {
              'backendDetails':
              {
                'model': {
                  'name': 'gpt-4o',
                  'version': 'latest'
                }
              }
            }
          }
        }, {
          'id': '2',
          'details': {
            'resources': {
              'backendDetails': {
                'model': {
                  'name': 'gpt-4o',
                  'version': '0613'
                }
              }
            }
          }
        }];
      const deployments = await getAllDeployments({
        scenarioId: 'foundation-models'
      });
      expect(deployments).toStrictEqual(expected);
    });

    it('should throw error with cause on invalid scenarioId', async () => {
      nock(aiCoreDestination.url, {
        reqheaders: {
          'ai-resource-group': 'default'
        }
      })
        .get('/v2/lm/deployments')
        .query({ scenarioId: '123', status: 'RUNNING' })
        .reply(400, {
          error: {
            code: '400',
            message: "Invalid Request, '123' does not match '^[\\\\w.-]{4,64}$'\n\nFailed validating 'pattern' in schema:\n    {'type': 'string', 'pattern': '^[\\\\w.-]{4,64}$'}\n\nOn instance:\n    '123'",
            requestId: '',
            target: '/api/v2/deployments'
          }
        });

      try{
        await getAllDeployments({
          scenarioId: '123'
        });
      } catch (err: any) {
        expect(err).toBeInstanceOf(ErrorWithCause);
        expect(err.message).toEqual('Failed to fetch the list of deployments.');
        expect(err.stack).toContain('Caused by:\nHTTP Response: Request failed with status code 400');
      }
    });
  });
});

function mockResponse() {
  mockDeploymentsList(
    { scenarioId: 'foundation-models' },
    { id: '1', model: { name: 'gpt-4o', version: 'latest' } },
    { id: '2', model: { name: 'gpt-4o', version: '0613' } }
  );
}
