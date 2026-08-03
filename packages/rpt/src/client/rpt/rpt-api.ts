/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type {
  PredictRequestPayload,
  PredictResponsePayload,
  BodyPredictParquet
} from './schema/index.js';
/**
 * Representation of the 'RptApi'.
 * This API is part of the 'rpt' service.
 * @internal
 */
export const RptApi = {
  _defaultBasePath: undefined,
  /**
   * Create a request builder for execution of get requests to the '/health' endpoint.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  health: () =>
    new OpenApiRequestBuilder<any>(
      'get',
      '/health',
      {},
      RptApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the '/predict' endpoint.
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: Content-Encoding.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  predict: (
    body: PredictRequestPayload,
    headerParameters?: { 'Content-Encoding'?: 'gzip' }
  ) =>
    new OpenApiRequestBuilder<PredictResponsePayload>(
      'post',
      '/predict',
      {
        body,
        headerParameters: {
          'content-type': 'application/json',
          ...headerParameters
        }
      },
      RptApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the '/predict_parquet' endpoint.
   * @param body - Request body.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  predictParquet: (body: BodyPredictParquet) =>
    new OpenApiRequestBuilder<PredictResponsePayload>(
      'post',
      '/predict_parquet',
      {
        body,
        _encoding: {
          prediction_config: {
            contentType: 'text/plain',
            isImplicit: true,
            parsedContentTypes: [{ type: 'text/plain', parameters: {} }]
          },
          index_column: {
            contentType: 'text/plain',
            isImplicit: true,
            parsedContentTypes: [{ type: 'text/plain', parameters: {} }]
          },
          parse_data_types: {
            contentType: 'text/plain',
            isImplicit: true,
            parsedContentTypes: [{ type: 'text/plain', parameters: {} }]
          },
          file: {
            contentType: 'application/vnd.apache.parquet',
            isImplicit: false,
            parsedContentTypes: [
              { type: 'application/vnd.apache.parquet', parameters: {} }
            ]
          }
        },
        headerParameters: { 'content-type': 'multipart/form-data' }
      },
      RptApi._defaultBasePath
    )
};
