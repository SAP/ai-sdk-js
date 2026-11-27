import {
  getFoundationModelDeploymentId,
  getResourceGroup
} from '@sap-ai-sdk/ai-api/internal.js';

import { DefaultApi } from './client/rpt-decisions/default-api.ts';

import type { ModelDeployment } from '@sap-ai-sdk/ai-api';
import type { SapRptDecisionsModel } from '@sap-ai-sdk/core';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';
import type { CustomRequestConfig } from '@sap-cloud-sdk/http-client';

import type { SystemOneRequest, SystemOneResponse } from './types.ts';

/**
 * Client for answering questions about a state with SAP RPT Decisions.
 */
export class RptDecisionsClient {
  private readonly modelDeployment: ModelDeployment<SapRptDecisionsModel>;
  private readonly destination?: HttpDestinationOrFetchOptions;

  /**
   * Creates an instance of the RPT Decisions client.
   * @param modelDeployment - Deployment ID or model configuration used to retrieve a matching deployment.
   * @param destination - The destination to use for the request.
   */
  constructor(
    modelDeployment: ModelDeployment<SapRptDecisionsModel>,
    destination?: HttpDestinationOrFetchOptions
  ) {
    this.modelDeployment = modelDeployment;
    this.destination = destination;
  }

  /**
   * Answer questions about a state based on labeled examples.
   * @param request - State, questions and at least two labeled examples.
   * @param requestConfig - Custom request configuration.
   * @returns Answers, usage and prediction metadata.
   */
  async systemone(
    request: SystemOneRequest,
    requestConfig: CustomRequestConfig = {}
  ): Promise<SystemOneResponse> {
    const deploymentId = await getFoundationModelDeploymentId(
      this.modelDeployment,
      'aicore-sap',
      this.destination
    );

    return DefaultApi.systemone(request)
      .setBasePath(`/inference/deployments/${deploymentId}`)
      .addCustomHeaders({
        'ai-resource-group': getResourceGroup(this.modelDeployment) || 'default'
      })
      .execute(this.destination, requestConfig);
  }
}
