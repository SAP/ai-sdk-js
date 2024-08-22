import {
  DeploymentApi,
  AiDeployment,
  AiDeploymentStatus
} from '@sap-ai-sdk/ai-core';

// TODO: docs
/* eslint-disable */

export type DeploymentResolver = DeploymentId | (() => Promise<AiDeployment>);
export type DeploymentId = string;
export type FoundationModel = { name: string; version?: string };

// TODO: figure out what the best search criteria are
/**
 * Query the AI Core service for a deployment that matches the given criteria. If more than one deployment matches the criteria, the first one is returned.
 * @param opts.scenarioId - The scenario ID of the deployment.
 * @param opts.executableId - The executable of the deployment.
 * @param opts.modelName - The name of the model of the deployment.
 * @param opts.modelVersion - The version of the model of the deployment.
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

  if (deploymentList.length === 0) {
    throw new Error(
      'No deployment matched the given criteria: ' + JSON.stringify(opts)
    );
  }
  return deploymentList[0];
}

const extractModel = (deployment: AiDeployment) =>
  deployment.details?.resources?.backend_details?.model;
