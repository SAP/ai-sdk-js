import { DeploymentApi, AiDeployment } from '@sap-ai-sdk/ai-core';

// TODO: docs
/* eslint-disable */

export type DeploymentResolver = DeploymentId | (() => Promise<AiDeployment>);
export type DeploymentId = string;

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
  modelName?: string;
  modelVersion?: string;
}): Promise<AiDeployment> {
  // TODO: is there a more elegant way to write this in TS?
  let query: any;
  if (opts.executableId) {
    query = {
      scenarioId: opts.scenarioId,
      status: 'RUNNING',
      executableIds: [opts.executableId]
    };
  } else {
    query = { scenarioId: opts.scenarioId, status: 'RUNNING' };
  }

  // TODO: add a cache
  let deploymentList: AiDeployment[];
  try {
    deploymentList = await DeploymentApi.deploymentQuery(query, {
      'AI-Resource-Group': 'default'
    })
      .execute()
      .then(res => res.resources);
  } catch (error) {
    throw new Error('Failed to fetch the list of deployments: ' + error);
  }

  if (opts.modelName) {
    deploymentList = deploymentList.filter(
      (deployment: any) =>
        modelExtractor(deployment)?.modelName === opts.modelName
    );
  }
  if (opts.modelVersion) {
    // feature idea: smart handling of 'latest' version
    deploymentList = deploymentList.filter(
      (deployment: any) =>
        modelExtractor(deployment)?.modelVersion === opts.modelVersion
    );
  }
  if (deploymentList.length === 0) {
    // TODO: return undefined instead?
    throw new Error(
      'No deployment matched the given criteria: ' + JSON.stringify(opts)
    );
  }
  return deploymentList[0];
}

const modelExtractor = (deployment: any) =>
  deployment.details?.resources?.backend_details?.model;
