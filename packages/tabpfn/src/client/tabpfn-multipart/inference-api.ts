/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';

import type { PredictMultipart, PredictResponse } from './schema/index.js';
/**
 * Representation of the 'InferenceApi'.
 * This API is part of the 'tabpfn-multipart' service.
 * @internal
 */
export const InferenceApi = {
  _defaultBasePath: undefined,
  /**
   * Synchronous: the response is returned when the prediction is done. A replica holds one GPU and serves requests one at a time; further requests queue (up to 120 s for the GPU, then 503).
   *
   * Limits, per model:
   *
   * - **v3**: ≤ 1,000,000 training rows, ≤ 2,000 columns, ≤ 200,000,000 training cells, ≤ 200,000,000 training cells per estimator, ≤ 200,000,000 test cells, test rows ≤ min(1,000,000, 250,000,000,000 ÷ training rows).
   * - **v3.5**: ≤ 1,000,000 training rows, ≤ 2,000 columns, ≤ 200,000,000 training cells, ≤ 200,000,000 training cells per estimator, ≤ 200,000,000 test cells, test rows ≤ min(1,000,000, 250,000,000,000 ÷ training rows).
   *
   * All models: each table ≤ 5 GiB in memory; a response of at most 32,000,000 values (test rows × values per row); `full` regression ≤ 400 test rows. A violated limit is a 422.
   *
   * Request bodies must not be compressed (`Content-Encoding: gzip` is not decoded). Responses are gzip-compressed when the request sends `Accept-Encoding: gzip`.
   * @param body - Request body.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  predict: (body: PredictMultipart) =>
    new OpenApiRequestBuilder<PredictResponse>(
      'post',
      '/predict',
      {
        body,
        _encoding: {
          request: {
            contentType: 'application/json',
            isImplicit: true,
            parsedContentTypes: [{ type: 'application/json', parameters: {} }]
          },
          x_train: {
            contentType: 'text/csv, application/vnd.apache.parquet',
            isImplicit: false,
            parsedContentTypes: [
              { type: 'text/csv', parameters: {} },
              { type: 'application/vnd.apache.parquet', parameters: {} }
            ]
          },
          y_train: {
            contentType: 'text/csv, application/vnd.apache.parquet',
            isImplicit: false,
            parsedContentTypes: [
              { type: 'text/csv', parameters: {} },
              { type: 'application/vnd.apache.parquet', parameters: {} }
            ]
          },
          x_test: {
            contentType: 'text/csv, application/vnd.apache.parquet',
            isImplicit: false,
            parsedContentTypes: [
              { type: 'text/csv', parameters: {} },
              { type: 'application/vnd.apache.parquet', parameters: {} }
            ]
          }
        },
        headerParameters: { 'content-type': 'multipart/form-data' }
      },
      InferenceApi._defaultBasePath
    )
};
