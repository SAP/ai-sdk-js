import {
  getFoundationModelDeploymentId,
  getResourceGroup
} from '@sap-ai-sdk/ai-api/internal.js';

import { InferenceApi, MultipartInferenceApi } from './internal.ts';

import type { ModelDeployment } from '@sap-ai-sdk/ai-api';
import type { TabpfnModel } from '@sap-ai-sdk/core/internal.js';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

import type { PredictMultipart } from './client/tabpfn-multipart/index.ts';
import type { PredictRequest, PredictResponse } from './client/tabpfn/index.ts';
import type { TabpfnRequestOptions } from './types.ts';

/**
 * Representation of a TabPFN client to make tabular predictions.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class TabpfnClient {
  private modelDeployment: ModelDeployment<TabpfnModel>;
  private destination?: HttpDestinationOrFetchOptions;

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

    return InferenceApi.predict(predictionData)
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

    return MultipartInferenceApi.predict({
      ...payload,
      x_train: toFile(payload.x_train, 'x_train'),
      y_train: toFile(payload.y_train, 'y_train'),
      x_test: toFile(payload.x_test, 'x_test')
    })
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

/**
 * Ensures a dataset part is a `File` with a recognizable filename.
 * Plain blobs without a mimetype default to a CSV filename. Explicitly unsupported
 * mimetypes receive no extension so the service validates them.
 * Existing `File` instances are preserved as-is.
 * @param data - The dataset blob or file.
 * @param name - Fallback filename (without extension) used when a plain `Blob` is given.
 * @returns A `File` suitable for multipart upload.
 */
function toFile(data: File | Blob, name: string): File {
  if (data instanceof File) {
    return data;
  }
  const mimeType = data.type.toLowerCase();
  let extension = '';
  if (!mimeType || mimeType === 'text/csv') {
    extension = '.csv';
  } else if (mimeType === 'application/vnd.apache.parquet') {
    extension = '.parquet';
  }
  return new File([data], `${name}${extension}`, { type: data.type });
}
