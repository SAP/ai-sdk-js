/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';

import type {
  DataDestinationAsyncGetDataDestinations,
  DataDestinationAsyncGetDataDestination,
  DataDestinationAsyncCreateDataDestination,
  DataDestinationAsyncAsyncCreateDataDestinationResponse,
  DataDestinationCommonPatchDataDestination,
  DataDestinationCommonLabels,
  DataDestinationCommonValidateDataDestinationRequest,
  DataDestinationAsyncValidateDataDestinationResponse
} from './schema/index.js';
/**
 * Representation of the 'DataDestinationAsyncSpecificationDataDestinationsApi'.
 * This API is part of the 'ctx-registry' service.
 */
export const DataDestinationAsyncSpecificationDataDestinationsApi = {
  _defaultBasePath: '/admin/tcr',
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
    new OpenApiRequestBuilder<DataDestinationAsyncGetDataDestinations>(
      'get',
      '/dataDestinations',
      {
        headerParameters,
        queryParameters
      },
      DataDestinationAsyncSpecificationDataDestinationsApi._defaultBasePath
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
    new OpenApiRequestBuilder<DataDestinationAsyncGetDataDestination>(
      'get',
      '/dataDestinations/{dataDestinationName}',
      {
        pathParameters: { dataDestinationName },
        headerParameters
      },
      DataDestinationAsyncSpecificationDataDestinationsApi._defaultBasePath
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
    body: DataDestinationAsyncCreateDataDestination,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<DataDestinationAsyncAsyncCreateDataDestinationResponse>(
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
      DataDestinationAsyncSpecificationDataDestinationsApi._defaultBasePath
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
    body: DataDestinationCommonPatchDataDestination,
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
      DataDestinationAsyncSpecificationDataDestinationsApi._defaultBasePath
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
      DataDestinationAsyncSpecificationDataDestinationsApi._defaultBasePath
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
      labels: DataDestinationCommonLabels;
    } & Record<string, any>,
    queryParameters: { $top?: number; $skip?: number; $count?: boolean },
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<DataDestinationAsyncGetDataDestinations>(
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
      DataDestinationAsyncSpecificationDataDestinationsApi._defaultBasePath
    ),
  /**
   * Test provider connectivity before saving. Nothing is persisted.
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  validateDataDestination: (
    body: DataDestinationCommonValidateDataDestinationRequest,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<DataDestinationAsyncValidateDataDestinationResponse>(
      'post',
      '/dataDestinations/validate',
      {
        body,
        headerParameters: {
          'content-type': 'application/json',
          ...headerParameters
        }
      },
      DataDestinationAsyncSpecificationDataDestinationsApi._defaultBasePath
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
    new OpenApiRequestBuilder<DataDestinationAsyncValidateDataDestinationResponse>(
      'post',
      '/dataDestinations/{dataDestinationName}/validate',
      {
        pathParameters: { dataDestinationName },
        headerParameters
      },
      DataDestinationAsyncSpecificationDataDestinationsApi._defaultBasePath
    ),
  /**
   * Internal endpoint to immediately trigger the cleanup cycle for stuck Data Destinations (old PROCESSING, old DELETING) beyond the threshold. If an optional list of names is provided, only those specific Data Destinations are cleaned up. Otherwise all stuck DDs are processed. Deletes config secrets and hard-deletes metadata rows.
   *
   * @param body - Request body.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  controllersDataDestinationV1EndpointsTriggerDdCleanup: (
    body:
      | {
          /**
           * Optional list of Data Destination names to clean up. When provided, only these specific names are processed. When omitted or empty array, all stuck Data Destinations are cleaned up.
           *
           * @example [
           *   "my-s3-dd",
           *   "my-gcs-dd"
           * ]
           */
          names?: string[];
        }
      | undefined
  ) =>
    new OpenApiRequestBuilder<
      {
        /**
         * Human-readable cleanup result
         * @example "3 Data Destinations deleted successfully"
         */
        message: string;
      } & Record<string, any>
    >(
      'post',
      '/dataDestinations/cleanup',
      {
        body,
        headerParameters: { 'content-type': 'application/json' }
      },
      DataDestinationAsyncSpecificationDataDestinationsApi._defaultBasePath
    )
};
