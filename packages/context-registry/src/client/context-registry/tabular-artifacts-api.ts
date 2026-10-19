/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';

import type {
  TabularArtifactListResponse,
  TabularArtifactDetails,
  CreateTARequest,
  TabularArtifactDataPreview
} from './schema/index.js';
/**
 * Representation of the 'TabularArtifactsApi'.
 * This API is part of the 'context-registry' service.
 */
export const TabularArtifactsApi = {
  _defaultBasePath: '/tcr',
  /**
   * Retrieve list of Tabular Artifacts with pagination
   * @param queryParameters - Object containing the following keys: $top, $skip, $count.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAllTabularArtifacts: (
    queryParameters: { $top?: number; $skip?: number; $count?: boolean },
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<TabularArtifactListResponse>(
      'get',
      '/tabularArtifacts',
      {
        headerParameters,
        queryParameters
      },
      TabularArtifactsApi._defaultBasePath
    ),
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
    new OpenApiRequestBuilder<TabularArtifactDetails>(
      'get',
      '/tabularArtifacts/{tabularArtifactName}',
      {
        pathParameters: { tabularArtifactName },
        headerParameters
      },
      TabularArtifactsApi._defaultBasePath
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
    body: CreateTARequest,
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
      TabularArtifactsApi._defaultBasePath
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
      TabularArtifactsApi._defaultBasePath
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
    new OpenApiRequestBuilder<TabularArtifactDataPreview>(
      'get',
      '/tabularArtifacts/{tabularArtifactName}/data',
      {
        pathParameters: { tabularArtifactName },
        headerParameters
      },
      TabularArtifactsApi._defaultBasePath
    )
};
