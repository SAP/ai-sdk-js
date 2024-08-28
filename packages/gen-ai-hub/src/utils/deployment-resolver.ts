import { DeploymentApi, AiDeployment } from '@sap-ai-sdk/ai-core';
import { CustomRequestConfig } from '@sap-ai-sdk/core';
import { pickValueIgnoreCase } from '@sap-cloud-sdk/util';

/**
 * The model deployment configuration when using a model. It can be either the name of the model or an object containing the name and version of the model.
 * @typeParam ModelNameT - String literal type representing the name of the model.
 */
export type ModelConfiguration<ModelNameT = string> =
  | ModelNameT
  | {
      /**
       * The name of the model.
       */
      modelName: ModelNameT;
      /**
       * The version of the model.
       */
      modelVersion?: string;
    };

/**
 * The deployment configuration when using a deployment ID.
 */
export interface DeploymentIdConfiguration {
  /**
   * The deployment ID.
   */
  deploymentId: string;
}

/**
 * The deployment configuration can be either a model configuration or a deployment ID configuration.
 * @typeParam ModelNameT - String literal type representing the name of the model.
 */
export type ModelDeployment<ModelNameT = string> =
  | ModelConfiguration<ModelNameT>
  | DeploymentIdConfiguration;

/**
 * Type guard to check if the given deployment configuration is a deployment ID configuration.
 * @param deploymentConfig - Configuration to check.
 * @returns `true` if the configuration is a deployment ID configuration, `false` otherwise.
 */
export function isDeploymentIdConfiguration(
  deploymentConfig: ModelDeployment
): deploymentConfig is DeploymentIdConfiguration {
  return (
    typeof deploymentConfig === 'object' && 'deploymentId' in deploymentConfig
  );
}

/**
 * A foundation model is identified by its name and potentially a version.
 */
export interface FoundationModel {
  /**
   * The name of the model.
   */
  name: string;
  /**
   * The version of the model.
   */
  version?: string;
}

/**
 * The options for the deployment resolution.
 */
interface DeploymentResolutionOptions {
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
   * The group ID of the deployment.
   */
  groupId?: string;
}

/**
 * Query the AI Core service for a deployment that matches the given criteria. If more than one deployment matches the criteria, the first one is returned.
 * @param opts - The options for the deployment resolution.
 * @returns A promise of a deployment, if a deployment was found, fails otherwise.
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
      'No deployment matched the given criteria: ' + JSON.stringify(opts)
    );
  }
  return deployments[0];
}

async function getAllDeployments(
  opts: DeploymentResolutionOptions
): Promise<AiDeployment[]> {
  const { scenarioId, executableId, groupId = 'default' } = opts;
  // TODO: add a cache: https://github.tools.sap/AI/gen-ai-hub-sdk-js-backlog/issues/78
  try {
    return (
      await DeploymentApi.deploymentQuery(
        {
          scenarioId,
          status: 'RUNNING',
          ...(executableId && { executableIds: [executableId] })
        },
        { 'AI-Resource-Group': groupId }
      ).execute()
    ).resources;
  } catch (error) {
    throw new Error('Failed to fetch the list of deployments: ' + error);
  }
}

function extractModel(
  deployment: AiDeployment
): Partial<FoundationModel> | undefined {
  return deployment.details?.resources?.backend_details?.model;
}

/**
 * Get the deployment ID for a given model deployment configuration and executable ID.
 * @param modelDeployment - The model deployment configuration.
 * @param executableId - The executable ID.
 * @param requestConfig - The request configuration.
 * @returns The ID of the deployment, if found.
 */
export async function getDeploymentId(
  modelDeployment: ModelDeployment,
  executableId: string,
  requestConfig?: CustomRequestConfig
): Promise<string> {
  if (isDeploymentIdConfiguration(modelDeployment)) {
    return modelDeployment.deploymentId;
  }

  return (
    await resolveDeployment({
      scenarioId: 'foundation-models',
      executableId,
      model: translateToFoundationModel(modelDeployment),
      groupId: pickValueIgnoreCase(requestConfig?.headers, 'ai-resource-group')
    })
  ).id;
}

function translateToFoundationModel(
  modelConfig: ModelConfiguration
): FoundationModel {
  if (typeof modelConfig === 'string') {
    return { name: modelConfig };
  }

  return {
    name: modelConfig.modelName,
    ...(modelConfig.modelVersion && { version: modelConfig.modelVersion })
  };
}
