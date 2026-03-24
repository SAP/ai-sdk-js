/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
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
   * List imperatively and declaratively managed orchestration config
   * @param queryParameters - Object containing the following keys: scenario, name, version, retrieve, include_spec, includeSpec, resolve_template_ref, resolveTemplateRef.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  listOrchestrationConfigs: (
    queryParameters?: {
      scenario?: string;
      name?: string;
      version?: string;
      retrieve?: 'both' | 'imperative' | 'declarative';
      include_spec?: boolean;
      includeSpec?: boolean;
      resolve_template_ref?: boolean;
      resolveTemplateRef?: boolean;
    },
    headerParameters?: { 'AI-Resource-Group'?: string }
  ) =>
    new OpenApiRequestBuilder<OrchestrationConfigListResponse>(
      'get',
      '/registry/v2/orchestrationConfigs',
      {
        headerParameters,
        queryParameters
      },
      OrchestrationConfigsApi._defaultBasePath
    ),
  /**
   * Create or update an imperatively managed orchestration config
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
        headerParameters: {
          'content-type': 'application/json',
          ...headerParameters
        }
      },
      OrchestrationConfigsApi._defaultBasePath
    ),
  /**
   * Obtain the history of edits of a particular imperatively managed orchestration config
   * @param scenario - Scenario field of the resource.
   * @param version - Version field of the resource.
   * @param name - Name field of the resource.
   * @param queryParameters - Object containing the following keys: include_spec, includeSpec, resolve_template_ref, resolveTemplateRef.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  listOrchestrationConfigHistory: (
    scenario: string,
    version: string,
    name: string,
    queryParameters?: {
      include_spec?: boolean;
      includeSpec?: boolean;
      resolve_template_ref?: boolean;
      resolveTemplateRef?: boolean;
    },
    headerParameters?: { 'AI-Resource-Group'?: string }
  ) =>
    new OpenApiRequestBuilder<OrchestrationConfigListResponse>(
      'get',
      '/registry/v2/scenarios/{scenario}/orchestrationConfigs/{name}/versions/{version}/history',
      {
        pathParameters: { scenario, version, name },
        headerParameters,
        queryParameters
      },
      OrchestrationConfigsApi._defaultBasePath
    ),
  /**
   * Retrieve a orchestration config by its UUID
   * @param orchestrationConfigId - UUID of the resource.
   * @param queryParameters - Object containing the following keys: resolve_template_ref, resolveTemplateRef.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getOrchestrationConfigByUuid: (
    orchestrationConfigId: string,
    queryParameters?: {
      resolve_template_ref?: boolean;
      resolveTemplateRef?: boolean;
    },
    headerParameters?: { 'AI-Resource-Group'?: string }
  ) =>
    new OpenApiRequestBuilder<OrchestrationConfigGetResponse>(
      'get',
      '/registry/v2/orchestrationConfigs/{orchestrationConfigId}',
      {
        pathParameters: { orchestrationConfigId },
        headerParameters,
        queryParameters
      },
      OrchestrationConfigsApi._defaultBasePath
    ),
  /**
   * Delete an imperatively managed orchestration config
   * @param orchestrationConfigId - UUID of the resource.
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
   * Create an imperatively managed orchestration config from a file
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  importOrchestrationConfig: (
    body:
      | ({
          /**
           * Format: "binary".
           */
          file?: Blob;
        } & Record<string, any>)
      | undefined,
    headerParameters?: { 'AI-Resource-Group'?: string }
  ) =>
    new OpenApiRequestBuilder<OrchestrationConfigPostResponse>(
      'post',
      '/registry/v2/orchestrationConfigs/import',
      {
        body,
        _encoding: {
          file: {
            contentType: 'application/octet-stream',
            isImplicit: true,
            parsedContentTypes: [
              { parameters: {}, type: 'application/octet-stream' }
            ]
          }
        },
        headerParameters: {
          'content-type': 'multipart/form-data',
          ...headerParameters
        }
      },
      OrchestrationConfigsApi._defaultBasePath
    ),
  /**
   * Download an orchestration config as a file
   * @param orchestrationConfigId - UUID of the resource.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  exportOrchestrationConfig: (
    orchestrationConfigId: string,
    headerParameters?: { 'AI-Resource-Group'?: string }
  ) =>
    new OpenApiRequestBuilder<Blob>(
      'get',
      '/registry/v2/orchestrationConfigs/{orchestrationConfigId}/export',
      {
        pathParameters: { orchestrationConfigId },
        headerParameters
      },
      OrchestrationConfigsApi._defaultBasePath
    )
};
