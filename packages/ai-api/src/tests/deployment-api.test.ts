import nock from 'nock';
import { DeploymentApi } from '../client/AI_CORE_API';
import {
  aiCoreDestination,
  mockClientCredentialsGrantCall,
  mockDestination
} from '../../../../test-util/mock-http.js';
import type {
  AiDeploymentCreationRequest,
  AiDeploymentCreationResponse,
  AiDeploymentDeletionResponse,
  AiDeploymentList,
  AiDeploymentModificationRequest,
  AiDeploymentModificationResponse,
  AiDeploymentTargetStatus
} from '../client/AI_CORE_API';

describe('deployment', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it('parses a successful response for get request', async () => {
    const expectedResponse: AiDeploymentList = {
      count: 1,
      resources: [
        {
          configurationId: '3d2c1b0a',
          configurationName: 'gpt-4o',
          createdAt: '2024-04-17T15:19:53Z',
          deploymentUrl:
            'https://ai.example.com/inference/deployments/0a1b2c3d',
          details: {
            resources: {
              backendDetails: {
                model: {
                  name: 'gpt-4o',
                  version: 'latest'
                }
              }
            },
            scaling: {
              backendDetails: {}
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

    nock(aiCoreDestination.url, {
      reqheaders: {
        'AI-Resource-Group': 'default'
      }
    })
      .get('/v2/lm/deployments')
      .reply(200, expectedResponse, {
        'Content-Type': 'application/json'
      });

    const result: AiDeploymentList = await DeploymentApi.deploymentQuery(
      {},
      { 'AI-Resource-Group': 'default' }
    ).execute();

    expect(result).toEqual(expectedResponse);
  });

  it('parses a successful response for post request with required headers', async () => {
    const expectedResponse: AiDeploymentCreationResponse = {
      deploymentUrl: '',
      id: '4e5f6g7h',
      message: 'Deployment scheduled',
      status: 'UNKNOWN'
    };

    nock(aiCoreDestination.url, {
      reqheaders: {
        'AI-Resource-Group': 'default',
        'some-test-header': 'test-header-value',
        'content-type': 'application/json',
        'ai-client-type': 'AI SDK JavaScript'
      }
    })
      .post('/v2/lm/deployments')
      .reply(200, expectedResponse, {
        'Content-Type': 'application/json'
      });

    const deploymentPostData: AiDeploymentCreationRequest = {
      configurationId: '3d2c1b0a'
    };

    const result: AiDeploymentCreationResponse =
      await DeploymentApi.deploymentCreate(deploymentPostData, {
        'AI-Resource-Group': 'default'
      })
        .addCustomHeaders({ 'some-test-header': 'test-header-value' })
        .execute();

    expect(result).toEqual(expectedResponse);
  });

  it('parses a successful response for patch request', async () => {
    const deploymentId = '4e5f6g7h';
    const expectedRequestBody = {
      targetStatus: 'STOPPED'
    };
    const expectedResponse: AiDeploymentModificationResponse = {
      id: '4e5f6g7h',
      message: 'Deployment modification scheduled'
    };
    nock(aiCoreDestination.url, {
      reqheaders: {
        'AI-Resource-Group': 'default'
      }
    })
      .patch(`/v2/lm/deployments/${deploymentId}`, body => {
        expect(body).toEqual(expectedRequestBody);
        expect(body).not.toHaveProperty('scenarioId');
        return true;
      })
      .reply(200, expectedResponse, {
        'Content-Type': 'application/json'
      });

    const deploymentPatchData: AiDeploymentModificationRequest = {
      targetStatus: 'STOPPED' as AiDeploymentTargetStatus
    };

    const result: AiDeploymentModificationResponse =
      await DeploymentApi.deploymentModify(deploymentId, deploymentPatchData, {
        'AI-Resource-Group': 'default'
      }).execute();

    expect(result).toEqual(expectedResponse);
  });

  it('parses a successful response for delete request', async () => {
    const deploymentId = '4e5f6g7h';
    const expectedResponse: AiDeploymentDeletionResponse = {
      id: '4e5f6g7h',
      message: 'Deletion scheduled',
      targetStatus: 'DELETED'
    };

    nock(aiCoreDestination.url, {
      reqheaders: {
        'AI-Resource-Group': 'default'
      }
    })
      .delete(`/v2/lm/deployments/${deploymentId}`)
      .reply(200, expectedResponse, {
        'Content-Type': 'application/json'
      });

    const result: AiDeploymentDeletionResponse =
      await DeploymentApi.deploymentDelete(deploymentId, {
        'AI-Resource-Group': 'default'
      }).execute();

    expect(result).toEqual(expectedResponse);
  });

  it('parses a successful response for delete request with custom destination', async () => {
    mockDestination();

    const deploymentId = '4e5f6g7h';
    const expectedResponse: AiDeploymentDeletionResponse = {
      id: '4e5f6g7h',
      message: 'Deletion scheduled',
      targetStatus: 'DELETED'
    };

    nock('http://example.com', {
      reqheaders: {
        'AI-Resource-Group': 'default'
      }
    })
      .delete(`/v2/lm/deployments/${deploymentId}`)
      .reply(200, expectedResponse, {
        'Content-Type': 'application/json'
      });

    const result: AiDeploymentDeletionResponse =
      await DeploymentApi.deploymentDelete(deploymentId, {
        'AI-Resource-Group': 'default'
      }).execute({
        destinationName: 'aicore'
      });

    expect(result).toEqual(expectedResponse);
  });
});
