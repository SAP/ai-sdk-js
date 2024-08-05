import { DeploymentApi, Deployment } from '@sap-ai-sdk/ai-core';
import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import { getAiCoreDestination } from './context.js';

export interface ChatModel extends FoundationModel {
  type: 'chat';
};

export interface EmbeddingModel extends FoundationModel {
  type: 'embedding';
};

export interface FoundationModel {
  name: string;
  type: string;
  version: string;
}

export interface AiDeployment {
  id: string;
  scenarioId?: string;
}

export type DeploymentResolver = AiDeployment | (() => Promise<AiDeployment>);

// TODO: figure out what the best search criteria are
// TODO: discuss to use model?: FoundationModel instead for a search
/**
 * Query the AI Core service for a deployment that matches the given criteria. If more than one deployment matches the criteria, the first one is returned.
 * @param opts - An object containing the search criteria. A scenario is required, other criteria are optional.
 * @param destination - (optional) The destination to use for the request. If not provided, the default AI Core destination is used.
 * @returns An AiDeployment, if a deployment was found, fails otherwise.
 */
export async function resolveDeployment(opts: { scenarioId: string; executableId?: string; modelName?: string; modelVersion?: string }, destination?: HttpDestination): Promise<AiDeployment> {
  if (!destination) {
    destination = await getAiCoreDestination();
  }

  // TODO: is there a more elegant way to write this in TS?
  let query: any;
  if (opts.executableId) {
    query = { scenarioId: opts.scenarioId, status: 'RUNNING', executableIds: [opts.executableId] }
  } else {
    query = { scenarioId: opts.scenarioId, status: 'RUNNING' }
  }

  // TODO: add a cache
  let deploymentList: Deployment[];
  try {
    deploymentList = await DeploymentApi
      .deploymentQuery(query, { 'AI-Resource-Group': 'default' })
      .execute(destination).then((res) => res.resources);
  } catch (error) {
    throw new Error('Failed to fetch the list of deployments: ' + error);
  }

  if (opts.modelName) {
    deploymentList = deploymentList.filter((deployment: any) => modelExtractor(deployment)?.modelName === opts.modelName);
  }
  if (opts.modelVersion) {
    // feature idea: smart handling of 'latest' version
    deploymentList = deploymentList.filter((deployment: any) => modelExtractor(deployment)?.modelVersion === opts.modelVersion);
  }
  if (deploymentList.length === 0) {
    // TODO: return undefined instead?
    throw new Error('No deployment matched the given criteria: ' + JSON.stringify(opts));
  }
  const { id, scenarioId } = deploymentList[0];
	return { id, scenarioId };
}

const modelExtractor = (deployment: any) => deployment.details?.resources?.backend_details?.model;
