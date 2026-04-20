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
   * Create a request builder for execution of get requests to the '/llm-batch-service/v1/batches' endpoint.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group, AI-Main-Tenant.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  batchServiceControllerBatchControllerListBatches: (headerParameters: {
    'AI-Resource-Group': string;
    'AI-Main-Tenant'?: string;
  }) =>
    new OpenApiRequestBuilder<BatchListResponse>(
      'get',
      '/llm-batch-service/v1/batches',
      {
        headerParameters
      },
      BatchesApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the '/llm-batch-service/v1/batches' endpoint.
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group, AI-Main-Tenant.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  batchServiceControllerBatchControllerCreateBatch: (
    body: BatchCreateRequest,
    headerParameters: { 'AI-Resource-Group': string; 'AI-Main-Tenant'?: string }
  ) =>
    new OpenApiRequestBuilder<BatchCreateResponse>(
      'post',
      '/llm-batch-service/v1/batches',
      {
        body,
        headerParameters: {
          'content-type': 'application/json',
          ...headerParameters
        }
      },
      BatchesApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/llm-batch-service/v1/batches/{batchId}' endpoint.
   * @param batchId - Path parameter.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group, AI-Main-Tenant.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  batchServiceControllerBatchControllerGetBatchById: (
    batchId: string,
    headerParameters: { 'AI-Resource-Group': string; 'AI-Main-Tenant'?: string }
  ) =>
    new OpenApiRequestBuilder<BatchDetailResponse>(
      'get',
      '/llm-batch-service/v1/batches/{batchId}',
      {
        pathParameters: { batchId },
        headerParameters
      },
      BatchesApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of delete requests to the '/llm-batch-service/v1/batches/{batchId}' endpoint.
   * @param batchId - Path parameter.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group, AI-Main-Tenant.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  batchServiceControllerBatchControllerDeleteBatch: (
    batchId: string,
    headerParameters: { 'AI-Resource-Group': string; 'AI-Main-Tenant'?: string }
  ) =>
    new OpenApiRequestBuilder<BatchDeleteResponse>(
      'delete',
      '/llm-batch-service/v1/batches/{batchId}',
      {
        pathParameters: { batchId },
        headerParameters
      },
      BatchesApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/llm-batch-service/v1/batches/{batchId}/status' endpoint.
   * @param batchId - Path parameter.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group, AI-Main-Tenant.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  batchServiceControllerBatchControllerGetBatchStatus: (
    batchId: string,
    headerParameters: { 'AI-Resource-Group': string; 'AI-Main-Tenant'?: string }
  ) =>
    new OpenApiRequestBuilder<BatchStatusResponse>(
      'get',
      '/llm-batch-service/v1/batches/{batchId}/status',
      {
        pathParameters: { batchId },
        headerParameters
      },
      BatchesApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of patch requests to the '/llm-batch-service/v1/batches/{batchId}/cancel' endpoint.
   * @param batchId - Path parameter.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group, AI-Main-Tenant.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  batchServiceControllerBatchControllerCancelBatch: (
    batchId: string,
    headerParameters: { 'AI-Resource-Group': string; 'AI-Main-Tenant'?: string }
  ) =>
    new OpenApiRequestBuilder<BatchCancelResponse>(
      'patch',
      '/llm-batch-service/v1/batches/{batchId}/cancel',
      {
        pathParameters: { batchId },
        headerParameters
      },
      BatchesApi._defaultBasePath
    )
};
