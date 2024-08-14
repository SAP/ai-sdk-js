import { DeploymentApi } from '@sap-ai-sdk/ai-core';
import 'dotenv/config';

describe('ai-core', () => {
  test.skip('should get deployments, but is currently broken', async () => {
    const deployments = await DeploymentApi.deploymentQuery(
      {},
      { 'AI-Resource-Group': 'default' }
    ).execute();
    expect(deployments).toBeDefined();
  });
});
