import {
  getFoundationModelDeploymentId,
  getResourceGroup
} from '@sap-ai-sdk/ai-api/internal.js';

import { TabPfnApi } from './internal.ts';

import type { ModelDeployment } from '@sap-ai-sdk/ai-api';
import type { TabpfnModel } from '@sap-ai-sdk/core/internal.js';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

import type { PredictRequest, PredictResponse } from './client/tabpfn/index.ts';
import type { PredictMultipart, TabpfnRequestOptions } from './types.ts';

/**
 * Representation of a TabPFN client to make tabular predictions.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class TabpfnClient {
  private readonly modelDeployment: ModelDeployment<TabpfnModel>;
  private readonly destination?: HttpDestinationOrFetchOptions;

  /**
   * Creates an instance of the TabPFN client.
   * @param modelDeployment - This configuration is used to retrieve a deployment. Depending on the configuration use either the given deployment ID or the model name to retrieve matching deployments. If model and deployment ID are given, the model is verified against the deployment.
   * @param destination - The destination to use for the request.
   */
  constructor(
    modelDeployment: ModelDeployment<TabpfnModel>,
    destination?: HttpDestinationOrFetchOptions
  ) {
    this.modelDeployment = modelDeployment;
    this.destination = destination;
  }

  /**
   * Predict based on inline JSON training and test data.
   * @param predictionData - Labeled training rows and the rows to predict.
   * @param requestConfig - Custom request configuration.
   * @returns Prediction response.
   */
  async predict(
    predictionData: PredictRequest,
    requestConfig: TabpfnRequestOptions = {}
  ): Promise<PredictResponse> {
    const { resourceGroup, deploymentId } =
      await this.getResourceGroupAndDeploymentId();

    return TabPfnApi.handlePredictPostWithJson(predictionData)
      .setBasePath(`/inference/deployments/${deploymentId}`)
      .addCustomHeaders({ 'ai-resource-group': resourceGroup || 'default' })
      .addCustomRequestConfiguration(requestConfig)
      .execute(this.destination);
  }

  /**
   * Predict based on CSV or Parquet file uploads.
   * Each dataset is uploaded as a file part; the configuration travels in a text field named `request`.
   * @param payload - File data and prediction configuration to base prediction on.
   * @param requestConfig - Custom request configuration.
   * @returns Prediction response.
   */
  async predictFiles(
    payload: PredictMultipart,
    requestConfig: TabpfnRequestOptions = {}
  ): Promise<PredictResponse> {
    const { resourceGroup, deploymentId } =
      await this.getResourceGroupAndDeploymentId();

    return TabPfnApi.handlePredictPostWithMultipartFormData(payload)
      .setBasePath(`/inference/deployments/${deploymentId}`)
      .addCustomHeaders({ 'ai-resource-group': resourceGroup || 'default' })
      .addCustomRequestConfiguration(requestConfig)
      .execute(this.destination);
  }

  /**
   * Predict from Parquet tables using the dedicated Parquet endpoint.
   * @param payload - Parquet tables and prediction configuration.
   * @param requestConfig - Custom request configuration.
   * @returns Prediction response.
   */
  async predictParquet(
    payload: PredictMultipart,
    requestConfig: TabpfnRequestOptions = {}
  ): Promise<PredictResponse> {
    const { resourceGroup, deploymentId } =
      await this.getResourceGroupAndDeploymentId();
    return TabPfnApi.handleParquetPredictParquetPost(payload)
      .setBasePath(`/inference/deployments/${deploymentId}`)
      .addCustomHeaders({ 'ai-resource-group': resourceGroup || 'default' })
      .addCustomRequestConfiguration(requestConfig)
      .execute(this.destination);
  }

  /**
   * Gets the resource group and deployment ID for the TabPFN model.
   * @returns Object containing resource group and deployment ID.
   */
  private async getResourceGroupAndDeploymentId() {
    const executableId = 'prior-labs';
    const deploymentId = await getFoundationModelDeploymentId(
      this.modelDeployment,
      executableId,
      this.destination
    );

    const resourceGroup = getResourceGroup(this.modelDeployment);

    return { resourceGroup, deploymentId };
  }
}
