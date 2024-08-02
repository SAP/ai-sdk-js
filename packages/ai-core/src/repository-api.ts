/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-cloud-sdk/openapi';
import type {
  BckndArgoCDRepositoryDataResponse,
  BckndArgoCDRepositoryData,
  BckndArgoCDRepositoryCreationResponse,
  BckndArgoCDRepositoryDetails,
  BckndArgoCDRepositoryCredentials,
  BckndArgoCDRepositoryModificationResponse,
  BckndArgoCDRepositoryDeletionResponse
} from './schema';
/**
 * Representation of the 'RepositoryApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export const RepositoryApi = {
  /**
   * Retrieve a list of all GitOps repositories for a tenant.
   * @param queryParameters - Object containing the following keys: $top, $skip, $count.
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4RepositoriesGetAll: (
    queryParameters?: { $top?: number; $skip?: number; $count?: boolean },
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<BckndArgoCDRepositoryDataResponse>(
      'get',
      '/admin/repositories',
      {
        queryParameters,
        headerParameters
      }
    ),
  /**
   * On-board a new GitOps repository as specified in the content payload
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4RepositoriesCreate: (
    body: BckndArgoCDRepositoryData,
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<BckndArgoCDRepositoryCreationResponse>(
      'post',
      '/admin/repositories',
      {
        body,
        headerParameters
      }
    ),
  /**
   * Retrieve the access details for a repository if it exists.
   * @param repositoryName - Name of the repository
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4RepositoriesGet: (
    repositoryName: string,
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<BckndArgoCDRepositoryDetails>(
      'get',
      '/admin/repositories/{repositoryName}',
      {
        pathParameters: { repositoryName },
        headerParameters
      }
    ),
  /**
   * Update the referenced repository credentials to synchronize a repository.
   *
   * @param repositoryName - Name of the repository
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4RepositoriesUpdate: (
    repositoryName: string,
    body: BckndArgoCDRepositoryCredentials,
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<BckndArgoCDRepositoryModificationResponse>(
      'patch',
      '/admin/repositories/{repositoryName}',
      {
        pathParameters: { repositoryName },
        body,
        headerParameters
      }
    ),
  /**
   * Remove a repository from GitOps.
   * @param repositoryName - Name of the repository
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4RepositoriesDelete: (
    repositoryName: string,
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<BckndArgoCDRepositoryDeletionResponse>(
      'delete',
      '/admin/repositories/{repositoryName}',
      {
        pathParameters: { repositoryName },
        headerParameters
      }
    )
};
