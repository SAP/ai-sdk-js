import {
  resolveDeployment,
  type ResourceGroupConfig
} from '@sap-ai-sdk/ai-api/internal.js';

import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

// Imported after `pnpm generate` — generated from spec/tabular-orchestration.yaml
import type {
  PredictRequest,
  PredictResponse
} from './client/tabular-orchestration/index.ts';

const scenarioId = 'tabular-orchestration';

/**
 * Client for making predictions using a deployed Tabular Foundation Model.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class TabularOrchestrationClient {
  private resourceGroup: string;
  private destination?: HttpDestinationOrFetchOptions;

  /**
   * Creates an instance of the Tabular Orchestration client.
   * @param config - Client configuration, optionally specifying a resource group.
   * @param destination - The destination to use for the request.
   */
  constructor(
    config: ResourceGroupConfig = {},
    destination?: HttpDestinationOrFetchOptions
  ) {
    this.resourceGroup = config.resourceGroup ?? 'default';
    this.destination = destination;
  }

  /**
   * Make a prediction for tabular data.
   * @param body - The prediction request body.
   * @returns The prediction response.
   */
  async predict(body: PredictRequest): Promise<PredictResponse> {
    const deployment = await resolveDeployment({
      scenarioId,
      resourceGroup: this.resourceGroup,
      destination: this.destination
    });

    if (!deployment.deploymentUrl) {
      throw new Error(
        `Deployment '${deployment.id}' for scenario '${scenarioId}' has no deployment URL. Ensure the deployment is running.`
      );
    }

    const { PredictApi } =
      await import('./client/tabular-orchestration/index.ts');
    return PredictApi.predictV1PredictPost(body, {
      'ai-resource-group': this.resourceGroup
    }).execute({ url: deployment.deploymentUrl });
  }
}
