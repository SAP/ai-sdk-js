/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type {
  OrchestrationConfigListResponse,
  OrchestrationConfigPostRequest,
  OrchestrationConfigPostResponse,
  OrchestrationConfigGetResponse,
  OrchestrationConfigDeleteResponse
} from './schema/index.js';
/**
 * Representation of the 'OrchestrationConfigsApi'.
 * This API is part of the 'prompt-registry' service.
 */
export const OrchestrationConfigsApi = {
  _defaultBasePath: undefined,
  /**
   * List orchestration configs
   * @param queryParameters - Object containing the following keys: scenario, name, version, model_name, retrieve, include_spec, resolve_template_ref.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  listOrchestrationConfigs: (
    queryParameters?: {
      scenario?: string;
      name?: string;
      version?: string;
      model_name?: string;
      retrieve?: 'both' | 'imperative' | 'declarative';
      include_spec?: boolean;
      resolve_template_ref?: boolean;
    },
    headerParameters?: { 'AI-Resource-Group'?: string }
  ) =>
    new OpenApiRequestBuilder<OrchestrationConfigListResponse>(
      'get',
      '/registry/v2/orchestrationConfigs',
      {
        queryParameters,
        headerParameters
      },
      OrchestrationConfigsApi._defaultBasePath
    ),
  /**
   * Create or update an orchestration config
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createUpdateOrchestrationConfig: (
    body: OrchestrationConfigPostRequest,
    headerParameters?: { 'AI-Resource-Group'?: string }
  ) =>
    new OpenApiRequestBuilder<OrchestrationConfigPostResponse>(
      'post',
      '/registry/v2/orchestrationConfigs',
      {
        body,
        headerParameters
      },
      OrchestrationConfigsApi._defaultBasePath
    ),
  /**
   * List orchestration config history
   * @param scenario - Path parameter.
   * @param version - Path parameter.
   * @param name - Path parameter.
   * @param modelName - Path parameter.
   * @param queryParameters - Object containing the following keys: include_spec, resolve_template_ref.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  listOrchestrationConfigHistory: (
    scenario: string,
    version: string,
    name: string,
    modelName: string,
    queryParameters?: {
      include_spec?: boolean;
      resolve_template_ref?: boolean;
    },
    headerParameters?: { 'AI-Resource-Group'?: string }
  ) =>
    new OpenApiRequestBuilder<OrchestrationConfigListResponse>(
      'get',
      '/registry/v2/scenarios/{scenario}/orchestrationConfigs/{name}/versions/{version}/models/{modelName}/history',
      {
        pathParameters: { scenario, version, name, modelName },
        queryParameters,
        headerParameters
      },
      OrchestrationConfigsApi._defaultBasePath
    ),
  /**
   * Get orchestration config by UUID
   * @param orchestrationConfigId - Path parameter.
   * @param queryParameters - Object containing the following keys: resolve_template_ref.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getOrchestrationConfigByUuid: (
    orchestrationConfigId: string,
    queryParameters?: { resolve_template_ref?: boolean },
    headerParameters?: { 'AI-Resource-Group'?: string }
  ) =>
    new OpenApiRequestBuilder<OrchestrationConfigGetResponse>(
      'get',
      '/registry/v2/orchestrationConfigs/{orchestrationConfigId}',
      {
        pathParameters: { orchestrationConfigId },
        queryParameters,
        headerParameters
      },
      OrchestrationConfigsApi._defaultBasePath
    ),
  /**
   * Delete orchestration config
   * @param orchestrationConfigId - Path parameter.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  deleteOrchestrationConfig: (
    orchestrationConfigId: string,
    headerParameters?: { 'AI-Resource-Group'?: string }
  ) =>
    new OpenApiRequestBuilder<OrchestrationConfigDeleteResponse>(
      'delete',
      '/registry/v2/orchestrationConfigs/{orchestrationConfigId}',
      {
        pathParameters: { orchestrationConfigId },
        headerParameters
      },
      OrchestrationConfigsApi._defaultBasePath
    ),
  /**
   * Import orchestration config
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  importOrchestrationConfig: (
    body: any | undefined,
    headerParameters?: { 'AI-Resource-Group'?: string }
  ) =>
    new OpenApiRequestBuilder<OrchestrationConfigPostResponse>(
      'post',
      '/registry/v2/orchestrationConfigs/import',
      {
        body,
        headerParameters
      },
      OrchestrationConfigsApi._defaultBasePath
    ),
  /**
   * Export orchestration config
   * @param orchestrationConfigId - Path parameter.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  exportOrchestrationConfig: (
    orchestrationConfigId: string,
    headerParameters?: { 'AI-Resource-Group'?: string }
  ) =>
    new OpenApiRequestBuilder<string>(
      'get',
      '/registry/v2/orchestrationConfigs/{orchestrationConfigId}/export',
      {
        pathParameters: { orchestrationConfigId },
        headerParameters
      },
      OrchestrationConfigsApi._defaultBasePath
    )
};
