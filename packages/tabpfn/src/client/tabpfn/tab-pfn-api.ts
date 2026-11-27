/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';

import type {
  PredictRequest,
  PredictResponse,
  PredictRequestPart
} from './schema/index.js';
/**
 * Representation of the 'TabPfnApi'.
 * This API is part of the 'tabpfn' service.
 * @internal
 */
export const TabPfnApi = {
  _defaultBasePath: undefined,
  /**
   * Create a request builder for execution of post requests to the "/predict" endpoint.
   * @param body - Request body.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  handlePredictPostWithJson: (body: PredictRequest) =>
    new OpenApiRequestBuilder<PredictResponse>(
      'post',
      '/predict',
      {
        body,
        headerParameters: { 'content-type': 'application/json' }
      },
      TabPfnApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the "/predict" endpoint.
   * @param body - Request body.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  handlePredictPostWithMultipartFormData: (
    body: {
      /**
       * The rest of the body, as JSON. Send it as a plain form field, not as a file.
       */
      request: PredictRequestPart;
      /**
       * Training features, as CSV with a header row or as Parquet.
       * Format: "binary".
       */
      x_train?: Blob;
      /**
       * Training targets, as CSV or Parquet with one column. A CSV file has a header row.
       * Format: "binary".
       */
      y_train?: Blob;
      /**
       * Features to predict, as CSV with a header row or as Parquet.
       * Format: "binary".
       */
      x_test: Blob;
    } & Record<string, any>
  ) =>
    new OpenApiRequestBuilder<PredictResponse>(
      'post',
      '/predict',
      {
        body,
        _encoding: {
          request: {
            contentType: 'application/json',
            isImplicit: false,
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
      TabPfnApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the "/predict_parquet" endpoint.
   * @param body - Request body.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  handleParquetPredictParquetPost: (
    body: {
      /**
       * The rest of the body, as JSON. Send it as a plain form field, not as a file.
       */
      request: PredictRequestPart;
      /**
       * Training features, as Parquet.
       * Format: "binary".
       */
      x_train?: Blob;
      /**
       * Training targets, as Parquet with one column.
       * Format: "binary".
       */
      y_train?: Blob;
      /**
       * Features to predict, as Parquet.
       * Format: "binary".
       */
      x_test: Blob;
    } & Record<string, any>
  ) =>
    new OpenApiRequestBuilder<PredictResponse>(
      'post',
      '/predict_parquet',
      {
        body,
        _encoding: {
          request: {
            contentType: 'application/json',
            isImplicit: false,
            parsedContentTypes: [{ type: 'application/json', parameters: {} }]
          },
          x_train: {
            contentType: 'application/vnd.apache.parquet',
            isImplicit: false,
            parsedContentTypes: [
              { type: 'application/vnd.apache.parquet', parameters: {} }
            ]
          },
          y_train: {
            contentType: 'application/vnd.apache.parquet',
            isImplicit: false,
            parsedContentTypes: [
              { type: 'application/vnd.apache.parquet', parameters: {} }
            ]
          },
          x_test: {
            contentType: 'application/vnd.apache.parquet',
            isImplicit: false,
            parsedContentTypes: [
              { type: 'application/vnd.apache.parquet', parameters: {} }
            ]
          }
        },
        headerParameters: { 'content-type': 'multipart/form-data' }
      },
      TabPfnApi._defaultBasePath
    )
};
