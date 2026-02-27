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
   * Make in-context predictions for specified target columns.
   * Either "rows" or "columns" must be provided and must contain both context and query rows.
   * You can optionally send gzip-compressed JSON payloads and set a "Content-Encoding: gzip" header.
   * @param body - Request body.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  predict: (body: PredictRequestPayload) =>
    new OpenApiRequestBuilder<PredictResponsePayload>(
      'post',
      '/predict',
      {
        body,
        headerParameters: { 'content-type': 'application/json' }
      },
      RptApi._defaultBasePath
    ),
  /**
   * Make in-context predictions for specified target columns based on provided table data Parquet file.
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
            contentType: 'application/json',
            isImplicit: true,
            parsedContentTypes: [{ parameters: {}, type: 'application/json' }]
          },
          index_column: {
            contentType: 'text/plain',
            isImplicit: true,
            parsedContentTypes: [{ parameters: {}, type: 'text/plain' }]
          },
          parse_data_types: {
            contentType: 'text/plain',
            isImplicit: true,
            parsedContentTypes: [{ parameters: {}, type: 'text/plain' }]
          },
          file: {
            contentType: 'application/vnd.apache.parquet',
            isImplicit: false,
            parsedContentTypes: [
              { parameters: {}, type: 'application/vnd.apache.parquet' }
            ]
          }
        },
        headerParameters: { 'content-type': 'multipart/form-data' }
      },
      RptApi._defaultBasePath
    )
};
