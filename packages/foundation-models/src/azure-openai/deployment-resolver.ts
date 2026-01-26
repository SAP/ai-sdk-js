import {
  resolveDeploymentId,
  isDeploymentIdConfig,
  getResourceGroup,
  translateToFoundationModel,
  type ModelDeployment
} from '@sap-ai-sdk/ai-api/internal.js';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

/**
 * Get the deployment ID for a foundation model scenario.
 * @param modelDeployment - This configuration is used to retrieve a deployment. Depending on the configuration use either the given deployment ID or the model name to retrieve matching deployments. If model and deployment ID are given, the model is verified against the deployment.
 * @param executableId - The scenario ID.
 * @param destination - The destination to use for the request.
 * @returns The ID of the deployment, if found.
 * @internal
 */
export async function getFoundationModelDeploymentId(
  modelDeployment: ModelDeployment,
  executableId: string,
  destination?: HttpDestinationOrFetchOptions
): Promise<string> {
  if (isDeploymentIdConfig(modelDeployment)) {
    return modelDeployment.deploymentId;
  }

  return resolveDeploymentId({
    scenarioId: 'foundation-models',
    executableId,
    model: translateToFoundationModel(modelDeployment),
    resourceGroup: getResourceGroup(modelDeployment),
    destination
  });
}
