/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type {
  CollectionsListResponse,
  CollectionRequest,
  Collection,
  CollectionCreatedResponse,
  CollectionPendingResponse,
  CollectionDeletedResponse
} from './schema/index.js';
/**
 * Representation of the 'CollectionsApi'.
 * This API is part of the 'vector-api' service.
 */
export const CollectionsApi = {
  //Todo: Remove the explicitly added path parameter from the request builder
  /**
   * Gets a list of collections.
   * @param queryParameters - Object containing the following keys: $top, $skip, $count.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  vectorV1VectorEndpointsGetAllCollections: (
    queryParameters: { $top?: number; $skip?: number; $count?: boolean },
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<CollectionsListResponse>(
      'get',
      '/lm/document-grounding/vector/collections',
      {
        queryParameters,
        headerParameters
      }
    ),
  /**
   * Creates a collection. This operation is asynchronous. Poll the collection resource and check the status field to understand creation status.
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  vectorV1VectorEndpointsCreateCollection: (
    body: CollectionRequest,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<any>(
      'post',
      '/lm/document-grounding/vector/collections',
      {
        body,
        headerParameters
      }
    ),
  /**
   * Gets a specific collection by ID.
   * @param collectionId - Path parameter.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  vectorV1VectorEndpointsGetCollectionById: (
    collectionId: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<Collection>(
      'get',
      '/lm/document-grounding/vector/collections/{collectionId}',
      {
        pathParameters: { collectionId },
        headerParameters
      }
    ),
  /**
   * Deletes a specific collection by ID. This operation is asynchronous. Poll the collection for a 404 status code.
   * @param collectionId - Path parameter.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  vectorV1VectorEndpointsDeleteCollection: (
    collectionId: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<any>(
      'delete',
      '/lm/document-grounding/vector/collections/{collectionId}',
      {
        pathParameters: { collectionId },
        headerParameters
      }
    ),
  /**
   * Gets a specific collection status from monitor by ID.
   * @param id - Path parameter.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  vectorV1VectorEndpointsGetCollectionCreationStatus: (
    id: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<
      CollectionCreatedResponse | CollectionPendingResponse
    >('get', '/lm/document-grounding/vector/collections/{id}/creationStatus', {
      pathParameters: { id },
      headerParameters
    }),
  /**
   * Gets a specific collection status from monitor by ID.
   * @param id - Path parameter.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  vectorV1VectorEndpointsGetCollectionDeletionStatus: (
    id: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<
      CollectionDeletedResponse | CollectionPendingResponse
    >('get', '/lm/document-grounding/vector/collections/{id}/deletionStatus', {
      pathParameters: { id },
      headerParameters
    })
};
