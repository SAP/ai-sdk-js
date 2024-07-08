/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-cloud-sdk/openapi';
import type {
  ListGenericSecretsResponse,
  GenericSecretPostBody,
  GenericSecretDataResponse,
  GenericSecretPatchBody
} from './schema';
/**
 * Representation of the 'SecretApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export const SecretApi = {
  /**
   * Lists all secrets corresponding to tenant. This retrieves metadata only, not the secret data itself.
   * @param queryParameters - Object containing the following keys: $top, $skip, $count.
   * @param headerParameters - Object containing the following keys: Authorization, AI-Resource-Group, AI-Tenant-Scope.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4GenericSecretsGet: (
    queryParameters?: { $top?: number; $skip?: number; $count?: boolean },
    headerParameters?: {
      Authorization?: string;
      'AI-Resource-Group'?: string;
      'AI-Tenant-Scope'?: boolean;
    }
  ) =>
    new OpenApiRequestBuilder<ListGenericSecretsResponse>(
      'get',
      '/admin/secrets',
      {
        queryParameters,
        headerParameters
      }
    ),
  /**
   * Create a new generic secret in the corresponding resource group or at main tenant level.
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: Authorization, AI-Resource-Group, AI-Tenant-Scope.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4GenericSecretsCreate: (
    body: GenericSecretPostBody,
    headerParameters?: {
      Authorization?: string;
      'AI-Resource-Group'?: string;
      'AI-Tenant-Scope'?: boolean;
    }
  ) =>
    new OpenApiRequestBuilder<GenericSecretDataResponse>(
      'post',
      '/admin/secrets',
      {
        body,
        headerParameters
      }
    ),
  /**
   * Update secret credentials. Replace secret data with the provided data.
   * @param secretName - Path parameter.
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: Authorization, AI-Resource-Group, AI-Tenant-Scope.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4GenericSecretsUpdate: (
    secretName: string,
    body: GenericSecretPatchBody,
    headerParameters?: {
      Authorization?: string;
      'AI-Resource-Group'?: string;
      'AI-Tenant-Scope'?: boolean;
    }
  ) =>
    new OpenApiRequestBuilder<GenericSecretDataResponse>(
      'patch',
      '/admin/secrets/{secretName}',
      {
        pathParameters: { secretName },
        body,
        headerParameters
      }
    ),
  /**
   * Deletes the secret from provided resource group namespace
   * @param secretName - Path parameter.
   * @param headerParameters - Object containing the following keys: Authorization, AI-Resource-Group, AI-Tenant-Scope.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4GenericSecretsDelete: (
    secretName: string,
    headerParameters?: {
      Authorization?: string;
      'AI-Resource-Group'?: string;
      'AI-Tenant-Scope'?: boolean;
    }
  ) =>
    new OpenApiRequestBuilder<any>('delete', '/admin/secrets/{secretName}', {
      pathParameters: { secretName },
      headerParameters
    })
};
