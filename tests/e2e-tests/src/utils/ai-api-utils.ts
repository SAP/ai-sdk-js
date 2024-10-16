import retry from 'async-retry';
import { DeploymentApi } from '@sap-ai-sdk/ai-api';
import type { AiDeployment } from '@sap-ai-sdk/ai-api';

/**
 * @internal
 */
export const resourceGroup = 'ai-sdk-js-e2e';

/**
 * @internal
 */
export const configurationId = '54cc966d-8bc1-44ab-a9dc-658d59ef205d';

/**
 * @internal
 */
export async function waitForDeploymentToReachStatus(
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
      retries: 20,
      minTimeout: 5000,
      factor: 1
    }
  );
}
