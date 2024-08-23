import {
  DeploymentApi,
  AiDeployment,
  AiDeploymentStatus
} from '@sap-ai-sdk/ai-core';

/**
 * A deployment resolver can be either a deployment ID or a function that returns a full deployment object.
 */
export type DeploymentResolver = DeploymentId | (() => Promise<AiDeployment>);
/**
 * A deployment ID is a string that uniquely identifies a deployment.
 */
export type DeploymentId = string;
/**
 * A foundation model is identifier by its name and potentially a version.
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
 * Query the AI Core service for a deployment that matches the given criteria. If more than one deployment matches the criteria, the first one is returned.
 * @param opts - The options for the deployment resolution.
 * @param opts.scenarioId - The scenario ID of the deployment.
 * @param opts.executableId - The executable of the deployment.
 * @param opts.model - The name and potentially version of the model to look for.
 * @returns An AiDeployment, if a deployment was found, fails otherwise.
 */
export async function resolveDeployment(opts: {
  scenarioId: string;
  executableId?: string;
  model?: FoundationModel;
}): Promise<AiDeployment> {
  const query = {
    scenarioId: opts.scenarioId,
    status: 'RUNNING' as AiDeploymentStatus,
    ...(opts.executableId && { executableIds: [opts.executableId] })
  };

  // TODO: add a cache: https://github.tools.sap/AI/gen-ai-hub-sdk-js-backlog/issues/78
  let deploymentList: AiDeployment[];
  const { deploymentQuery } = DeploymentApi;
  const resourceGroup = { 'AI-Resource-Group': 'default' };
  try {
    deploymentList = (await deploymentQuery(query, resourceGroup).execute())
      .resources;
  } catch (error) {
    throw new Error('Failed to fetch the list of deployments: ' + error);
  }

  if (opts.model) {
    deploymentList = deploymentList.filter(
      deployment => extractModel(deployment)?.name === opts.model!.name
    );
    if (opts.model.version) {
      // feature idea: smart handling of 'latest' version: treat 'latest' and the highest version number as the same
      deploymentList = deploymentList.filter(
        deployment => extractModel(deployment)?.version === opts.model!.version
      );
    }
  }

  if (!deploymentList.length) {
    throw new Error(
      'No deployment matched the given criteria: ' + JSON.stringify(opts)
    );
  }
  return deploymentList[0];
}

const extractModel = (deployment: AiDeployment) =>
  deployment.details?.resources?.backend_details?.model;
