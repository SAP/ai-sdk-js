/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
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
   * @param headerParameters - Object containing the following keys: AI-Resource-Group, AI-Resource-Group-Scope.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  listPromptTemplates: (
    queryParameters?: {
      scenario?: string;
      name?: string;
      version?: string;
      retrieve?: string;
      includeSpec?: boolean;
    },
    headerParameters?: {
      'AI-Resource-Group'?: string;
      'AI-Resource-Group-Scope'?: 'true' | 'True' | 'false' | 'False';
    }
  ) =>
    new OpenApiRequestBuilder<PromptTemplateListResponse>(
      'get',
      '/lm/promptTemplates',
      {
        headerParameters,
        queryParameters
      },
      PromptTemplatesApi._defaultBasePath
    ),
  /**
   * Create or update a prompt template
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group, AI-Resource-Group-Scope.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createUpdatePromptTemplate: (
    body: PromptTemplatePostRequest,
    headerParameters?: {
      'AI-Resource-Group'?: string;
      'AI-Resource-Group-Scope'?: 'true' | 'True' | 'false' | 'False';
    }
  ) =>
    new OpenApiRequestBuilder<PromptTemplatePostResponse>(
      'post',
      '/lm/promptTemplates',
      {
        body,
        headerParameters: {
          'content-type': 'application/json',
          ...headerParameters
        }
      },
      PromptTemplatesApi._defaultBasePath
    ),
  /**
   * List prompt template history
   * @param scenario - Scenario field of the resource.
   * @param version - Version field of the resource.
   * @param name - Name field of the resource.
   * @param queryParameters - Object containing the following keys: includeSpec.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group, AI-Resource-Group-Scope.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  listPromptTemplateHistory: (
    scenario: string,
    version: string,
    name: string,
    queryParameters?: { includeSpec?: boolean },
    headerParameters?: {
      'AI-Resource-Group'?: string;
      'AI-Resource-Group-Scope'?: 'true' | 'True' | 'false' | 'False';
    }
  ) =>
    new OpenApiRequestBuilder<PromptTemplateListResponse>(
      'get',
      '/lm/scenarios/{scenario}/promptTemplates/{name}/versions/{version}/history',
      {
        pathParameters: { scenario, version, name },
        headerParameters,
        queryParameters
      },
      PromptTemplatesApi._defaultBasePath
    ),
  /**
   * Get prompt template by UUID
   * @param promptTemplateId - UUID of the prompt template.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group, AI-Resource-Group-Scope.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getPromptTemplateByUuid: (
    promptTemplateId: string,
    headerParameters?: {
      'AI-Resource-Group'?: string;
      'AI-Resource-Group-Scope'?: 'true' | 'True' | 'false' | 'False';
    }
  ) =>
    new OpenApiRequestBuilder<PromptTemplateGetResponse>(
      'get',
      '/lm/promptTemplates/{promptTemplateId}',
      {
        pathParameters: { promptTemplateId },
        headerParameters
      },
      PromptTemplatesApi._defaultBasePath
    ),
  /**
   * Delete an imperatively managed prompt template
   * @param promptTemplateId - UUID of the prompt template.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group, AI-Resource-Group-Scope.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  deletePromptTemplate: (
    promptTemplateId: string,
    headerParameters?: {
      'AI-Resource-Group'?: string;
      'AI-Resource-Group-Scope'?: 'true' | 'True' | 'false' | 'False';
    }
  ) =>
    new OpenApiRequestBuilder<PromptTemplateDeleteResponse>(
      'delete',
      '/lm/promptTemplates/{promptTemplateId}',
      {
        pathParameters: { promptTemplateId },
        headerParameters
      },
      PromptTemplatesApi._defaultBasePath
    ),
  /**
   * Create an imperatively managed prompt template from a file
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group, AI-Resource-Group-Scope.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  importPromptTemplate: (
    body:
      | ({
          /**
           * Format: "binary".
           */
          file?: Blob;
        } & Record<string, any>)
      | undefined,
    headerParameters?: {
      'AI-Resource-Group'?: string;
      'AI-Resource-Group-Scope'?: 'true' | 'True' | 'false' | 'False';
    }
  ) =>
    new OpenApiRequestBuilder<PromptTemplatePostResponse>(
      'post',
      '/lm/promptTemplates/import',
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
      PromptTemplatesApi._defaultBasePath
    ),
  /**
   * Download a prompt template as a file
   * @param promptTemplateId - UUID of the prompt template.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group, AI-Resource-Group-Scope.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  exportPromptTemplate: (
    promptTemplateId: string,
    headerParameters?: {
      'AI-Resource-Group'?: string;
      'AI-Resource-Group-Scope'?: 'true' | 'True' | 'false' | 'False';
    }
  ) =>
    new OpenApiRequestBuilder<Blob>(
      'get',
      '/lm/promptTemplates/{promptTemplateId}/export',
      {
        pathParameters: { promptTemplateId },
        headerParameters
      },
      PromptTemplatesApi._defaultBasePath
    ),
  /**
   * Fill the placeholders of a prompt template that is identified by its UUID
   * @param promptTemplateId - UUID of the prompt template.
   * @param body - Request body.
   * @param queryParameters - Object containing the following keys: metadata.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group, AI-Resource-Group-Scope.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  parsePromptTemplateById: (
    promptTemplateId: string,
    body: PromptTemplateSubstitutionRequest | undefined,
    queryParameters?: { metadata?: boolean },
    headerParameters?: {
      'AI-Resource-Group'?: string;
      'AI-Resource-Group-Scope'?: 'true' | 'True' | 'false' | 'False';
    }
  ) =>
    new OpenApiRequestBuilder<PromptTemplateSubstitutionResponse>(
      'post',
      '/lm/promptTemplates/{promptTemplateId}/substitution',
      {
        pathParameters: { promptTemplateId },
        body,
        headerParameters: {
          'content-type': 'application/json',
          ...headerParameters
        },
        queryParameters
      },
      PromptTemplatesApi._defaultBasePath
    ),
  /**
   * Fill the placeholders of a prompt template that is identified by its scenario, name and version
   * @param scenario - Scenario field of the resource.
   * @param version - Version field of the resource.
   * @param name - Name field of the resource.
   * @param body - Request body.
   * @param queryParameters - Object containing the following keys: metadata.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group, AI-Resource-Group-Scope.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  parsePromptTemplateByNameVersion: (
    scenario: string,
    version: string,
    name: string,
    body: PromptTemplateSubstitutionRequest | undefined,
    queryParameters?: { metadata?: boolean },
    headerParameters?: {
      'AI-Resource-Group'?: string;
      'AI-Resource-Group-Scope'?: 'true' | 'True' | 'false' | 'False';
    }
  ) =>
    new OpenApiRequestBuilder<PromptTemplateSubstitutionResponse>(
      'post',
      '/lm/scenarios/{scenario}/promptTemplates/{name}/versions/{version}/substitution',
      {
        pathParameters: { scenario, version, name },
        body,
        headerParameters: {
          'content-type': 'application/json',
          ...headerParameters
        },
        queryParameters
      },
      PromptTemplatesApi._defaultBasePath
    )
};
