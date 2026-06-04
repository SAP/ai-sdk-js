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
 * This API is part of the 'llm-batch' service.
 * @experimental This API is experimental and may change at any time without prior notice.
 */
export const BatchesApi = {
  _defaultBasePath: undefined,
  /**
   * Retrieve a list of all batch processing jobs for the current tenant.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  listBatches: (headerParameters: { 'AI-Resource-Group': string }) =>
    new OpenApiRequestBuilder<BatchListResponse>(
      'get',
      '/llm-batch-service/v1/batches',
      {
        headerParameters
      },
      BatchesApi._defaultBasePath
    ),
  /**
   * Create a new LLM batch processing job. The batch job processes input data from the specified URI and writes results to the output URI.
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createBatch: (
    body: BatchCreateRequest,
    headerParameters: { 'AI-Resource-Group': string }
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
   * Retrieve the details of a specific batch processing job, including its configuration and current status.
   * @param batchId - The unique identifier of the batch job.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getBatchById: (
    batchId: string,
    headerParameters: { 'AI-Resource-Group': string }
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
   * Delete a batch processing job. Only batches in a terminal state (cancelled, completed, or failed) can be deleted.
   * @param batchId - The unique identifier of the batch job.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  deleteBatch: (
    batchId: string,
    headerParameters: { 'AI-Resource-Group': string }
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
   * Retrieve the current status of a specific batch processing job.
   * @param batchId - The unique identifier of the batch job.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getBatchStatus: (
    batchId: string,
    headerParameters: { 'AI-Resource-Group': string }
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
   * Cancel a batch processing job that is currently in progress. The batch will be scheduled for cancellation.
   * @param batchId - The unique identifier of the batch job.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  cancelBatch: (
    batchId: string,
    headerParameters: { 'AI-Resource-Group': string }
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
