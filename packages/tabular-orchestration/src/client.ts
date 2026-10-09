import {
  isDeploymentIdConfig,
  resolveDeploymentId
} from '@sap-ai-sdk/ai-api/internal.js';

import { PredictApi } from './client/tabular-orchestration/index.ts';

import type {
  DeploymentIdConfig,
  ResourceGroupConfig
} from '@sap-ai-sdk/ai-api';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';
import type { CustomRequestConfig } from '@sap-cloud-sdk/http-client';

import type { PredictResponse } from './client/tabular-orchestration/index.ts';
import type {
  ModelConfigRegistry,
  TabularOrchestrationPredictRequest
} from './types.ts';

/**
 * Deployment configuration for the Tabular AI Orchestration service.
 * If no deployment ID is given, a running deployment of the `tabular-orchestration` scenario is resolved in the given resource group.
 */
export type TabularOrchestrationDeploymentConfig =
  | ResourceGroupConfig
  | (DeploymentIdConfig & ResourceGroupConfig);

/**
 * Client for predictions with Tabular Foundation Models through the Tabular AI Orchestration service.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class TabularOrchestrationClient {
  private deploymentConfig: TabularOrchestrationDeploymentConfig;
  private destination?: HttpDestinationOrFetchOptions;

  /**
   * Creates an instance of the Tabular Orchestration client.
   * @param deploymentConfig - Deployment configuration. Defaults to resolving a deployment in the `default` resource group.
   * @param destination - The destination to use for the request.
   */
  constructor(
    deploymentConfig: TabularOrchestrationDeploymentConfig = {},
    destination?: HttpDestinationOrFetchOptions
  ) {
    this.deploymentConfig = deploymentConfig;
    this.destination = destination;
  }

  /**
   * Make predictions for tabular data.
   * @param body - Prediction request.
   * @param requestConfig - Custom request configuration.
   * @returns Prediction response.
   */
  async predict<ModelName extends keyof ModelConfigRegistry>(
    body: TabularOrchestrationPredictRequest<ModelName>,
    requestConfig?: CustomRequestConfig
  ): Promise<PredictResponse> {
    const resourceGroup = this.deploymentConfig.resourceGroup ?? 'default';
    const deploymentId = await this.getDeploymentId(resourceGroup);

    return PredictApi.predict(body, { 'ai-resource-group': resourceGroup })
      .setBasePath(`/inference/deployments/${deploymentId}`)
      .execute(this.destination, requestConfig);
  }

  private async getDeploymentId(resourceGroup: string): Promise<string> {
    if (isDeploymentIdConfig(this.deploymentConfig)) {
      return this.deploymentConfig.deploymentId;
    }
    return resolveDeploymentId({
      scenarioId: 'tabular-orchestration',
      resourceGroup,
      destination: this.destination
    });
  }
}
