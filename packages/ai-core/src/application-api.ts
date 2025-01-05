/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-cloud-sdk/openapi';
import type {
  AllArgoCDApplicationData,
  Body,
  ArgoCDApplicationCreationResponse,
  ArgoCDApplicationStatus,
  ArgoCDApplicationData,
  ArgoCDApplicationBaseData,
  ArgoCDApplicationModificationResponse,
  ArgoCDApplicationDeletionResponse,
  ArgoCDApplicationRefreshResponse
} from './schema/index.js';
/**
 * Representation of the 'ApplicationApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export const ApplicationApi = {
  /**
   * Return all Argo CD application data objects.
   *
   * @param queryParameters - Object containing the following keys: $top, $skip, $count.
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4ApplicationsGetAll: (
    queryParameters?: { $top?: number; $skip?: number; $count?: boolean },
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<AllArgoCDApplicationData>(
      'get',
      '/admin/applications',
      {
        queryParameters,
        headerParameters
      }
    ),
  /**
   * Create an ArgoCD application to synchronise a repository.
   *
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4ApplicationsCreate: (
    body: Body,
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<ArgoCDApplicationCreationResponse>(
      'post',
      '/admin/applications',
      {
        body,
        headerParameters
      }
    ),
  /**
   * Returns the ArgoCD application health and sync status.
   *
   * @param applicationName - Name of the ArgoCD application
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4ApplicationsGetStatus: (
    applicationName: string,
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<ArgoCDApplicationStatus>(
      'get',
      '/admin/applications/{applicationName}/status',
      {
        pathParameters: { applicationName },
        headerParameters
      }
    ),
  /**
   * Retrieve the ArgoCD application details.
   *
   * @param applicationName - Name of the ArgoCD application
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4ApplicationsGet: (
    applicationName: string,
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<ArgoCDApplicationData>(
      'get',
      '/admin/applications/{applicationName}',
      {
        pathParameters: { applicationName },
        headerParameters
      }
    ),
  /**
   * Update the referenced ArgoCD application to synchronize the repository.
   *
   * @param applicationName - Name of the ArgoCD application
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4ApplicationsUpdate: (
    applicationName: string,
    body: ArgoCDApplicationBaseData,
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<ArgoCDApplicationModificationResponse>(
      'patch',
      '/admin/applications/{applicationName}',
      {
        pathParameters: { applicationName },
        body,
        headerParameters
      }
    ),
  /**
   * Delete an ArgoCD application
   * @param applicationName - Name of the ArgoCD application
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4ApplicationsDelete: (
    applicationName: string,
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<ArgoCDApplicationDeletionResponse>(
      'delete',
      '/admin/applications/{applicationName}',
      {
        pathParameters: { applicationName },
        headerParameters
      }
    ),
  /**
   * Schedules a refresh of the specified application that will be picked up by ArgoCD asynchronously
   *
   * @param applicationName - Name of the ArgoCD application
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4ApplicationsRefresh: (
    applicationName: string,
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<ArgoCDApplicationRefreshResponse>(
      'post',
      '/admin/applications/{applicationName}/refresh',
      {
        pathParameters: { applicationName },
        headerParameters
      }
    )
};