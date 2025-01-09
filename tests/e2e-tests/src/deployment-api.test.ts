import { DeploymentApi } from '@sap-ai-sdk/ai-api';
import { getDeployments, createDeployment } from '@sap-ai-sdk/sample-code';
import { loadEnv } from './utils/load-env.js';
import { configurationId, resourceGroup } from './utils/ai-api-utils.js';

loadEnv();

describe('DeploymentApi', () => {
  let createdDeploymentId: string | undefined;

  it('should get all deployments', async () => {
    const queryResponse = await getDeployments(resourceGroup);
    expect(queryResponse).toBeDefined();
    expect(queryResponse).toMatchObject({
      count: expect.any(Number),
      resources: expect.any(Array)
    });
  });

  it('should create and delete a deployment', async () => {
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

    createdDeploymentId = createResponse.id;

    // A deployment initially has status: 'UNKNOWN' and can be deleted immediately
    // without needing to stop the deployment

    const deleteResponse = await DeploymentApi.deploymentDelete(
      createdDeploymentId,
      {
        'AI-Resource-Group': resourceGroup
      }
    ).execute();
    expect(deleteResponse).toEqual(
      expect.objectContaining({
        message: 'Deletion scheduled'
      })
    );

    const deletedDeployment = await DeploymentApi.deploymentGet(
      createdDeploymentId,
      {},
      { 'AI-Resource-Group': resourceGroup }
    ).execute();
    expect(deletedDeployment.targetStatus).toBe('DELETED');
  });

  afterAll(async () => {
    // Wait for deployment to be deleted
    await new Promise(r => setTimeout(r, 60000));
    const finalDeployments = await getDeployments(resourceGroup);

    if (finalDeployments.count) {
      expect(
        finalDeployments.resources.map(deployment => deployment.id)
      ).not.toContain(createdDeploymentId);
    }
  }, 75000);
});
