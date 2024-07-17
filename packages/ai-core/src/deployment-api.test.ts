import nock from 'nock';
import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import {
  DeploymentCreationRequest,
  DeploymentCreationResponse,
  DeploymentDeletionResponse,
  DeploymentList,
  DeploymentModificationRequest,
  DeploymentApi,
  DeploymentModificationResponse,
  DeploymentTargetStatus
} from './index.js';

describe('deployment', () => {
  const destination: HttpDestination = {
    url: 'https://ai.example.com'
  };

  afterEach(() => {
    nock.cleanAll();
  });

  it('get deployment parses a successful response', async () => {
    const expectedResponse: DeploymentList = {
      count: 1,
      resources: [
        {
          configurationId: '3d2c1b0a',
          configurationName: 'gpt-4-32k',
          createdAt: '2024-04-17T15:19:53Z',
          deploymentUrl:
            'https://ai.example.com/inference/deployments/0a1b2c3d',
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
          id: '0a1b2c3d',
          lastOperation: 'CREATE',
          latestRunningConfigurationId: '3d2c1b0a',
          modifiedAt: '2024-05-07T13:05:45Z',
          scenarioId: 'foundation-models',
          startTime: '2024-04-17T15:21:15Z',
          status: 'RUNNING',
          submissionTime: '2024-04-17T15:20:11Z',
          targetStatus: 'RUNNING'
        }
      ]
    };

    nock(destination.url).get('/lm/deployments').reply(200, expectedResponse, {
      'Content-Type': 'application/json',
      'AI-Resource-Group': 'default'
    });

    const result: DeploymentList = await DeploymentApi.deploymentQuery(
      {},
      { 'AI-Resource-Group': 'default' }
    ).execute(destination);

    expect(result).toEqual(expectedResponse);
  });

  it('post deployment parses a successful response', async () => {
    const expectedResponse: DeploymentCreationResponse = {
      deploymentUrl: '',
      id: '4e5f6g7h',
      message: 'Deployment scheduled',
      status: 'UNKNOWN'
    };

    nock(destination.url).post('/lm/deployments').reply(200, expectedResponse, {
      'Content-Type': 'application/json',
      'AI-Resource-Group': 'default'
    });

    const deploymentPostData: DeploymentCreationRequest = {
      configurationId: '3d2c1b0a'
    };

    const result: DeploymentCreationResponse =
      await DeploymentApi.deploymentCreate(deploymentPostData, {
        'AI-Resource-Group': 'default'
      }).execute(destination);

    expect(result).toEqual(expectedResponse);
  });

  it('patch deployment parses a successful response', async () => {
    const deploymentId = '4e5f6g7h';
    const expectedRequestBody = {
      targetStatus: 'STOPPED'
    };
    const expectedResponse: DeploymentModificationResponse = {
      id: '4e5f6g7h',
      message: 'Deployment modification scheduled'
    };
    nock(destination.url)
      .patch(`/lm/deployments/${deploymentId}`, body => {
        expect(body).toEqual(expectedRequestBody);
        expect(body).not.toHaveProperty('scenarioId');
        return true;
      })
      .reply(200, expectedResponse, {
        'Content-Type': 'application/json',
        'AI-Resource-Group': 'default'
      });

    const deploymentPatchData: DeploymentModificationRequest = {
      targetStatus: 'STOPPED' as DeploymentTargetStatus
    };

    const result: DeploymentModificationResponse =
      await DeploymentApi.deploymentModify(deploymentId, deploymentPatchData, {
        'AI-Resource-Group': 'default'
      }).execute(destination);

    expect(result).toEqual(expectedResponse);
  });

  it('delete deployment parses a successful response', async () => {
    const deploymentId = '4e5f6g7h';
    const expectedResponse: DeploymentDeletionResponse = {
      id: '4e5f6g7h',
      message: 'Deletion scheduled',
      targetStatus: 'DELETED'
    };

    nock(destination.url)
      .delete(`/lm/deployments/${deploymentId}`)
      .reply(200, expectedResponse, {
        'Content-Type': 'application/json',
        'AI-Resource-Group': 'default'
      });

    const result: DeploymentDeletionResponse =
      await DeploymentApi.deploymentDelete(deploymentId, {
        'AI-Resource-Group': 'default'
      }).execute(destination);

    expect(result).toEqual(expectedResponse);
  });
});
