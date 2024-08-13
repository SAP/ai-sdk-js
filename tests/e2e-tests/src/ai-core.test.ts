import { DeploymentApi } from '@sap-ai-sdk/ai-core';
import { getAiCoreDestination } from '@sap-ai-sdk/core';
import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import 'dotenv/config';

describe('ai-core', () => {
  test.skip('should get deployments, but is currently broken', async () => {
    const d = (await getAiCoreDestination()) as HttpDestination;
    const deployments = await DeploymentApi.deploymentQuery(
      {},
      { 'AI-Resource-Group': 'default' }
    ).execute(d);
    expect(deployments).toBeDefined();
  });
});
