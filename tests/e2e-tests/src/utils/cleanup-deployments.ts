import { createLogger } from '@sap-cloud-sdk/util';
import { getDeployments } from '@sap-ai-sdk/sample-code';
import { DeploymentApi } from '@sap-ai-sdk/ai-api';
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
          const { id, status } = deployment;
          if (status !== 'STOPPED' && status !== 'UNKNOWN') {
            await DeploymentApi.deploymentModify(
              id,
              { targetStatus: 'STOPPED' },
              { 'AI-Resource-Group': resourceGroup }
            ).execute();
            await waitForDeploymentToReachStatus(id, 'STOPPED');
          }
          await DeploymentApi.deploymentDelete(id, {
            'AI-Resource-Group': resourceGroup
          }).execute();
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
