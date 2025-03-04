import { ErrorWithCause } from '@sap-cloud-sdk/util';
import {
  type AiDeployment,
  DeploymentApi
} from '../client/AI_CORE_API/index.js';
import { deploymentCache } from './deployment-cache.js';
import { extractModel, type FoundationModel } from './model.js';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

/**
 * The model deployment configuration when using a model.
 * @typeParam ModelNameT - String literal type representing the name of the model.
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
 * @typeParam ModelNameT - String literal type representing the name of the model.
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
 * Type guard to check if the given deployment configuration is a deployment ID configuration.
 * @param modelDeployment - Configuration to check.
 * @returns `true` if the configuration is a deployment ID configuration, `false` otherwise.
 */
function isDeploymentIdConfig(
  modelDeployment: ModelDeployment
): modelDeployment is DeploymentIdConfig {
  return (
    typeof modelDeployment === 'object' && 'deploymentId' in modelDeployment
  );
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
 * Query the AI Core service for a deployment that matches the given criteria. If more than one deployment matches the criteria, the first one's ID is returned.
 * @param opts - The options for the deployment resolution.
 * @returns A promise of a deployment, if a deployment was found, fails otherwise.
 * @internal
 */
export async function resolveDeploymentId(
  opts: DeploymentResolutionOptions
): Promise<string> {
  const { model } = opts;

  const cachedDeployment = deploymentCache.get(opts);
  if (cachedDeployment?.id) {
    return cachedDeployment.id;
  }

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
  return deployments[0].id;
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
 * Get the deployment ID for a given model deployment configuration and executable ID using the 'foundation-models' scenario.
 * @param modelDeployment - The model deployment configuration.
 * @param executableId - The executable ID.
 * @returns The ID of the deployment, if found.
 * @internal
 */
export async function getDeploymentId(
  modelDeployment: ModelDeployment,
  executableId: string,
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
    scenarioId: 'foundation-models',
    executableId,
    model: translateToFoundationModel(model),
    resourceGroup: model.resourceGroup,
    destination
  });
}

function translateToFoundationModel(modelConfig: ModelConfig): FoundationModel {
  if (typeof modelConfig === 'string') {
    return { name: modelConfig };
  }

  return {
    name: modelConfig.modelName,
    ...(modelConfig.modelVersion && { version: modelConfig.modelVersion })
  };
}
