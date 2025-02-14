/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type {
  PromptTemplateListResponse,
  PromptTemplatePostRequest,
  PromptTemplatePostResponse,
  PromptTemplateGetResponse,
  PromptTemplateDeleteResponse,
  PromptTemplateSubstitutionRequest,
  PromptTemplateSubstitutionResponse
} from './schema/index.js';
/**
 * Representation of the 'PromptTemplatesApi'.
 * This API is part of the 'prompt-registry' service.
 */
export const PromptTemplatesApi = {
  _defaultBasePath: undefined,
  /**
   * List prompt templates
   * @param queryParameters - Object containing the following keys: scenario, name, version, retrieve, includeSpec.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  listPromptTemplates: (queryParameters?: {
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
      PromptTemplatesApi._defaultBasePath
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
      PromptTemplatesApi._defaultBasePath
    ),
  /**
   * List prompt template history
   * @param scenario - Path parameter.
   * @param version - Path parameter.
   * @param name - Path parameter.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  listPromptTemplateHistory: (
    scenario: string,
    version: string,
    name: string
  ) =>
    new OpenApiRequestBuilder<PromptTemplateListResponse>(
      'get',
      '/lm/scenarios/{scenario}/promptTemplates/{name}/versions/{version}/history',
      {
        pathParameters: { scenario, version, name }
      },
      PromptTemplatesApi._defaultBasePath
    ),
  /**
   * Get prompt template by UUID
   * @param promptTemplateId - Path parameter.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getPromptTemplateByUuid: (promptTemplateId: string) =>
    new OpenApiRequestBuilder<PromptTemplateGetResponse>(
      'get',
      '/lm/promptTemplates/{promptTemplateId}',
      {
        pathParameters: { promptTemplateId }
      },
      PromptTemplatesApi._defaultBasePath
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
      PromptTemplatesApi._defaultBasePath
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
      PromptTemplatesApi._defaultBasePath
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
      PromptTemplatesApi._defaultBasePath
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
      PromptTemplatesApi._defaultBasePath
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
      PromptTemplatesApi._defaultBasePath
    )
};
