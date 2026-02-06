import {
  getFoundationModelDeploymentId,
  getResourceGroup
} from '@sap-ai-sdk/ai-api/internal.js';
import { type PredictionConfig, RptApi } from './internal.js';
import {
  type DataSchema,
  type PredictionData,
  type PredictionOptionsParquet
} from './types.js';
import type {
  PredictRequestPayload,
  PredictResponsePayload,
  BodyPredictParquet
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
   * @returns Prediction response.
   */
  async predictWithSchema<const T extends DataSchema>(
    dataSchema: T,
    predictionData: PredictionData<T>
  ): Promise<PredictResponsePayload> {
    return this.executePrediction(predictionData, dataSchema);
  }

  /**
   * Predict based on prediction data with data schema inferred.
   * Prefer using `predictWithSchema` when the data schema is known.
   * @param predictionData - Data to base prediction on.
   * @returns Prediction response.
   */
  async predictWithoutSchema(
    predictionData: PredictionData<DataSchema>
  ): Promise<PredictResponsePayload> {
    return this.executePrediction(predictionData);
  }

  /**
   * Predict based on Parquet file data.
   * @param parquetData - Parquet file data as Blob. Can also be a File to forward the filename.
   * @param predictionConfig - Configuration for the prediction.
   * @param options - Additional options for the prediction.
   * @param options.index_column - Name of the index column in the Parquet file.
   * @param options.parseDataTypes - Whether to parse data types from the Parquet file.
   * @returns Prediction response.
   */
  async predictParquet(
    parquetData: Blob | File,
    predictionConfig: PredictionConfig,
    options?: PredictionOptionsParquet
  ): Promise<PredictResponsePayload> {
    // Validate that parquetData is of type Blob
    // JavaScript has a few Blob-like types for binary data (e.g., Buffer, ArrayBuffer, etc.) which
    // users might try to use here.
    // Note: This check also covers File
    if (!(parquetData instanceof Blob)) {
      throw new Error(
        `parquetData must be of type Blob or File. Received: ${typeof parquetData}`
      );
    }

    // Workaround: Endpoint requires a filename that ends with .parquet
    // Preserve any filename if parquetData is already a File
    const parquetFile =
      parquetData instanceof File
        ? parquetData
        : new File([parquetData], 'blob.parquet', { type: parquetData.type });

    const { resourceGroup, deploymentId } =
      await this.getResourceGroupAndDeploymentId();

    const body: BodyPredictParquet = {
      file: parquetFile,
      prediction_config: predictionConfig,
      ...(options || {})
    };

    return RptApi.predictParquet(body)
      .setBasePath(`/inference/deployments/${deploymentId}`)
      .addCustomHeaders({
        'ai-resource-group': resourceGroup || 'default',
        // SAP Cloud SDK does not (yet) set the Content-Type header automatically for multipart/form-data
        'content-type': 'multipart/form-data'
      })
      .execute(this.destination);
  }

  /**
   * Predict based on data schema and prediction data.
   * @param predictionData - Data to base prediction on.
   * @param dataSchema - Prediction data follows this schema.
   * @returns Prediction response.
   */
  private async executePrediction<const T extends DataSchema>(
    predictionData: PredictionData<T>,
    dataSchema?: T
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

    return RptApi.predict(body)
      .setBasePath(`/inference/deployments/${deploymentId}`)
      .addCustomHeaders({ 'ai-resource-group': resourceGroup || 'default' })
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
