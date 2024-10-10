import { createLogger } from '@sap-cloud-sdk/util';
import {
  deleteDeployment,
  getDeployments,
  stopDeployment
} from '@sap-ai-sdk/sample-code';
import { loadEnv } from './load-env.js';
import {
  resourceGroup,
  waitForDeploymentToReachStatus
} from './ai-api-utils.js';
import type { AiApiError } from '@sap-ai-sdk/ai-api';

loadEnv();

const logger = createLogger('e2e-cleanup-deployments');

cleanupDeployments().catch(err => {
  logger.error(err);
  process.exit(1);
});

async function cleanupDeployments(): Promise<void> {
  try {
    const deployments = await getDeployments(resourceGroup);
    logger.info(`Found ${deployments.count} deployments to cleanup.`);
    if (deployments.count) {
      logger.info('Starting deployment cleanup process.');
      await Promise.all(
        deployments.resources.map(async deployment => {
          const { id, status, targetStatus } = deployment;
          if (
            status !== 'STOPPED' &&
            targetStatus !== 'STOPPED' &&
            status !== 'UNKNOWN'
          ) {
            await stopDeployment(id, resourceGroup);
            await waitForDeploymentToReachStatus(id, 'STOPPED');
          } else if (status !== 'STOPPED' && targetStatus === 'STOPPED') {
            await waitForDeploymentToReachStatus(id, 'STOPPED');
          }

          await deleteDeployment(id, resourceGroup);
          // Wait for deletion to complete
          await new Promise(r => setTimeout(r, 25000));
        })
      );
      logger.info('Deployment cleanup successful.');
    }
  } catch (errorData: any) {
    const apiError = errorData.response.data.error as AiApiError;
    throw new Error(
      `Deployment cleanup failed: ${apiError.message}. Manual action is required.`
    );
  }
}
