/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';

import type {
  TabularArtifactAsyncTabularArtifactDetails,
  TabularArtifactAsyncCreateTARequest,
  TabularArtifactCommonTabularArtifactDataPreview,
  TabularArtifactAsyncTabularArtifactListResponse
} from './schema/index.js';
/**
 * Representation of the 'TabularArtifactAsyncSpecificationTabularArtifactsApi'.
 * This API is part of the 'ctx-registry' service.
 */
export const TabularArtifactAsyncSpecificationTabularArtifactsApi = {
  _defaultBasePath: '/v2/admin/tcr',
  /**
   * Retrieve details of a specific Tabular Artifact by name including schema metadata.
   *
   * @param tabularArtifactName - Unique name of the Tabular Artifact. Must match allowed pattern and length constraints.
   *
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getTabularArtifactByName: (
    tabularArtifactName: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<TabularArtifactAsyncTabularArtifactDetails>(
      'get',
      '/tabularArtifacts/{tabularArtifactName}',
      {
        pathParameters: { tabularArtifactName },
        headerParameters
      },
      TabularArtifactAsyncSpecificationTabularArtifactsApi._defaultBasePath
    ),
  /**
   * Create a Tabular Artifact asynchronously. Schema validation happens synchronously; resource creation runs in a background task. Poll GET /tabularArtifacts/{name} to track progress via status and errorMessage. Returns 202 (not exists or ERROR retry), 409 (ACTIVE or DELETING), 422 (retry exhausted).
   *
   * @param tabularArtifactName - Unique name of the Tabular Artifact
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createTabularArtifact: (
    tabularArtifactName: string,
    body: TabularArtifactAsyncCreateTARequest,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<{
      /**
       * Name of the Tabular Artifact being created
       */
      name?: string;
    }>(
      'put',
      '/tabularArtifacts/{tabularArtifactName}',
      {
        pathParameters: { tabularArtifactName },
        body,
        headerParameters: {
          'content-type': 'application/json',
          ...headerParameters
        }
      },
      TabularArtifactAsyncSpecificationTabularArtifactsApi._defaultBasePath
    ),
  /**
   * Delete a specific Tabular Artifact by name
   * @param tabularArtifactName - Unique name of the Tabular Artifact. Must match allowed pattern and length constraints.
   *
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  deleteTabularArtifact: (
    tabularArtifactName: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<any>(
      'delete',
      '/tabularArtifacts/{tabularArtifactName}',
      {
        pathParameters: { tabularArtifactName },
        headerParameters
      },
      TabularArtifactAsyncSpecificationTabularArtifactsApi._defaultBasePath
    ),
  /**
   * Retrieve a preview of data rows from the Virtual Table (first 10 records)
   * @param tabularArtifactName - Unique name of the Tabular Artifact. Must match allowed pattern and length constraints.
   *
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getTabularArtifactData: (
    tabularArtifactName: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<TabularArtifactCommonTabularArtifactDataPreview>(
      'get',
      '/tabularArtifacts/{tabularArtifactName}/data',
      {
        pathParameters: { tabularArtifactName },
        headerParameters
      },
      TabularArtifactAsyncSpecificationTabularArtifactsApi._defaultBasePath
    ),
  /**
   * Retrieve list of Tabular Artifacts with pagination
   * @param queryParameters - Object containing the following keys: $top, $skip, $count.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  controllersTabularArtifactV1EndpointsGetAllTabularArtifacts: (
    queryParameters: { $top?: number; $skip?: number; $count?: boolean },
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<TabularArtifactAsyncTabularArtifactListResponse>(
      'get',
      '/tabularArtifacts',
      {
        headerParameters,
        queryParameters
      },
      TabularArtifactAsyncSpecificationTabularArtifactsApi._defaultBasePath
    ),
  /**
   * Internal endpoint to immediately trigger the cleanup cycle for soft-deleted Tabular Artifacts (PENDING_DELETE=TRUE). If an optional list of names is provided, only those specific artifacts are cleaned up. Otherwise all pending-delete artifacts are processed. Drops virtual tables, removes unused remote sources, and hard-deletes the metadata rows.
   *
   * @param body - Request body.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  controllersTabularArtifactV1EndpointsTriggerTaCleanup: (
    body:
      | {
          /**
           * Optional list of Tabular Artifact names to clean up. When provided, only these specific names are processed. When omitted, all pending-delete artifacts are cleaned up.
           *
           * @example [
           *   "customer-ta",
           *   "orders-ta"
           * ]
           */
          names?: string[];
        }
      | undefined
  ) =>
    new OpenApiRequestBuilder<
      {
        /**
         * @example "Cleanup completed"
         */
        message?: string;
      } & Record<string, any>
    >(
      'post',
      '/tabularArtifacts/cleanup',
      {
        body,
        headerParameters: { 'content-type': 'application/json' }
      },
      TabularArtifactAsyncSpecificationTabularArtifactsApi._defaultBasePath
    )
};
