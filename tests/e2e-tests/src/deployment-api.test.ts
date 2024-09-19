import { loadEnv } from './utils/load-env.js';
import { resourceGroup } from './utils/ai-api-utils.js';
import retry from 'async-retry';
import {
  AiDeployment,
  AiDeploymentList,
  DeploymentApi
} from '@sap-ai-sdk/ai-api';

loadEnv();

describe('DeploymentApi', () => {
  let createdDeploymentId: string | undefined;
  let initialState: AiDeploymentList | undefined;

  beforeAll(async () => {
    const queryResponse = await DeploymentApi.deploymentQuery(
      {},
      { 'AI-Resource-Group': resourceGroup }
    ).execute();
    expect(queryResponse).toBeDefined();
    initialState = queryResponse;
  });

  it('should create a deployment and wait for it to run', async () => {
    const createResponse = await DeploymentApi.deploymentCreate(
      { configurationId: '54cc966d-8bc1-44ab-a9dc-658d59ef205d' },
      { 'AI-Resource-Group': resourceGroup }
    ).execute();

    expect(createResponse).toEqual(expect.objectContaining({
      message: 'Deployment scheduled.',
      id: expect.anything()
    }));

    const runningDeployment = await waitForDeploymentToReachStatus(
      createResponse.id,
      'RUNNING'
    );

    expect(runningDeployment).toEqual(expect.objectContaining({
      status: 'RUNNING',
      deploymentUrl: expect.any(String)
    }));

    createdDeploymentId = runningDeployment.id;
  }, 180000);

  it('should modify the deployment to stop it', async () => {
    const deploymentId = getDeploymentId(createdDeploymentId);

    const modifyResponse = await DeploymentApi.deploymentModify(
      deploymentId,
      { targetStatus: 'STOPPED' },
      { 'AI-Resource-Group': resourceGroup }
    ).execute();

    expect(modifyResponse).toEqual(expect.objectContaining({
      message: 'Deployment modification scheduled'
    }));

    const stoppedDeployment = await waitForDeploymentToReachStatus(
      deploymentId,
      'STOPPED'
    );

    expect(stoppedDeployment).toEqual(expect.objectContaining({
      status: 'STOPPED'
    }));
  }, 180000);

  it('should delete the deployment', async () => {
    const deploymentId = getDeploymentId(createdDeploymentId);
    const deleteResponse = await DeploymentApi.deploymentDelete(
      deploymentId,
      { 'AI-Resource-Group': resourceGroup }
    ).execute();

    expect(deleteResponse).toEqual(expect.objectContaining({
      message: 'Deletion scheduled'
    }));
  });

  afterAll(async () => {
    getDeploymentId(createdDeploymentId);
    // Wait for deletion to complete
    await new Promise(r => setTimeout(r, 15000));
    const queryResponse = await DeploymentApi.deploymentQuery(
      {},
      { 'AI-Resource-Group': resourceGroup }
    ).execute();
    expect(queryResponse).toBeDefined();

    const sanitizedInitialState = sanitizedState(initialState);
    const sanitizedEndState = sanitizedState(queryResponse);
    expect(sanitizedEndState).toStrictEqual(sanitizedInitialState);
  }, 30000);
});

const sanitizedState = (state: AiDeploymentList | undefined) => ({
  ...state,
  resources: state?.resources.map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ modifiedAt, ...rest }) => rest
  )
});

function getDeploymentId(id: string | undefined): string {
  if (id === undefined) {
    throw new Error("deploymentId is not defined.");
  }
  return id;
}

async function waitForDeploymentToReachStatus(
  deploymentId: string,
  targetStatus: 'RUNNING' | 'STOPPED'
): Promise<AiDeployment> {
  return retry(
    async () => {
      const deploymentDetail = await DeploymentApi.deploymentGet(
        deploymentId,
        {},
        { 'AI-Resource-Group': resourceGroup }
      ).execute();

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