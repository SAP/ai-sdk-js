import { DeploymentApi, AiDeployment } from '@sap-ai-sdk/ai-core';

/**
 * The deployment configuration when using a model. It can be either the name of the model or an object containing the name and version of the model.
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
export type DeploymentConfiguration<ModelNameT = string> =
  | ModelConfiguration<ModelNameT>
  | DeploymentIdConfiguration;

/**
 * Type guard to check if the given deployment configuration is a deployment ID configuration.
 * @param deploymentConfig - Configuration to check.
 * @returns `true` if the configuration is a deployment ID configuration, `false` otherwise.
 */
export function isDeploymentIdConfiguration(
  deploymentConfig: DeploymentConfiguration
): deploymentConfig is DeploymentIdConfiguration {
  return (
    typeof deploymentConfig === 'object' && 'deploymentId' in deploymentConfig
  );
}

/**
 * A deployment resolver can be either a deployment ID or a function that returns a full deployment object.
 */
export type DeploymentResolver = DeploymentId | (() => Promise<AiDeployment>);

/**
 * A deployment ID is a string that uniquely identifies a deployment.
 */
export type DeploymentId = string;

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
   * The executable ID of the deployment.
   */
  executableId?: string;
  /**
   * The name and potentially version of the model to look for.
   */
  model?: FoundationModel;
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
