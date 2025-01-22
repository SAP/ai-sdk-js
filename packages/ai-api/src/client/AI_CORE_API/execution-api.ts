/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type {
  AiExecutionList,
  AiEnactmentCreationRequest,
  AiExecutionCreationResponse,
  AiExecutionBulkModificationRequest,
  AiExecutionBulkModificationResponse,
  AiExecutionResponseWithDetails,
  AiExecutionModificationRequest,
  AiExecutionModificationResponse,
  AiExecutionDeletionResponse,
  RTALogCommonResponse
} from './schema/index.js';
/**
 * Representation of the 'ExecutionApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export const ExecutionApi = {
  _defaultBasePath: undefined,
  /**
   * Retrieve a list of executions that match the specified filter criteria.
   * Filter criteria include a list of executableIds, a scenarioId, a configurationId, or a execution status.
   * With top/skip parameters it is possible to paginate the result list.
   * With select parameter it is possible to select only status.
   *
   * @param queryParameters - Object containing the following keys: executableIds, configurationId, scenarioId, executionScheduleId, status, $top, $skip, $select.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  executionQuery: (
    queryParameters: {
      executableIds?: string[];
      configurationId?: string;
      scenarioId?: string;
      executionScheduleId?: string;
      status?:
        | 'PENDING'
        | 'RUNNING'
        | 'COMPLETED'
        | 'DEAD'
        | 'STOPPING'
        | 'STOPPED'
        | 'UNKNOWN';
      $top?: number;
      $skip?: number;
      $select?: 'status';
    },
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<AiExecutionList>(
      'get',
      '/lm/executions',
      {
        queryParameters,
        headerParameters
      },
      ExecutionApi._defaultBasePath
    ),
  /**
   * Create an execution using the configuration specified by configurationId.
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  executionCreate: (
    body: AiEnactmentCreationRequest,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<AiExecutionCreationResponse>(
      'post',
      '/lm/executions',
      {
        body,
        headerParameters
      },
      ExecutionApi._defaultBasePath
    ),
  /**
   * Patch multiple executions' status to stopped or deleted.
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  executionBatchModify: (
    body: AiExecutionBulkModificationRequest,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<AiExecutionBulkModificationResponse>(
      'patch',
      '/lm/executions',
      {
        body,
        headerParameters
      },
      ExecutionApi._defaultBasePath
    ),
  /**
   * Retrieve details for execution with executionId.
   * @param executionId - Execution identifier
   * @param queryParameters - Object containing the following keys: $select.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  executionGet: (
    executionId: string,
    queryParameters: { $select?: 'status' },
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<AiExecutionResponseWithDetails>(
      'get',
      '/lm/executions/{executionId}',
      {
        pathParameters: { executionId },
        queryParameters,
        headerParameters
      },
      ExecutionApi._defaultBasePath
    ),
  /**
   * Update target status of the execution to stop an execution.
   * @param executionId - Execution identifier
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  executionModify: (
    executionId: string,
    body: AiExecutionModificationRequest,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<AiExecutionModificationResponse>(
      'patch',
      '/lm/executions/{executionId}',
      {
        pathParameters: { executionId },
        body,
        headerParameters
      },
      ExecutionApi._defaultBasePath
    ),
  /**
   * Mark the execution with executionId as deleted.
   * @param executionId - Execution identifier
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  executionDelete: (
    executionId: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<AiExecutionDeletionResponse>(
      'delete',
      '/lm/executions/{executionId}',
      {
        pathParameters: { executionId },
        headerParameters
      },
      ExecutionApi._defaultBasePath
    ),
  /**
   * Retrieve the number of available executions. The number can be filtered by
   * scenarioId, configurationId, executableIdsList or by execution status.
   *
   * @param queryParameters - Object containing the following keys: executableIds, configurationId, scenarioId, executionScheduleId, status.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  executionCount: (
    queryParameters: {
      executableIds?: string[];
      configurationId?: string;
      scenarioId?: string;
      executionScheduleId?: string;
      status?:
        | 'PENDING'
        | 'RUNNING'
        | 'COMPLETED'
        | 'DEAD'
        | 'STOPPING'
        | 'STOPPED'
        | 'UNKNOWN';
    },
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<number>(
      'get',
      '/lm/executions/$count',
      {
        queryParameters,
        headerParameters
      },
      ExecutionApi._defaultBasePath
    ),
  /**
   * Retrieve logs of an execution for getting insight into the execution results or failures.
   * @param executionId - Execution identifier
   * @param queryParameters - Object containing the following keys: $top, start, end, $order.
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4ExecutionsGetLogs: (
    executionId: string,
    queryParameters?: {
      $top?: number;
      start?: string;
      end?: string;
      $order?: 'asc' | 'desc';
    },
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<RTALogCommonResponse>(
      'get',
      '/lm/executions/{executionId}/logs',
      {
        pathParameters: { executionId },
        queryParameters,
        headerParameters
      },
      ExecutionApi._defaultBasePath
    )
};
