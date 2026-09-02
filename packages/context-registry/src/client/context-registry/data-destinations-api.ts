/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';

import type {
  GetDataDestinations,
  Labels,
  ValidateDataDestinationRequest,
  ValidateDataDestinationResponse,
  GetDataDestination,
  CreateDataDestination,
  AsyncCreateDataDestinationResponse,
  PatchDataDestination
} from './schema/index.js';
/**
 * Representation of the 'DataDestinationsApi'.
 * This API is part of the 'context-registry' service.
 */
export const DataDestinationsApi = {
  _defaultBasePath: '/tcr',
  /**
   * Get all data destinations in the tenant (resource group)
   * @param queryParameters - Object containing the following keys: $top, $skip, $count.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAllDataDestinations: (
    queryParameters: { $top?: number; $skip?: number; $count?: boolean },
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<GetDataDestinations>(
      'get',
      '/dataDestinations',
      {
        headerParameters,
        queryParameters
      },
      DataDestinationsApi._defaultBasePath
    ),
  /**
   * Search data destinations by label key-value pairs
   * @param body - Request body.
   * @param queryParameters - Object containing the following keys: $top, $skip, $count.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  searchDestinations: (
    body: {
      labels: Labels;
    } & Record<string, any>,
    queryParameters: { $top?: number; $skip?: number; $count?: boolean },
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<GetDataDestinations>(
      'post',
      '/dataDestinations/search',
      {
        body,
        headerParameters: {
          'content-type': 'application/json',
          ...headerParameters
        },
        queryParameters
      },
      DataDestinationsApi._defaultBasePath
    ),
  /**
   * Test provider connectivity before saving. Nothing is persisted.
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  validateDataDestination: (
    body: ValidateDataDestinationRequest,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<ValidateDataDestinationResponse>(
      'post',
      '/dataDestinations/validate',
      {
        body,
        headerParameters: {
          'content-type': 'application/json',
          ...headerParameters
        }
      },
      DataDestinationsApi._defaultBasePath
    ),
  /**
   * Get metadata of a specific data destination (excluding credentials)
   * @param dataDestinationName - The ID of the data destination to get
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getDataDestinationByName: (
    dataDestinationName: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<GetDataDestination>(
      'get',
      '/dataDestinations/{dataDestinationName}',
      {
        pathParameters: { dataDestinationName },
        headerParameters
      },
      DataDestinationsApi._defaultBasePath
    ),
  /**
   * Create a data destination asynchronously. Schema validation happens synchronously; credential validation and secret storage run in a background task. Poll GET /dataDestinations/{name} to track progress via status and errorMessage. Returns 202 (not exists or ERROR retry), 409 (ACTIVE or DELETING), 422 (retry exhausted).
   *
   * @param dataDestinationName - Unique identifier for the data destination
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createUpdateDataDestination: (
    dataDestinationName: string,
    body: CreateDataDestination,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<AsyncCreateDataDestinationResponse>(
      'put',
      '/dataDestinations/{dataDestinationName}',
      {
        pathParameters: { dataDestinationName },
        body,
        headerParameters: {
          'content-type': 'application/json',
          ...headerParameters
        }
      },
      DataDestinationsApi._defaultBasePath
    ),
  /**
   * Update a data destination (excluding name and type)
   * @param dataDestinationName - The ID of the data destination to update
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  patchDataDestinationByName: (
    dataDestinationName: string,
    body: PatchDataDestination,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<any>(
      'patch',
      '/dataDestinations/{dataDestinationName}',
      {
        pathParameters: { dataDestinationName },
        body,
        headerParameters: {
          'content-type': 'application/json',
          ...headerParameters
        }
      },
      DataDestinationsApi._defaultBasePath
    ),
  /**
   * Mark the data destination for deletion. Synchronously checks for dependent TabularArtifacts; returns 202 immediately after marking DELETING. The cron reaper handles secret deletion and hard delete.
   *
   * @param dataDestinationName - The ID of the data destination to delete
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  deleteDataDestinationByName: (
    dataDestinationName: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<any>(
      'delete',
      '/dataDestinations/{dataDestinationName}',
      {
        pathParameters: { dataDestinationName },
        headerParameters
      },
      DataDestinationsApi._defaultBasePath
    ),
  /**
   * Re-verify an already-saved destination using stored credentials.
   * @param dataDestinationName - The name of the data destination to validate
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  validateDataDestinationByName: (
    dataDestinationName: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<ValidateDataDestinationResponse>(
      'post',
      '/dataDestinations/{dataDestinationName}/validate',
      {
        pathParameters: { dataDestinationName },
        headerParameters
      },
      DataDestinationsApi._defaultBasePath
    )
};
