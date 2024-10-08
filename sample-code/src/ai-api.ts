import { DeploymentApi } from '@sap-ai-sdk/ai-api';
import type { AiDeployment } from '@sap-ai-sdk/ai-api';

/**
 * Get all deployments.
 * @returns All deployments.
 */
export async function getDeployments(): Promise<AiDeployment[]> {
  const { data } = await DeploymentApi.deploymentQuery(
    {},
    { 'AI-Resource-Group': 'default' }
  ).execute();

  return data;
}
