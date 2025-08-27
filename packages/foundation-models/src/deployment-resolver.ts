import { resolveDeploymentId, type DeploymentResolutionOptions, type ModelDeployment, type ModelConfig } from '@sap-ai-sdk/ai-api/internal.js';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

function isDeploymentIdConfig(
  modelDeployment: ModelDeployment
): modelDeployment is { deploymentId: string } {
  return (
    typeof modelDeployment === 'object' && 'deploymentId' in modelDeployment
  );
}

function translateToFoundationModel(modelConfig: ModelConfig): { name: string; version?: string } {
  if (typeof modelConfig === 'string') {
    return { name: modelConfig };
  }

  return {
    name: modelConfig.modelName,
    ...(modelConfig.modelVersion && { version: modelConfig.modelVersion })
  };
}

/**
 * Get the deployment ID for a foundation model scenario.
 * @param modelDeployment - This configuration is used to retrieve a deployment. Depending on the configuration use either the given deployment ID or the model name to retrieve matching deployments. If model and deployment ID are given, the model is verified against the deployment.
 * @param scenarioId - The scenario ID.
 * @param destination - The destination to use for the request.
 * @returns The ID of the deployment, if found.
 */
export async function getFoundationModelDeploymentId(
  modelDeployment: ModelDeployment,
  scenarioId: string,
  destination?: HttpDestinationOrFetchOptions
): Promise<string> {
  if (isDeploymentIdConfig(modelDeployment)) {
    return modelDeployment.deploymentId;
  }

  const model =
    typeof modelDeployment === 'string'
      ? { modelName: modelDeployment }
      : modelDeployment;

  return resolveDeploymentId({
    scenarioId,
    executableId: 'foundation-models',
    model: translateToFoundationModel(model),
    resourceGroup: model.resourceGroup,
    destination
  } as DeploymentResolutionOptions);
}