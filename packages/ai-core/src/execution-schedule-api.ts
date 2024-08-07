/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-cloud-sdk/openapi';
import type {
  AiExecutionScheduleList,
  AiExecutionScheduleCreationData,
  AiExecutionScheduleCreationResponse,
  AiExecutionSchedule,
  AiExecutionScheduleModificationRequest,
  AiExecutionScheduleModificationResponse,
  AiExecutionScheduleDeletionResponse
} from './schema/index.js';
/**
 * Representation of the 'ExecutionScheduleApi'.
 * This API is part of the 'src' service.
 */
export const ExecutionScheduleApi = {
  /**
   * Retrieve a list of execution schedules that match the specified filter criteria.
   * Filter criteria include executionScheduleStatus or a configurationId.
   * With top/skip parameters it is possible to paginate the result list.
   *
   * @param queryParameters - Object containing the following keys: configurationId, status, $top, $skip.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  executionScheduleQuery: (
    queryParameters: {
      configurationId?: string;
      status?: 'ACTIVE' | 'INACTIVE';
      $top?: number;
      $skip?: number;
    },
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<AiExecutionScheduleList>(
      'get',
      '/lm/executionSchedules',
      {
        queryParameters,
        headerParameters
      }
    ),
  /**
   * Create an execution schedule using the configuration specified by configurationId, and schedule.
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  executionScheduleCreate: (
    body: AiExecutionScheduleCreationData,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<AiExecutionScheduleCreationResponse>(
      'post',
      '/lm/executionSchedules',
      {
        body,
        headerParameters
      }
    ),
  /**
   * Retrieve details for execution schedule with executionScheduleId.
   * @param executionScheduleId - Execution Schedule identifier
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  executionScheduleGet: (
    executionScheduleId: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<AiExecutionSchedule>(
      'get',
      '/lm/executionSchedules/{executionScheduleId}',
      {
        pathParameters: { executionScheduleId },
        headerParameters
      }
    ),
  /**
   * Update details of an execution schedule
   * @param executionScheduleId - Execution Schedule identifier
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  executionScheduleModify: (
    executionScheduleId: string,
    body: AiExecutionScheduleModificationRequest,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<AiExecutionScheduleModificationResponse>(
      'patch',
      '/lm/executionSchedules/{executionScheduleId}',
      {
        pathParameters: { executionScheduleId },
        body,
        headerParameters
      }
    ),
  /**
   * Delete the execution schedule with executionScheduleId.
   * @param executionScheduleId - Execution Schedule identifier
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  executionScheduleDelete: (
    executionScheduleId: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<AiExecutionScheduleDeletionResponse>(
      'delete',
      '/lm/executionSchedules/{executionScheduleId}',
      {
        pathParameters: { executionScheduleId },
        headerParameters
      }
    ),
  /**
   * Retrieve the number of scheduled executions. The number can be filtered by
   * configurationId or executionScheduleStatus.
   *
   * @param queryParameters - Object containing the following keys: configurationId, status.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  executionScheduleCount: (
    queryParameters: {
      configurationId?: string;
      status?: 'ACTIVE' | 'INACTIVE';
    },
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<any>('get', '/lm/executionSchedules/$count', {
      queryParameters,
      headerParameters
    })
};
