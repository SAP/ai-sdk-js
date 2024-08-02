/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-cloud-sdk/openapi';
import type {
  BckndobjectStoreSecretStatusResponse,
  BckndobjectStoreSecretWithSensitiveDataRequestForPostCall,
  BckndobjectStoreSecretCreationResponse,
  BckndobjectStoreSecretStatus,
  BckndobjectStoreSecretWithSensitiveDataRequest,
  BckndobjectStoreSecretModificationResponse,
  BckndobjectStoreSecretDeletionResponse
} from './schema';
/**
 * Representation of the 'ObjectStoreSecretApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export const ObjectStoreSecretApi = {
  /**
   * Retrieve a list of metadata of the stored secrets.
   *
   * @param queryParameters - Object containing the following keys: $top, $skip, $count.
   * @param headerParameters - Object containing the following keys: Authorization, AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4ObjectStoreSecretsQuery: (
    queryParameters?: { $top?: number; $skip?: number; $count?: boolean },
    headerParameters?: { Authorization?: string; 'AI-Resource-Group'?: string }
  ) =>
    new OpenApiRequestBuilder<BckndobjectStoreSecretStatusResponse>(
      'get',
      '/admin/objectStoreSecrets',
      {
        queryParameters,
        headerParameters
      }
    ),
  /**
   * Create a secret based on the configuration in the request body
   *
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: Authorization, AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4ObjectStoreSecretsCreate: (
    body: BckndobjectStoreSecretWithSensitiveDataRequestForPostCall,
    headerParameters?: { Authorization?: string; 'AI-Resource-Group'?: string }
  ) =>
    new OpenApiRequestBuilder<BckndobjectStoreSecretCreationResponse>(
      'post',
      '/admin/objectStoreSecrets',
      {
        body,
        headerParameters
      }
    ),
  /**
   * This retrieves the metadata of the stored secret which match the parameter objectStoreName.
   * The fetched secret is constructed like objectStoreName-object-store-secret
   * The base64 encoded field for the stored secret is not returned.
   *
   * @param objectStoreName - Name of the object store for the secret.
   * @param headerParameters - Object containing the following keys: Authorization, AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4ObjectStoreSecretsGet: (
    objectStoreName: string,
    headerParameters?: { Authorization?: string; 'AI-Resource-Group'?: string }
  ) =>
    new OpenApiRequestBuilder<BckndobjectStoreSecretStatus>(
      'get',
      '/admin/objectStoreSecrets/{objectStoreName}',
      {
        pathParameters: { objectStoreName },
        headerParameters
      }
    ),
  /**
   * Update a secret with name of objectStoreName if it exists.
   *
   * @param objectStoreName - Name of the object store for the secret.
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: Authorization, AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4ObjectStoreSecretsPatch: (
    objectStoreName: string,
    body: BckndobjectStoreSecretWithSensitiveDataRequest,
    headerParameters?: { Authorization?: string; 'AI-Resource-Group'?: string }
  ) =>
    new OpenApiRequestBuilder<BckndobjectStoreSecretModificationResponse>(
      'patch',
      '/admin/objectStoreSecrets/{objectStoreName}',
      {
        pathParameters: { objectStoreName },
        body,
        headerParameters
      }
    ),
  /**
   * Delete a secret with the name of objectStoreName if it exists.
   * @param objectStoreName - Name of the object store for the secret.
   * @param headerParameters - Object containing the following keys: Authorization, AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4ObjectStoreSecretsDelete: (
    objectStoreName: string,
    headerParameters?: { Authorization?: string; 'AI-Resource-Group'?: string }
  ) =>
    new OpenApiRequestBuilder<BckndobjectStoreSecretDeletionResponse>(
      'delete',
      '/admin/objectStoreSecrets/{objectStoreName}',
      {
        pathParameters: { objectStoreName },
        headerParameters
      }
    )
};
