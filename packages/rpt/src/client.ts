import {
  getFoundationModelDeploymentId,
  getResourceGroup
} from '@sap-ai-sdk/ai-api/internal.js';
import { createLogger } from '@sap-cloud-sdk/util';
import { executeRequest } from '@sap-ai-sdk/core';
import { compressRequest } from './vendor/index.js';
import type { DataSchema, PredictionData, RptRequestOptions } from './types.js';
import type {
  PredictRequestPayload,
  PredictResponsePayload
} from './client/rpt/index.js';
import type { SapRptModel } from '@sap-ai-sdk/core/internal.js';
import type { ModelDeployment } from '@sap-ai-sdk/ai-api';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

const logger = createLogger({
  package: 'rpt',
  messageContext: 'RptClient'
});

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
   * @param customRequest - Custom request options.
   * @returns Prediction response.
   */
  async predictWithSchema<const T extends DataSchema>(
    dataSchema: T,
    predictionData: PredictionData<T>,
    customRequest: RptRequestOptions = {}
  ): Promise<PredictResponsePayload> {
    return this.executePrediction(predictionData, dataSchema, customRequest);
  }

  /**
   * Predict based on prediction data with data schema inferred.
   * Prefer using `predictWithSchema` when the data schema is known.
   * @param predictionData - Data to base prediction on.
   * @param customRequest - Custom request options.
   * @returns Prediction response.
   */
  async predictWithoutSchema(
    predictionData: PredictionData<DataSchema>,
    customRequest: RptRequestOptions = {}
  ): Promise<PredictResponsePayload> {
    return this.executePrediction(predictionData, undefined, customRequest);
  }

  /**
   * Predict based on data schema and prediction data.
   * @param predictionData - Data to base prediction on.
   * @param dataSchema - Prediction data follows this schema.
   * @param customRequestAll - Custom request options.
   * @returns Prediction response.
   */
  private async executePrediction<const T extends DataSchema>(
    predictionData: PredictionData<T>,
    dataSchema?: T,
    customRequestAll: RptRequestOptions = {}
  ): Promise<PredictResponsePayload> {
    const deploymentId = await getFoundationModelDeploymentId(
      this.modelDeployment,
      'aicore-sap',
      this.destination
    );

    const resourceGroup = getResourceGroup(this.modelDeployment);

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

    const { requestCompression, ...customRequest } = customRequestAll;

    if (requestCompression?.mode !== false) {
      if (customRequest.middlewares) {
        logger.warn(
          'Custom middlewares are not supported when request compression is enabled. ' +
            'The compression middleware will not be applied. ' +
            'Please disable request compression in RptRequestOptions to avoid this warning (`requestCompression.mode = false`).'
        );
      }
      customRequest.middlewares = [compressRequest(requestCompression)];
    }

    const response = await executeRequest(
      {
        url: `/inference/deployments/${deploymentId}/predict`,
        resourceGroup: resourceGroup || 'default'
      },
      body,
      customRequest,
      this.destination
    );

    if (response.data) {
      return response.data;
    }
    throw new Error('No data received from RPT prediction request');
  }
}
