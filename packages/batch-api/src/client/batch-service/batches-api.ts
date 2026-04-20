/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type {
  BatchListResponse,
  BatchCreateRequest,
  BatchCreateResponse,
  BatchDetailResponse,
  BatchDeleteResponse,
  BatchStatusResponse,
  BatchCancelResponse
} from './schema/index.js';
/**
 * Representation of the 'BatchesApi'.
 * This API is part of the 'batch-service' service.
 */
export const BatchesApi = {
  _defaultBasePath: undefined,
  /**
   * Create a request builder for execution of get requests to the '/batches' endpoint.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  batchServiceControllerBatchControllerListBatches: () =>
    new OpenApiRequestBuilder<BatchListResponse>(
      'get',
      '/batches',
      {},
      BatchesApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the '/batches' endpoint.
   * @param body - Request body.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  batchServiceControllerBatchControllerCreateBatch: (
    body: BatchCreateRequest
  ) =>
    new OpenApiRequestBuilder<BatchCreateResponse>(
      'post',
      '/batches',
      {
        body,
        headerParameters: { 'content-type': 'application/json' }
      },
      BatchesApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/batches/{batchId}' endpoint.
   * @param batchId - Path parameter.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  batchServiceControllerBatchControllerGetBatchById: (batchId: string) =>
    new OpenApiRequestBuilder<BatchDetailResponse>(
      'get',
      '/batches/{batchId}',
      {
        pathParameters: { batchId }
      },
      BatchesApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of delete requests to the '/batches/{batchId}' endpoint.
   * @param batchId - Path parameter.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  batchServiceControllerBatchControllerDeleteBatch: (batchId: string) =>
    new OpenApiRequestBuilder<BatchDeleteResponse>(
      'delete',
      '/batches/{batchId}',
      {
        pathParameters: { batchId }
      },
      BatchesApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/batches/{batchId}/status' endpoint.
   * @param batchId - Path parameter.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  batchServiceControllerBatchControllerGetBatchStatus: (batchId: string) =>
    new OpenApiRequestBuilder<BatchStatusResponse>(
      'get',
      '/batches/{batchId}/status',
      {
        pathParameters: { batchId }
      },
      BatchesApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of patch requests to the '/batches/{batchId}/cancel' endpoint.
   * @param batchId - Path parameter.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  batchServiceControllerBatchControllerCancelBatch: (batchId: string) =>
    new OpenApiRequestBuilder<BatchCancelResponse>(
      'patch',
      '/batches/{batchId}/cancel',
      {
        pathParameters: { batchId }
      },
      BatchesApi._defaultBasePath
    )
};
