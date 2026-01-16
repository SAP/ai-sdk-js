import { getResourceGroup } from '@sap-ai-sdk/ai-api/internal.js';
import { getFoundationModelDeploymentId } from '@sap-ai-sdk/foundation-models/internal.js';
import { RptApi } from './internal.js';
import { type DataSchema, type PredictionData } from './types.js';
import type {
  PredictRequestPayload,
  PredictResponsePayload
} from './client/rpt/index.js';
import type { SAPRptModel } from '@sap-ai-sdk/core/internal.js';
import type { ModelDeployment } from '@sap-ai-sdk/ai-api';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

/**
 * Representation of an RPT client to make predictions.
 */
export class RptClient {
  /**
   * Creates an instance of the RPT client.
   * @param modelDeployment - This configuration is used to retrieve a deployment. Depending on the configuration use either the given deployment ID or the model name to retrieve matching deployments. If model and deployment ID are given, the model is verified against the deployment.
   * @param destination - The destination to use for the request.
   */
  constructor(
    private modelDeployment: ModelDeployment<SAPRptModel> = 'sap-rpt-1-small',
    private destination?: HttpDestinationOrFetchOptions
  ) {}

  /**
   * Predict based on data schema and prediction data.
   * @param dataSchema - Prediction data follows this schema.
   * @param predictionData - Data to base prediction on.
   */
  async predict<T extends DataSchema>(
    dataSchema: T,
    predictionData: PredictionData<T>
  ): Promise<PredictResponsePayload>;
  /**
   * Predict based on prediction data. Uses automatic data type parsing.
   * @param predictionData - Data to base prediction on.
   */
  async predict<T extends DataSchema>(
    predictionData: PredictionData<T>
  ): Promise<PredictResponsePayload>;
  async predict<T extends DataSchema>(
    dataSchemaOrPredictionData: T | PredictionData<T>,
    predictionDataOrUndefined?: PredictionData<T>
  ): Promise<PredictResponsePayload> {
    const [predictionData, dataSchema] = (
      predictionDataOrUndefined
        ? [predictionDataOrUndefined, dataSchemaOrPredictionData]
        : [dataSchemaOrPredictionData, null]
    ) as [PredictionData<T>, T];

    // eslint-disable-next-line jsdoc/require-jsdoc
    const deploymentId = await getFoundationModelDeploymentId(
      this.modelDeployment,
      'aicore-sap',
      this.destination
    );

    const resourceGroup = getResourceGroup(this.modelDeployment);

    const body = {
      data_schema: dataSchema,
      ...predictionData
    } satisfies PredictRequestPayload;

    return RptApi.predict(body)
      .setBasePath(`/inference/deployments/${deploymentId}`)
      .addCustomHeaders({ 'ai-resource-group': resourceGroup || 'default' })
      .execute(this.destination);
  }
}
