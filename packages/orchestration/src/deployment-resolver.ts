import { resolveDeploymentId } from '@sap-ai-sdk/ai-api/internal.js';
import type {
  DeploymentIdConfig,
  ResourceGroupConfig
} from '@sap-ai-sdk/ai-api/internal.js';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

/**
 * Get the deployment ID for an orchestration scenario.
 * @param deploymentConfig - The deployment configuration (resource group or deployment ID).
 * @param executableId - The executable ID.
 * @param destination - The destination to use for the request.
 * @returns The ID of the deployment, if found.
 */
export async function getOrchestrationDeploymentId(
  deploymentConfig: ResourceGroupConfig | DeploymentIdConfig,
  executableId: string,
  destination?: HttpDestinationOrFetchOptions
): Promise<string> {
  if (
    typeof deploymentConfig === 'object' &&
    'deploymentId' in deploymentConfig
  ) {
    return deploymentConfig.deploymentId;
  }

  return resolveDeploymentId({
    scenarioId: 'orchestration',
    ...(deploymentConfig ?? {}),
    destination
  });
}
