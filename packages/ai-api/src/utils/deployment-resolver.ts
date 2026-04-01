import { ErrorWithCause } from '@sap-cloud-sdk/util';
import {
  type AiDeployment,
  DeploymentApi
} from '../client/AI_CORE_API/index.js';
import { deploymentCache } from './deployment-cache.js';
import {
  extractModel,
  translateToFoundationModel,
  type FoundationModel
} from './model.js';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

/**
 * The model deployment configuration when using a model.
 * @template ModelNameT - String literal type representing the name of the model.
 */
export interface ModelConfig<ModelNameT = string> {
  /**
   * The name of the model.
   */
  modelName: ModelNameT;
  /**
   * The version of the model.
   */
  modelVersion?: string;
}

/**
 * The deployment configuration when using a deployment ID.
 */
export interface DeploymentIdConfig {
  /**
   * The deployment ID.
   */
  deploymentId: string;
}

/**
 * The deployment configuration when using a resource group.
 */
export interface ResourceGroupConfig {
  /**
   * The resource group of the deployment.
   */
  resourceGroup?: string;
}

/**
 * The configuration of a model deployment.
 * @template ModelNameT - String literal type representing the name of the model.
 */
export type ModelDeployment<ModelNameT = string> =
  | ModelNameT
  | ((ModelConfig<ModelNameT> | DeploymentIdConfig) & ResourceGroupConfig);

/**
 * @internal
 */
export function getResourceGroup(
  modelDeployment: ModelDeployment
): string | undefined {
  return typeof modelDeployment === 'object'
    ? modelDeployment.resourceGroup
    : undefined;
}

/**
 * The options for the deployment resolution.
 * @internal
 */
export interface DeploymentResolutionOptions {
  /**
   * The scenario ID of the deployment.
   */
  scenarioId: string;
  /**
   * The name and potentially version of the model to look for.
   */
  model?: FoundationModel;
  /**
   * The executable ID of the deployment.
   */
  executableId?: string;
  /**
   * The resource group of the deployment.
   */
  resourceGroup?: string;
  /**
   * The destination to use for the request.
   */
  destination?: HttpDestinationOrFetchOptions;
}

/**
 * Query the AI Core service for a deployment that matches the given criteria.
 * If more than one deployment matches the criteria, the first one's ID is returned.
 * @param opts - The options for the deployment resolution.
 * @returns A promise of a deployment, if a deployment was found, fails otherwise.
 * @internal
 */
export async function resolveDeployment(
  opts: DeploymentResolutionOptions
): Promise<AiDeployment> {
  const { model } = opts;
  let deployments = await getAllDeployments(opts);

  if (model) {
    deployments = deployments.filter(
      deployment => extractModel(deployment)?.name === model.name
    );
    if (model.version) {
      deployments = deployments.filter(
        deployment => extractModel(deployment)?.version === model.version
      );
    }
  }

  if (!deployments.length) {
    throw new Error(
      `No deployment matched the given criteria: ${JSON.stringify(opts)}. Make sure the deployment is successful, as it is a prerequisite before consuming orchestration or foundation models.`
    );
  }
  return deployments[0];
}

/**
 * Type guard to check if the model deployment is a deployment ID config.
 * @param modelDeployment - The model deployment configuration.
 * @returns Whether the model deployment is a deployment ID config.
 * @internal
 */
export function isDeploymentIdConfig(
  modelDeployment: ModelDeployment | ResourceGroupConfig
): modelDeployment is { deploymentId: string } {
  return (
    typeof modelDeployment === 'object' && 'deploymentId' in modelDeployment
  );
}

/**
 * Query the AI Core service for a deployment that matches the given criteria.
 * If more than one deployment matches the criteria, the first one's ID is returned.
 * @param opts - The options for the deployment resolution.
 * @returns A promise of a deployment, if a deployment was found, fails otherwise.
 * @internal
 */
export async function resolveDeploymentId(
  opts: DeploymentResolutionOptions
): Promise<string> {
  const cachedDeployment = deploymentCache.get(opts);
  if (cachedDeployment?.id) {
    return cachedDeployment.id;
  }
  return (await resolveDeployment(opts)).id;
}

/**
 * Query the AI Core service for a deployment that matches the given criteria.
 * If more than one deployment matches the criteria, the first one's URL is returned.
 * @param opts - The options for the deployment resolution.
 * @returns A promise of the deployment URL, if a deployment was found, fails otherwise.
 */
export async function resolveDeploymentUrl(
  opts: DeploymentResolutionOptions
): Promise<string | undefined> {
  const cachedDeployment = deploymentCache.get(opts);
  if (cachedDeployment?.url) {
    return cachedDeployment.url;
  }
  return (await resolveDeployment(opts)).deploymentUrl;
}

/**
 * Get all deployments that match the given criteria.
 * @param opts - The options for the deployment resolution.
 * @returns A promise of an array of deployments.
 * @internal
 */
export async function getAllDeployments(
  opts: DeploymentResolutionOptions
): Promise<AiDeployment[]> {
  const {
    destination,
    scenarioId,
    executableId,
    resourceGroup = 'default'
  } = opts;
  try {
    const { resources } = await DeploymentApi.deploymentQuery(
      {
        scenarioId,
        status: 'RUNNING',
        ...(executableId && { executableIds: [executableId] })
      },
      { 'AI-Resource-Group': resourceGroup }
    ).execute(destination);

    deploymentCache.setAll(opts, resources);

    return resources;
  } catch (error: any) {
    throw new ErrorWithCause('Failed to fetch the list of deployments.', error);
  }
}

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

/**
 * Get the deployment ID for an orchestration scenario.
 * @param deploymentConfig - The deployment configuration (resource group or deployment ID).
 * @param destination - The destination to use for the request.
 * @returns The ID of the deployment, if found.
 * @internal
 */
export async function getOrchestrationDeploymentId(
  deploymentConfig: ResourceGroupConfig | DeploymentIdConfig,
  destination?: HttpDestinationOrFetchOptions
): Promise<string> {
  if (isDeploymentIdConfig(deploymentConfig)) {
    return deploymentConfig.deploymentId;
  }

  return resolveDeploymentId({
    scenarioId: 'orchestration',
    ...deploymentConfig,
    destination
  });
}
