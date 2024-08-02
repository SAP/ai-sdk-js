/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-cloud-sdk/openapi';
import type {
  BcknddockerRegistrySecretStatus,
  BcknddockerRegistrySecretWithSensitiveDataRequest,
  BcknddockerRegistrySecretModificationResponse,
  BcknddockerRegistrySecretDeletionResponse,
  BcknddockerRegistrySecretStatusResponse,
  BcknddockerRegistryNameComponent,
  BcknddockerRegistrySecretCreationResponse
} from './schema';
/**
 * Representation of the 'DockerRegistrySecretApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export const DockerRegistrySecretApi = {
  /**
   * Retrieve the stored secret metadata which matches the parameter dockerRegistryName. The base64 encoded field for the stored secret is not returned.
   *
   * @param dockerRegistryName - Name of the docker Registry store for the secret.
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4DockerRegistrySecretsGet: (
    dockerRegistryName: string,
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<BcknddockerRegistrySecretStatus>(
      'get',
      '/admin/dockerRegistrySecrets/{dockerRegistryName}',
      {
        pathParameters: { dockerRegistryName },
        headerParameters
      }
    ),
  /**
   * Update a secret with name of dockerRegistryName if it exists.
   *
   * @param dockerRegistryName - Name of the docker Registry store for the secret.
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4DockerRegistrySecretsPatch: (
    dockerRegistryName: string,
    body: BcknddockerRegistrySecretWithSensitiveDataRequest,
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<BcknddockerRegistrySecretModificationResponse>(
      'patch',
      '/admin/dockerRegistrySecrets/{dockerRegistryName}',
      {
        pathParameters: { dockerRegistryName },
        body,
        headerParameters
      }
    ),
  /**
   * Delete a secret with the name of dockerRegistryName if it exists.
   * @param dockerRegistryName - Name of the docker Registry store for the secret.
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4DockerRegistrySecretsDelete: (
    dockerRegistryName: string,
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<BcknddockerRegistrySecretDeletionResponse>(
      'delete',
      '/admin/dockerRegistrySecrets/{dockerRegistryName}',
      {
        pathParameters: { dockerRegistryName },
        headerParameters
      }
    ),
  /**
   * Retrieve a list of metadata of the stored secrets
   *
   * @param queryParameters - Object containing the following keys: $top, $skip, $count.
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4DockerRegistrySecretsQuery: (
    queryParameters?: { $top?: number; $skip?: number; $count?: boolean },
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<BcknddockerRegistrySecretStatusResponse>(
      'get',
      '/admin/dockerRegistrySecrets',
      {
        queryParameters,
        headerParameters
      }
    ),
  /**
   * Create a secret based on the configuration in the request body.
   *
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4DockerRegistrySecretsCreate: (
    body: BcknddockerRegistrySecretWithSensitiveDataRequest & {
      name: BcknddockerRegistryNameComponent;
    } & Record<string, any>,
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<BcknddockerRegistrySecretCreationResponse>(
      'post',
      '/admin/dockerRegistrySecrets',
      {
        body,
        headerParameters
      }
    )
};
