import {
  getFoundationModelDeploymentId,
  getResourceGroup
} from '@sap-ai-sdk/ai-api/internal.js';
import { compress as compressMiddleware } from '@sap-cloud-sdk/http-client';
import { RptApi } from './internal.js';
import type {
  DataSchema,
  PredictionData,
  RptRequestOptions,
  ParquetPayload
} from './types.js';
import type {
  PredictRequestPayload,
  PredictResponsePayload
} from './client/rpt/index.js';
import type { SapRptModel } from '@sap-ai-sdk/core/internal.js';
import type { ModelDeployment } from '@sap-ai-sdk/ai-api';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

/**
 * Representation of an RPT client to make predictions.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class RptClient {
  /**
   * Creates an instance of the RPT client.
   * @param modelDeployment - This configuration is used to retrieve a deployment. Depending on the configuration use either the given deployment ID or the model name to retrieve matching deployments. If model and deployment ID are given, the model is verified against the deployment.
   * @param destination - The destination to use for the request.
   */
  constructor(
    private modelDeployment: ModelDeployment<SapRptModel> = 'sap-rpt-1-small',
    private destination?: HttpDestinationOrFetchOptions
  ) {}

  /**
   * Predict based on data schema and prediction data.
   * Prefer using this method when the data schema is known.
   * @param dataSchema - Prediction data follows this schema. When using TypeScript, the data schema type is used to infer the types of the prediction data. In that case, the data schema must be provided as a constant (`as const`).
   * @param predictionData - Data to base prediction on.
   * @param requestConfig - Custom request configuration.
   * @returns Prediction response.
   */
  async predictWithSchema<const T extends DataSchema>(
    dataSchema: T,
    predictionData: PredictionData<T>,
    requestConfig: RptRequestOptions = {}
  ): Promise<PredictResponsePayload> {
    return this.executePrediction(predictionData, dataSchema, requestConfig);
  }

  /**
   * Predict based on prediction data with data schema inferred.
   * Prefer using `predictWithSchema` when the data schema is known.
   * @param predictionData - Data to base prediction on.
   * @param requestConfig - Custom request configuration.
   * @returns Prediction response.
   */
  async predictWithoutSchema(
    predictionData: PredictionData<DataSchema>,
    requestConfig: RptRequestOptions = {}
  ): Promise<PredictResponsePayload> {
    return this.executePrediction(predictionData, undefined, requestConfig);
  }

  /**
   * Predict based on Parquet file data.
   * Parquet is a binary tabular data format with typed columns.
   * @param payload - Parquet data and prediction configuration to base prediction on.
   * @param requestConfig - Custom request configuration.
   * @returns Prediction response.
   */
  async predictParquet(
    payload: ParquetPayload,
    requestConfig: Omit<RptRequestOptions, 'compress'> = {}
  ): Promise<PredictResponsePayload> {
    // Validate that parquetData is of type Blob
    // JavaScript has a few Blob-like types for binary data (e.g., Buffer, ArrayBuffer, etc.) which
    // users might try to use here.
    // Note: This check also covers File
    if (!(payload.file instanceof Blob)) {
      throw new Error(
        `file must be of type Blob or File. Received: ${typeof payload.file}`
      );
    }

    // Workaround: Endpoint requires a filename that ends with .parquet
    // Preserve any filename if parquetData is already a File
    const file =
      payload.file instanceof File
        ? payload.file
        : new File([payload.file], 'blob.parquet', { type: payload.file.type });

    const { resourceGroup, deploymentId } =
      await this.getResourceGroupAndDeploymentId();

    return RptApi.predictParquet({ ...payload, file })
      .setBasePath(`/inference/deployments/${deploymentId}`)
      .addCustomHeaders({
        'ai-resource-group': resourceGroup || 'default'
      })
      .addCustomRequestConfiguration(requestConfig)
      .execute(this.destination);
  }

  /**
   * Predict based on data schema and prediction data.
   * @param predictionData - Data to base prediction on.
   * @param dataSchema - Prediction data follows this schema.
   * @param requestConfig - Custom request configuration.
   * @returns Prediction response.
   */
  private async executePrediction<const T extends DataSchema>(
    predictionData: PredictionData<T>,
    dataSchema?: T,
    requestConfig: RptRequestOptions = {}
  ): Promise<PredictResponsePayload> {
    const { resourceGroup, deploymentId } =
      await this.getResourceGroupAndDeploymentId();

    const body = {
      data_schema: dataSchema
        ? Object.fromEntries(
            dataSchema.map(({ name, ...schemaFieldConfig }) => [
              name,
              schemaFieldConfig
            ])
          )
        : null,
      ...predictionData
    } satisfies PredictRequestPayload;

    const { compress, ...customRequestConfig } = requestConfig;

    if (compress?.mode !== 'never') {
      customRequestConfig.middleware = [
        compressMiddleware(compress),
        ...(customRequestConfig.middleware || [])
      ];
    }

    return RptApi.predict(body)
      .setBasePath(`/inference/deployments/${deploymentId}`)
      .addCustomHeaders({ 'ai-resource-group': resourceGroup || 'default' })
      .addCustomRequestConfiguration(customRequestConfig)
      .execute(this.destination);
  }

  /**
   * Gets the resource group and deployment ID for the RPT model.
   * @returns Object containing resource group and deployment ID.
   */
  private async getResourceGroupAndDeploymentId() {
    const deploymentId = await getFoundationModelDeploymentId(
      this.modelDeployment,
      'aicore-sap',
      this.destination
    );

    const resourceGroup = getResourceGroup(this.modelDeployment);

    return { resourceGroup, deploymentId };
  }
}
