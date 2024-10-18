import { DeploymentApi } from '@sap-ai-sdk/ai-api';
import { getDeployments, createDeployment } from '@sap-ai-sdk/sample-code';
import { loadEnv } from './utils/load-env.js';
import {
  configurationId,
  resourceGroup,
  waitForDeploymentToReachStatus
} from './utils/ai-api-utils.js';
import type { AiApiError, AiDeploymentList } from '@sap-ai-sdk/ai-api';

loadEnv();

describe('DeploymentApi', () => {
  let createdDeploymentId: string | undefined;
  let initialDeployments: AiDeploymentList | undefined;

  beforeAll(async () => {
    const queryResponse = await getDeployments(resourceGroup);
    expect(queryResponse).toBeDefined();
    initialDeployments = queryResponse;
  });

  it('should create a deployment and wait for it to run', async () => {
    const createResponse = await createDeployment(
      configurationId,
      resourceGroup
    );
    expect(createResponse).toEqual(
      expect.objectContaining({
        message: 'Deployment scheduled.',
        id: expect.anything()
      })
    );

    const runningDeployment = await waitForDeploymentToReachStatus(
      createResponse.id,
      'RUNNING'
    );
    expect(runningDeployment).toEqual(
      expect.objectContaining({
        status: 'RUNNING',
        deploymentUrl: expect.any(String)
      })
    );

    createdDeploymentId = runningDeployment.id;
  }, 200000);

  it('should stop the deployment', async () => {
    const deploymentId = await checkCreatedDeployment(
      createdDeploymentId,
      'RUNNING'
    );

    const modifyResponse = await DeploymentApi.deploymentModify(
      deploymentId,
      { targetStatus: 'STOPPED' },
      { 'AI-Resource-Group': resourceGroup }
    ).execute();
    expect(modifyResponse).toEqual(
      expect.objectContaining({
        message: 'Deployment modification scheduled'
      })
    );

    const stoppedDeployment = await waitForDeploymentToReachStatus(
      deploymentId,
      'STOPPED'
    );
    expect(stoppedDeployment).toEqual(
      expect.objectContaining({
        status: 'STOPPED'
      })
    );
  }, 200000);

  it('should delete the deployment', async () => {
    const deploymentId = await checkCreatedDeployment(
      createdDeploymentId,
      'STOPPED'
    );

    const deleteResponse = await DeploymentApi.deploymentDelete(deploymentId, {
      'AI-Resource-Group': resourceGroup
    }).execute();
    expect(deleteResponse).toEqual(
      expect.objectContaining({
        message: 'Deletion scheduled'
      })
    );

    // Wait for deletion to complete
    await new Promise(r => setTimeout(r, 30000));
    await expect(
      DeploymentApi.deploymentGet(
        deploymentId,
        {},
        { 'AI-Resource-Group': resourceGroup }
      ).execute()
    ).rejects.toThrow();
  }, 150000);

  it('should validate consistency of deployments after test flow', async () => {
    const queryResponse = await getDeployments(resourceGroup);
    expect(queryResponse).toBeDefined();

    const initialFilteredDeployments = filterDeployments(
      initialDeployments,
      createdDeploymentId
    );
    const finalFilteredDeployments = filterDeployments(
      queryResponse,
      createdDeploymentId
    );
    expect(finalFilteredDeployments.resources).toStrictEqual(
      initialFilteredDeployments.resources
    );
  });
});

const filterDeployments = (
  deployments: AiDeploymentList | undefined,
  createdDeployentId: string | undefined
) => ({
  ...deployments,
  resources: deployments?.resources
    .filter(deployment => deployment.id === createdDeployentId)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(({ modifiedAt, ...rest }) => rest)
});

async function checkCreatedDeployment(
  deploymentId: string | undefined,
  status: 'RUNNING' | 'STOPPED'
): Promise<string> {
  if (!deploymentId) {
    try {
      const response = await getDeployments(resourceGroup, status);
      if (!response.count) {
        throw new Error(
          `No ${status} deployments found, please ${status === 'RUNNING' ? 'create' : 'stop'} a deployment first to ${status === 'RUNNING' ? 'modify' : 'delete'} it.`
        );
      }
      return response.resources[0].id;
    } catch (error: any) {
      if (error.response) {
        const apiError = error.response.data.error as AiApiError;
        throw new Error(`Request failed: ${apiError.message}`);
      }
      throw error;
    }
  }
  return deploymentId;
}
