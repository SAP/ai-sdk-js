/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type {
  DocumentResponse,
  Documents,
  DocumentCreateRequest,
  DocumentsListResponse,
  DocumentUpdateRequest
} from './schema/index.js';
/**
 * Representation of the 'DocumentsApi'.
 * This API is part of the 'api' service.
 */
export const DocumentsApi = {
  /**
   * Gets a specific document in a collection by ID.
   * @param collectionId - Path parameter.
   * @param documentId - Path parameter.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  vectorV1VectorEndpointsGetDocumentById: (
    collectionId: string,
    documentId: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<DocumentResponse>(
      'get',
      '/lm/document-grounding/vector/collections/{collectionId}/documents/{documentId}',
      {
        pathParameters: { collectionId, documentId },
        headerParameters
      }
    ),
  /**
   * Deletes a specific document of a collection.
   * @param collectionId - Path parameter.
   * @param documentId - Path parameter.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  vectorV1VectorEndpointsDeleteDocument: (
    collectionId: string,
    documentId: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<any>(
      'delete',
      '/lm/document-grounding/vector/collections/{collectionId}/documents/{documentId}',
      {
        pathParameters: { collectionId, documentId },
        headerParameters
      }
    ),
  /**
   * Gets a list of documents of a collection.
   * @param collectionId - Path parameter.
   * @param queryParameters - Object containing the following keys: $top, $skip, $count.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  vectorV1VectorEndpointsGetAllDocuments: (
    collectionId: string,
    queryParameters: { $top?: number; $skip?: number; $count?: boolean },
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<Documents>(
      'get',
      '/lm/document-grounding/vector/collections/{collectionId}/documents',
      {
        pathParameters: { collectionId },
        queryParameters,
        headerParameters
      }
    ),
  /**
   * Create and stores one or multiple documents into a collection. If omitted, 'id' will be auto-generated.
   * @param collectionId - Path parameter.
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  vectorV1VectorEndpointsCreateDocuments: (
    collectionId: string,
    body: DocumentCreateRequest,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<DocumentsListResponse>(
      'post',
      '/lm/document-grounding/vector/collections/{collectionId}/documents',
      {
        pathParameters: { collectionId },
        body,
        headerParameters
      }
    ),
  /**
   * Upserts the data of multiple documents into a collection.
   * @param collectionId - Path parameter.
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  vectorV1VectorEndpointsUpdateDocuments: (
    collectionId: string,
    body: DocumentUpdateRequest,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<DocumentsListResponse>(
      'patch',
      '/lm/document-grounding/vector/collections/{collectionId}/documents',
      {
        pathParameters: { collectionId },
        body,
        headerParameters
      }
    )
};
