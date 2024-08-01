import { DeploymentApi } from '@sap-ai-sdk/ai-core';

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

export class AiDeployment {
  id: string;
  scenarioId?: string;
  resourceGroup?: string;
  constructor(deploymentId: string) {
    this.id = deploymentId;
  }
}

export type DeploymentResolver = AiDeployment | (() => Promise<AiDeployment>);

// TODO: figure out what the best search criteria are
// TODO: discuss to use model?: FoundationModel instead for a search
export async function resolveDeployment(opts: { scenarioId: string, executableId?: string, modelName?: string, modelVersion?: string }): Promise<AiDeployment> {
  var deploymentList = await DeploymentApi
    .deploymentQuery({ scenarioId: opts.scenarioId, status: "RUNNING", executableIds: opts.executableId ? [opts.executableId] : undefined }, { "AI-Resource-Group": "default" })
    .execute({ destinationName: "aicore" }).then((res) => res.resources);
  // TODO: proper error handling
  if (opts.modelName) {
    // TODO: actually implement filtering
    deploymentList = deploymentList.filter((deployment: any) => deployment.modelName === opts.modelName);
  }
  if (opts.modelVersion) {
    // TODO: smart handling of 'latest' version
    deploymentList = deploymentList.filter((deployment: any) => deployment.modelVersion === opts.modelVersion);
  }
  if (deploymentList.length === 0) {
    throw new Error('No deployment matched the given criteria: ' + JSON.stringify(opts));
  }
  const deployment = deploymentList[0];
  const result = new AiDeployment(deployment.id)
  result.scenarioId = deployment.scenarioId;
  return result;
}