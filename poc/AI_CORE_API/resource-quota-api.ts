/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-cloud-sdk/openapi';
import type {
  CommonResourceQuotaResponse,
  ExecutableResourceQuotaResponse
} from './schema';
/**
 * Representation of the 'ResourceQuotaApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export const ResourceQuotaApi = {
  /**
   * Get the details about quota and usage for resource groups
   * @param queryParameters - Object containing the following keys: quotaOnly.
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4ResourceQuotaGetResourceGroupQuota: (
    queryParameters?: { quotaOnly?: boolean },
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<CommonResourceQuotaResponse>(
      'get',
      '/admin/resourceQuota/resourceGroups',
      {
        queryParameters,
        headerParameters
      }
    ),
  /**
   * Get the details about quota and usage for executables
   * @param queryParameters - Object containing the following keys: quotaOnly.
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4ResourceQuotaGetExecutableQuota: (
    queryParameters?: { quotaOnly?: boolean },
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<ExecutableResourceQuotaResponse>(
      'get',
      '/admin/resourceQuota/executables',
      {
        queryParameters,
        headerParameters
      }
    ),
  /**
   * Get the details about quota and usage for applications
   * @param queryParameters - Object containing the following keys: quotaOnly.
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4ResourceQuotaGetApplicationQuota: (
    queryParameters?: { quotaOnly?: boolean },
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<CommonResourceQuotaResponse>(
      'get',
      '/admin/resourceQuota/applications',
      {
        queryParameters,
        headerParameters
      }
    ),
  /**
   * Get the details about quota and usage for repositories
   * @param queryParameters - Object containing the following keys: quotaOnly.
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4ResourceQuotaGetRepositoryQuota: (
    queryParameters?: { quotaOnly?: boolean },
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<CommonResourceQuotaResponse>(
      'get',
      '/admin/resourceQuota/repositories',
      {
        queryParameters,
        headerParameters
      }
    ),
  /**
   * Get the details about quota and usage for tenant-level generic secrets
   * @param queryParameters - Object containing the following keys: quotaOnly.
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4ResourceQuotaGetGenericSecretQuota: (
    queryParameters?: { quotaOnly?: boolean },
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<CommonResourceQuotaResponse>(
      'get',
      '/admin/resourceQuota/secrets',
      {
        queryParameters,
        headerParameters
      }
    ),
  /**
   * Get the details about quota and usage for docker registry secrets
   * @param queryParameters - Object containing the following keys: quotaOnly.
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4ResourceQuotaGetDockerRegistrySecretQuota: (
    queryParameters?: { quotaOnly?: boolean },
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<CommonResourceQuotaResponse>(
      'get',
      '/admin/resourceQuota/dockerRegistrySecrets',
      {
        queryParameters,
        headerParameters
      }
    )
};
