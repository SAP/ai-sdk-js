/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type {
  CollectionsListResponse,
  CollectionRequest,
  Collection,
  DocumentResponse,
  Documents,
  DocumentCreateRequest,
  DocumentsListResponse,
  DocumentUpdateRequest,
  TextSearchRequest,
  SearchResults,
  CollectionCreatedResponse,
  CollectionPendingResponse,
  CollectionDeletedResponse
} from './schema/index.js';
/**
 * Representation of the 'VectorApi'.
 * This API is part of the 'api' service.
 */
export const VectorApi = {
  _defaultBasePath: '/lm/document-grounding',
  /**
   * Gets a list of collections.
   * @param queryParameters - Object containing the following keys: $top, $skip, $count.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAllCollections: (
    queryParameters: { $top?: number; $skip?: number; $count?: boolean },
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<CollectionsListResponse>(
      'get',
      '/vector/collections',
      {
        queryParameters,
        headerParameters
      },
      VectorApi._defaultBasePath
    ),
  /**
   * Creates a collection. This operation is asynchronous. Poll the collection resource and check the status field to understand creation status.
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createCollection: (
    body: CollectionRequest,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<any>(
      'post',
      '/vector/collections',
      {
        body,
        headerParameters
      },
      VectorApi._defaultBasePath
    ),
  /**
   * Gets a specific collection by ID.
   * @param collectionId - Path parameter.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getCollectionById: (
    collectionId: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<Collection>(
      'get',
      '/vector/collections/{collectionId}',
      {
        pathParameters: { collectionId },
        headerParameters
      },
      VectorApi._defaultBasePath
    ),
  /**
   * Deletes a specific collection by ID. This operation is asynchronous. Poll the collection for a 404 status code.
   * @param collectionId - Path parameter.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  deleteCollectionById: (
    collectionId: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<any>(
      'delete',
      '/vector/collections/{collectionId}',
      {
        pathParameters: { collectionId },
        headerParameters
      },
      VectorApi._defaultBasePath
    ),
  /**
   * Gets a specific document in a collection by ID.
   * @param collectionId - Path parameter.
   * @param documentId - Path parameter.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getDocumentById: (
    collectionId: string,
    documentId: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<DocumentResponse>(
      'get',
      '/vector/collections/{collectionId}/documents/{documentId}',
      {
        pathParameters: { collectionId, documentId },
        headerParameters
      },
      VectorApi._defaultBasePath
    ),
  /**
   * Deletes a specific document of a collection.
   * @param collectionId - Path parameter.
   * @param documentId - Path parameter.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  deleteDocumentById: (
    collectionId: string,
    documentId: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<any>(
      'delete',
      '/vector/collections/{collectionId}/documents/{documentId}',
      {
        pathParameters: { collectionId, documentId },
        headerParameters
      },
      VectorApi._defaultBasePath
    ),
  /**
   * Gets a list of documents of a collection.
   * @param collectionId - Path parameter.
   * @param queryParameters - Object containing the following keys: $top, $skip, $count.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAllDocuments: (
    collectionId: string,
    queryParameters: { $top?: number; $skip?: number; $count?: boolean },
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<Documents>(
      'get',
      '/vector/collections/{collectionId}/documents',
      {
        pathParameters: { collectionId },
        queryParameters,
        headerParameters
      },
      VectorApi._defaultBasePath
    ),
  /**
   * Create and stores one or multiple documents into a collection. If omitted, 'id' will be auto-generated.
   * @param collectionId - Path parameter.
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createDocuments: (
    collectionId: string,
    body: DocumentCreateRequest,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<DocumentsListResponse>(
      'post',
      '/vector/collections/{collectionId}/documents',
      {
        pathParameters: { collectionId },
        body,
        headerParameters
      },
      VectorApi._defaultBasePath
    ),
  /**
   * Upserts the data of multiple documents into a collection.
   * @param collectionId - Path parameter.
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  updateDocuments: (
    collectionId: string,
    body: DocumentUpdateRequest,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<DocumentsListResponse>(
      'patch',
      '/vector/collections/{collectionId}/documents',
      {
        pathParameters: { collectionId },
        body,
        headerParameters
      },
      VectorApi._defaultBasePath
    ),
  /**
   * Search chunk by vector
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  search: (
    body: TextSearchRequest,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<SearchResults>(
      'post',
      '/vector/search',
      {
        body,
        headerParameters
      },
      VectorApi._defaultBasePath
    ),
  /**
   * Gets a specific collection status from monitor by ID.
   * @param id - Path parameter.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getCollectionCreationStatus: (
    id: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<
      CollectionCreatedResponse | CollectionPendingResponse
    >(
      'get',
      '/vector/collections/{id}/creationStatus',
      {
        pathParameters: { id },
        headerParameters
      },
      VectorApi._defaultBasePath
    ),
  /**
   * Gets a specific collection status from monitor by ID.
   * @param id - Path parameter.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getCollectionDeletionStatus: (
    id: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<
      CollectionDeletedResponse | CollectionPendingResponse
    >(
      'get',
      '/vector/collections/{id}/deletionStatus',
      {
        pathParameters: { id },
        headerParameters
      },
      VectorApi._defaultBasePath
    )
};
