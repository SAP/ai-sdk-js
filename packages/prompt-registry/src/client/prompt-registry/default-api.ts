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
   * Create a request builder for execution of get requests to the '/healthz' endpoint.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  registryControllerPromptControllerHealthz: () =>
    new OpenApiRequestBuilder<string>(
      'get',
      '/healthz',
      {},
      DefaultApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the '/internal/promptTemplates/provisioning' endpoint.
   * @param headerParameters - Object containing the following keys: AI-Main-Tenant.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  registryControllerPromptControllerOnboardTenant: (headerParameters: {
    'AI-Main-Tenant': string;
  }) =>
    new OpenApiRequestBuilder<ProvisioningResponse>(
      'post',
      '/internal/promptTemplates/provisioning',
      {
        headerParameters
      },
      DefaultApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of delete requests to the '/internal/promptTemplates/provisioning' endpoint.
   * @param headerParameters - Object containing the following keys: AI-Main-Tenant.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  registryControllerPromptControllerOffboardTenant: (headerParameters: {
    'AI-Main-Tenant': string;
  }) =>
    new OpenApiRequestBuilder<ProvisioningResponse>(
      'delete',
      '/internal/promptTemplates/provisioning',
      {
        headerParameters
      },
      DefaultApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/lm/promptTemplates' endpoint.
   * @param queryParameters - Object containing the following keys: scenario, name, version, retrieve, includeSpec.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  registryControllerPromptControllerListPromptTemplates: (queryParameters?: {
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
   * Create a request builder for execution of post requests to the '/lm/promptTemplates' endpoint.
   * @param body - Request body.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  registryControllerPromptControllerCreateUpdatePromptTemplate: (
    body: PromptTemplatePostRequest
  ) =>
    new OpenApiRequestBuilder<PromptTemplatePostResponse>(
      'post',
      '/lm/promptTemplates',
      {
        body
      },
      DefaultApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/lm/scenarios/{scenario}/promptTemplates/{name}/versions/{version}/history' endpoint.
   * @param scenario - Path parameter.
   * @param version - Path parameter.
   * @param name - Path parameter.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  registryControllerPromptControllerListPromptTemplateHistory: (
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
      DefaultApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/lm/promptTemplates/{promptTemplateId}' endpoint.
   * @param promptTemplateId - Path parameter.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  registryControllerPromptControllerGetPromptTemplateByUuid: (
    promptTemplateId: string
  ) =>
    new OpenApiRequestBuilder<PromptTemplateGetResponse>(
      'get',
      '/lm/promptTemplates/{promptTemplateId}',
      {
        pathParameters: { promptTemplateId }
      },
      DefaultApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of delete requests to the '/lm/promptTemplates/{promptTemplateId}' endpoint.
   * @param promptTemplateId - Path parameter.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  registryControllerPromptControllerDeletePromptTemplate: (
    promptTemplateId: string
  ) =>
    new OpenApiRequestBuilder<PromptTemplateDeleteResponse>(
      'delete',
      '/lm/promptTemplates/{promptTemplateId}',
      {
        pathParameters: { promptTemplateId }
      },
      DefaultApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the '/lm/promptTemplates/import' endpoint.
   * @param body - Request body.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  registryControllerPromptControllerImportPromptTemplate: (
    body: any | undefined
  ) =>
    new OpenApiRequestBuilder<PromptTemplatePostResponse>(
      'post',
      '/lm/promptTemplates/import',
      {
        body
      },
      DefaultApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/lm/promptTemplates/{promptTemplateId}/export' endpoint.
   * @param promptTemplateId - Path parameter.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  registryControllerPromptControllerExportPromptTemplate: (
    promptTemplateId: string
  ) =>
    new OpenApiRequestBuilder<string>(
      'get',
      '/lm/promptTemplates/{promptTemplateId}/export',
      {
        pathParameters: { promptTemplateId }
      },
      DefaultApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of post requests to the '/lm/promptTemplates/{promptTemplateId}/substitution' endpoint.
   * @param promptTemplateId - Path parameter.
   * @param body - Request body.
   * @param queryParameters - Object containing the following keys: metadata.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  registryControllerPromptControllerParsePromptTemplateById: (
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
   * Create a request builder for execution of post requests to the '/lm/scenarios/{scenario}/promptTemplates/{name}/versions/{version}/substitution' endpoint.
   * @param scenario - Path parameter.
   * @param version - Path parameter.
   * @param name - Path parameter.
   * @param body - Request body.
   * @param queryParameters - Object containing the following keys: metadata.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  registryControllerPromptControllerParsePromptTemplateByNameVersion: (
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
