import retry from 'async-retry';
import { AiDeployment } from '@sap-ai-sdk/ai-api';
import { getDeployment } from '@sap-ai-sdk/sample-code';

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
