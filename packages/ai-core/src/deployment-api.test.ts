import nock from 'nock';
import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import {
  Deployment,
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
    nock(destination.url)
      .get('/lm/deployments')
      .reply(
        200,
        {
          count: 1,
          resources: [
            {
              configurationId: '7652a231-ba9b-4fcc-b473-2c355cb21b61',
              configurationName: 'gpt-4-32k',
              createdAt: '2024-04-17T15:19:53Z',
              deploymentUrl:
                'https://ai.example.com/inference/deployments/d19b998f347341aa',
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
              id: 'd19b998f347341aa',
              lastOperation: 'CREATE',
              latestRunningConfigurationId:
                '7652a231-ba9b-4fcc-b473-2c355cb21b61',
              modifiedAt: '2024-05-07T13:05:45Z',
              scenarioId: 'foundation-models',
              startTime: '2024-04-17T15:21:15Z',
              status: 'RUNNING',
              submissionTime: '2024-04-17T15:20:11Z',
              targetStatus: 'RUNNING'
            }
          ]
        },
        {
          'Content-Type': 'application/json',
          'AI-Resource-Group': 'default'
        }
      );

    const result: DeploymentList = await DeploymentApi.deploymentQuery(
      {},
      { 'AI-Resource-Group': 'default' }
    ).execute(destination);

    expect(result).toBeTruthy();
    expect(result.count).toBe(1);
    expect(result.resources.length).toBe(1);

    const deployment: Deployment = result.resources[0];

    expect(deployment.configurationId).toBe(
      '7652a231-ba9b-4fcc-b473-2c355cb21b61'
    );
    expect(deployment.configurationName).toBe('gpt-4-32k');
    expect(deployment.id).toBe('d19b998f347341aa');
    expect(deployment.status).toBe('RUNNING');
    expect(deployment.startTime).toBe('2024-04-17T15:21:15Z');
  });

  it('post deployment parses a successful response', async () => {
    nock(destination.url).post('/lm/deployments').reply(
      200,
      {
        deploymentUrl: '',
        id: 'd5b764fe55b3e87c',
        message: 'Deployment scheduled',
        status: 'UNKNOWN'
      },
      {
        'Content-Type': 'application/json',
        'AI-Resource-Group': 'default'
      }
    );

    const deploymentPostData: DeploymentCreationRequest = {
      configurationId: '7652a231-ba9b-4fcc-b473-2c355cb21b61'
    };

    const result: DeploymentCreationResponse =
      await DeploymentApi.deploymentCreate(deploymentPostData, {
        'AI-Resource-Group': 'default'
      }).execute(destination);

    expect(result).toBeTruthy();
    expect(result.deploymentUrl).toBe('');
    expect(result.id).toBe('d5b764fe55b3e87c');
    expect(result.message).toBe('Deployment scheduled');
  });

  it('patch deployment parses a successful response', async () => {
    const deploymentId = 'd19b998f347341aa';

    nock(destination.url)
      .patch(`/lm/deployments/${deploymentId}`, body => {
        expect(body).toEqual({
          targetStatus: 'STOPPED'
        });

        expect(body).not.toHaveProperty('scenarioId');
        return true;
      })
      .reply(
        200,
        {
          id: 'd5b764fe55b3e87c',
          message: 'Deployment modification scheduled'
        },
        {
          'Content-Type': 'application/json',
          'AI-Resource-Group': 'default'
        }
      );

    const deploymentPatchData: DeploymentModificationRequest = {
      targetStatus: 'STOPPED' as DeploymentTargetStatus
    };

    const result: DeploymentModificationResponse =
      await DeploymentApi.deploymentModify(deploymentId, deploymentPatchData, {
        'AI-Resource-Group': 'default'
      }).execute(destination);

    expect(result).toBeTruthy();
    expect(result.id).toBe('d5b764fe55b3e87c');
    expect(result.message).toBe('Deployment modification scheduled');
  });

  it('delete deployment parses a successful response', async () => {
    const deploymentId = 'd5b764fe55b3e87c';

    nock(destination.url).delete(`/lm/deployments/${deploymentId}`).reply(
      200,
      {
        id: 'd5b764fe55b3e87c',
        message: 'Deletion scheduled',
        targetStatus: 'DELETED'
      },
      {
        'Content-Type': 'application/json',
        'AI-Resource-Group': 'default'
      }
    );

    const result: DeploymentDeletionResponse =
      await DeploymentApi.deploymentDelete(deploymentId, {
        'AI-Resource-Group': 'default'
      }).execute(destination);

    expect(result).toBeTruthy();
    expect(result.id).toBe(deploymentId);
    expect(result.targetStatus).toBe('DELETED');
  });
});
