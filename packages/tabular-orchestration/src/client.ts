import {
  resolveDeployment,
  type ResourceGroupConfig
} from '@sap-ai-sdk/ai-api/internal.js';
import { executeRequest } from '@sap-ai-sdk/core';

import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

// Imported after `pnpm generate` — generated from spec/tabular-orchestration.yaml
import type { PredictResponse } from './client/tabular-orchestration/index.ts';
import type {
  ModelConfigFor,
  TabularOrchestrationPredictRequest
} from './types.ts';

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
  async predict<
    ModelName extends string = string,
    ModelConfig extends object = ModelConfigFor<ModelName>
  >(
    body: TabularOrchestrationPredictRequest<ModelName, NoInfer<ModelConfig>>
  ): Promise<PredictResponse> {
    const deployment = await resolveDeployment({
      scenarioId,
      resourceGroup: this.resourceGroup,
      destination: this.destination
    });

    const response = await executeRequest(
      {
        url: `/inference/deployments/${deployment.id}/predict`,
        resourceGroup: this.resourceGroup
      },
      body,
      {},
      this.destination
    );
    return response.data as PredictResponse;
  }
}
