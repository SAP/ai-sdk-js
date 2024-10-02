import retry from 'async-retry';
import { AiApiError, AiDeployment, AiDeploymentList } from '@sap-ai-sdk/ai-api';
import {
  getDeployment,
  getDeployments,
  createDeployment,
  modifyDeployment,
  deleteDeployment
} from '@sap-ai-sdk/sample-code';
import { loadEnv } from './utils/load-env.js';
import { configurationId, resourceGroup } from './utils/ai-api-utils.js';

// TODO: Make sure local test doesn't interfere with cloud test

loadEnv();

describe('DeploymentApi', () => {
  let createdDeploymentId: string | undefined;
  let initialState: AiDeploymentList | undefined;

  beforeAll(async () => {
    await cleanupDeployments();
    const queryResponse = await getDeployments(resourceGroup);
    expect(queryResponse).toBeDefined();
    initialState = queryResponse;
  }, 200000);

  afterAll(async () => {
    await cleanupDeployments();
  }, 200000);

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

  it('should modify the deployment to stop it', async () => {
    const deploymentId = await checkCreatedDeployment(
      createdDeploymentId,
      'RUNNING'
    );

    const modifyResponse = await modifyDeployment(deploymentId, resourceGroup);
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

    const deleteResponse = await deleteDeployment(deploymentId, resourceGroup);
    expect(deleteResponse).toEqual(
      expect.objectContaining({
        message: 'Deletion scheduled'
      })
    );

    // Wait for deletion to complete
    await new Promise(r => setTimeout(r, 30000));
    await expect(getDeployment(deploymentId, resourceGroup)).rejects.toThrow();

    createdDeploymentId = undefined; // Reset
  }, 100000);

  it('should validate consistency of deployments after test flow', async () => {
    const queryResponse = await getDeployments(resourceGroup);
    expect(queryResponse).toBeDefined();

    const sanitizedInitialState = sanitizedState(initialState);
    const sanitizedEndState = sanitizedState(queryResponse);
    expect(sanitizedEndState).toStrictEqual(sanitizedInitialState);
  });
});

const sanitizedState = (state: AiDeploymentList | undefined) => ({
  ...state,
  resources: state?.resources.map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ modifiedAt, ...rest }) => rest
  )
});

async function checkCreatedDeployment(
  deploymentId: string | undefined,
  status: 'RUNNING' | 'STOPPED'
): Promise<string> {
  if (deploymentId === undefined) {
    try {
      const response = await getDeployments(resourceGroup, status);
      if (response.count === 0) {
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

async function waitForDeploymentToReachStatus(
  deploymentId: string,
  targetStatus: 'RUNNING' | 'STOPPED'
): Promise<AiDeployment> {
  return retry(
    async () => {
      const deploymentDetail = await getDeployment(deploymentId, resourceGroup);
      if (deploymentDetail.status === targetStatus) {
        return deploymentDetail;
      }
      throw new Error(`Deployment has not yet reached ${targetStatus} status.`);
    },
    {
      retries: 30,
      minTimeout: 5000
    }
  );
}

async function cleanupDeployments(): Promise<void> {
  try {
    const deployments = await getDeployments(resourceGroup);

    if (deployments.count !== 0) {
      await Promise.all(
        deployments.resources.map(async deployment => {
          const { id, status, targetStatus } = deployment;

          if (
            status !== 'STOPPED' &&
            targetStatus !== 'STOPPED' &&
            status !== 'UNKNOWN'
          ) {
            await modifyDeployment(id, resourceGroup);
          }

          await waitForDeploymentToReachStatus(id, 'STOPPED');
          await deleteDeployment(id, resourceGroup);
          // Wait for deletion to complete
          await new Promise(r => setTimeout(r, 25000));
        })
      );
    }
  } catch (errorData: any) {
    const apiError = errorData.response.data.error as AiApiError;
    throw new Error(
      `Deployment cleanup failed: ${apiError.message}. Manual action is required.`
    );
  }
}
