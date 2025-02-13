/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type {
  ProvisioningResponse,
  PromptTemplateListResponse,
  PromptTemplatePostRequest,
  PromptTemplatePostResponse,
  PromptTemplateGetResponse,
  PromptTemplateDeleteResponse,
  PromptTemplateSubstitutionRequest,
  PromptTemplateSubstitutionResponse
} from './schema/index.js';
/**
 * Representation of the 'DefaultApi'.
 * This API is part of the 'prompt-registry' service.
 */
export const DefaultApi = {
  _defaultBasePath: undefined,
  /**
   * Health check endpoint
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  healthz: () =>
    new OpenApiRequestBuilder<string>(
      'get',
      '/healthz',
      {},
      DefaultApi._defaultBasePath
    ),
  /**
   * Onboard a tenant
   * @param headerParameters - Object containing the following keys: AI-Main-Tenant.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  onboardTenant: (headerParameters: { 'AI-Main-Tenant': string }) =>
    new OpenApiRequestBuilder<ProvisioningResponse>(
      'post',
      '/internal/promptTemplates/provisioning',
      {
        headerParameters
      },
      DefaultApi._defaultBasePath
    ),
  /**
   * Offboard a tenant
   * @param headerParameters - Object containing the following keys: AI-Main-Tenant.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  offboardTenant: (headerParameters: { 'AI-Main-Tenant': string }) =>
    new OpenApiRequestBuilder<ProvisioningResponse>(
      'delete',
      '/internal/promptTemplates/provisioning',
      {
        headerParameters
      },
      DefaultApi._defaultBasePath
    ),
  /**
   * Get prompt templates
   * @param queryParameters - Object containing the following keys: scenario, name, version, retrieve, includeSpec.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getPromptTemplates: (queryParameters?: {
    scenario?: string;
    name?: string;
    version?: string;
    retrieve?: string;
    includeSpec?: boolean;
  }) =>
    new OpenApiRequestBuilder<PromptTemplateListResponse>(
      'get',
      '/lm/promptTemplates',
      {
        queryParameters
      },
      DefaultApi._defaultBasePath
    ),
  /**
   * Create or update a prompt template
   * @param body - Request body.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createUpdatePromptTemplate: (body: PromptTemplatePostRequest) =>
    new OpenApiRequestBuilder<PromptTemplatePostResponse>(
      'post',
      '/lm/promptTemplates',
      {
        body
      },
      DefaultApi._defaultBasePath
    ),
  /**
   * Get prompt template history
   * @param scenario - Path parameter.
   * @param version - Path parameter.
   * @param name - Path parameter.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getPromptTemplateHistory: (scenario: string, version: string, name: string) =>
    new OpenApiRequestBuilder<PromptTemplateListResponse>(
      'get',
      '/lm/scenarios/{scenario}/promptTemplates/{name}/versions/{version}/history',
      {
        pathParameters: { scenario, version, name }
      },
      DefaultApi._defaultBasePath
    ),
  /**
   * Get prompt template by ID
   * @param promptTemplateId - Path parameter.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getPromptTemplateById: (promptTemplateId: string) =>
    new OpenApiRequestBuilder<PromptTemplateGetResponse>(
      'get',
      '/lm/promptTemplates/{promptTemplateId}',
      {
        pathParameters: { promptTemplateId }
      },
      DefaultApi._defaultBasePath
    ),
  /**
   * Delete prompt template
   * @param promptTemplateId - Path parameter.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  deletePromptTemplate: (promptTemplateId: string) =>
    new OpenApiRequestBuilder<PromptTemplateDeleteResponse>(
      'delete',
      '/lm/promptTemplates/{promptTemplateId}',
      {
        pathParameters: { promptTemplateId }
      },
      DefaultApi._defaultBasePath
    ),
  /**
   * Import prompt template
   * @param body - Request body.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  importPromptTemplate: (body: any | undefined) =>
    new OpenApiRequestBuilder<PromptTemplatePostResponse>(
      'post',
      '/lm/promptTemplates/import',
      {
        body
      },
      DefaultApi._defaultBasePath
    ),
  /**
   * Export prompt template
   * @param promptTemplateId - Path parameter.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  exportPromptTemplate: (promptTemplateId: string) =>
    new OpenApiRequestBuilder<string>(
      'get',
      '/lm/promptTemplates/{promptTemplateId}/export',
      {
        pathParameters: { promptTemplateId }
      },
      DefaultApi._defaultBasePath
    ),
  /**
   * Parse prompt template by ID
   * @param promptTemplateId - Path parameter.
   * @param body - Request body.
   * @param queryParameters - Object containing the following keys: metadata.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  parsePromptTemplateById: (
    promptTemplateId: string,
    body: PromptTemplateSubstitutionRequest | undefined,
    queryParameters?: { metadata?: boolean }
  ) =>
    new OpenApiRequestBuilder<PromptTemplateSubstitutionResponse>(
      'post',
      '/lm/promptTemplates/{promptTemplateId}/substitution',
      {
        pathParameters: { promptTemplateId },
        body,
        queryParameters
      },
      DefaultApi._defaultBasePath
    ),
  /**
   * Parse prompt template by name and version
   * @param scenario - Path parameter.
   * @param version - Path parameter.
   * @param name - Path parameter.
   * @param body - Request body.
   * @param queryParameters - Object containing the following keys: metadata.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  parsePromptTemplateByNameVersion: (
    scenario: string,
    version: string,
    name: string,
    body: PromptTemplateSubstitutionRequest | undefined,
    queryParameters?: { metadata?: boolean }
  ) =>
    new OpenApiRequestBuilder<PromptTemplateSubstitutionResponse>(
      'post',
      '/lm/scenarios/{scenario}/promptTemplates/{name}/versions/{version}/substitution',
      {
        pathParameters: { scenario, version, name },
        body,
        queryParameters
      },
      DefaultApi._defaultBasePath
    )
};
