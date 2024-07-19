/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-cloud-sdk/openapi';
import type {
  DeploymentCreationResponse,
  DeploymentList,
  DeploymentCreationRequest,
  DeploymentBulkModificationResponse,
  DeploymentResponseWithDetails,
  DeploymentModificationRequest,
  DeploymentModificationResponse,
  DeploymentDeletionResponse,
  LogCommonResponse
} from './schema/index.js';
/**
 * Representation of the 'DeploymentApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export const DeploymentApi = {
  /**
   * Create deployment. Deprecated, use POST /deployments instead
   * @param configurationId - Configuration identifier
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  deploymentCreateDeprecated: (
    configurationId: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<DeploymentCreationResponse>(
      'post',
      '/lm/configurations/{configurationId}/deployments',
      {
        pathParameters: { configurationId },
        headerParameters
      }
    ),
  /**
   * Retrieve a list of deployments that match the specified filter criteria.
   * Filter criteria include a list of executableIds, a scenarioId, a configurationId, or a deployment status.
   * With top/skip parameters it is possible to paginate the result list.
   * With select parameter it is possible to select only status.
   *
   * @param queryParameters - Object containing the following keys: executableIds, configurationId, scenarioId, status, $top, $skip, $select.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  deploymentQuery: (
    queryParameters: {
      executableIds?: string[];
      configurationId?: string;
      scenarioId?: string;
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
    new OpenApiRequestBuilder<DeploymentList>('get', '/lm/deployments', {
      queryParameters,
      headerParameters
    }),
  /**
   * Create a deployment using the configuration specified by configurationId.
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  deploymentCreate: (
    body: DeploymentCreationRequest,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<DeploymentCreationResponse>(
      'post',
      '/lm/deployments',
      {
        body,
        headerParameters
      }
    ),
  /**
   * Update status of multiple deployments. stop or delete multiple deployments.
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  deploymentBatchModify: (
    body: any,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<DeploymentBulkModificationResponse>(
      'patch',
      '/lm/deployments',
      {
        body,
        headerParameters
      }
    ),
  /**
   * Retrieve details for execution with deploymentId.
   * @param deploymentId - Deployment identifier
   * @param queryParameters - Object containing the following keys: $select.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  deploymentGet: (
    deploymentId: string,
    queryParameters: { $select?: 'status' },
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<DeploymentResponseWithDetails>(
      'get',
      '/lm/deployments/{deploymentId}',
      {
        pathParameters: { deploymentId },
        queryParameters,
        headerParameters
      }
    ),
  /**
   * Update target status of a deployment to stop a deployment or change the configuration to be used by the deployment. A change of configuration is only allowed for RUNNING and PENDING deployments.
   * @param deploymentId - Deployment identifier
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  deploymentModify: (
    deploymentId: string,
    body: DeploymentModificationRequest,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<DeploymentModificationResponse>(
      'patch',
      '/lm/deployments/{deploymentId}',
      {
        pathParameters: { deploymentId },
        body,
        headerParameters
      }
    ),
  /**
   * Mark deployment with deploymentId as deleted.
   * @param deploymentId - Deployment identifier
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  deploymentDelete: (
    deploymentId: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<DeploymentDeletionResponse>(
      'delete',
      '/lm/deployments/{deploymentId}',
      {
        pathParameters: { deploymentId },
        headerParameters
      }
    ),
  /**
   * Retrieve the number of available deployments. The number can be filtered by
   * scenarioId, configurationId, executableIdsList or by deployment status.
   *
   * @param queryParameters - Object containing the following keys: executableIds, configurationId, scenarioId, status.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  deploymentCount: (
    queryParameters: {
      executableIds?: string[];
      configurationId?: string;
      scenarioId?: string;
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
    new OpenApiRequestBuilder<any>('get', '/lm/deployments/$count', {
      queryParameters,
      headerParameters
    }),
  /**
   * Retrieve logs of a deployment for getting insight into the deployment results or failures.
   * @param deploymentId - Deployment identifier
   * @param queryParameters - Object containing the following keys: $top, start, end, $order.
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4DeploymentsGetLogs: (
    deploymentId: string,
    queryParameters?: {
      $top?: number;
      start?: string;
      end?: string;
      $order?: 'asc' | 'desc';
    },
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<LogCommonResponse>(
      'get',
      '/lm/deployments/{deploymentId}/logs',
      {
        pathParameters: { deploymentId },
        queryParameters,
        headerParameters
      }
    )
};
