/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type {
  ListMetadataConfigurations,
  MetadataConfigurationRequest,
  MetadataConfigurationResponse,
  ListConfigurationDocuments,
  DocumentMetadataBatchRequest,
  BatchUpdateDocumentsResponse,
  ConfigurationDocument
} from './schema/index.js';
/**
 * Representation of the 'MetadataConfigurationsApi'.
 * This API is part of the 'api' service.
 */
export const MetadataConfigurationsApi = {
  _defaultBasePath: '/lm/document-grounding',
  /**
   * List all metadata configurations
   * @param queryParameters - Object containing the following keys: $top, $skip, $count.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  listMetadataConfigurations: (queryParameters?: {
    $top?: number;
    $skip?: number;
    $count?: boolean;
  }) =>
    new OpenApiRequestBuilder<ListMetadataConfigurations>(
      'get',
      '/pipelines/metadata/configurations',
      {
        queryParameters
      },
      MetadataConfigurationsApi._defaultBasePath
    ),
  /**
   * Creates a new metadata configuration.
   * @param body - Request body.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createMetadataConfiguration: (body: MetadataConfigurationRequest) =>
    new OpenApiRequestBuilder<any>(
      'post',
      '/pipelines/metadata/configurations',
      {
        body,
        headerParameters: { 'content-type': 'application/json' }
      },
      MetadataConfigurationsApi._defaultBasePath
    ),
  /**
   * Get the details of a configuration by ID
   * @param metadataConfigId - Metadata Configuration ID
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getMetadataConfigurationById: (metadataConfigId: string) =>
    new OpenApiRequestBuilder<MetadataConfigurationResponse>(
      'get',
      '/pipelines/metadata/configurations/{metadataConfigId}',
      {
        pathParameters: { metadataConfigId }
      },
      MetadataConfigurationsApi._defaultBasePath
    ),
  /**
   * Delete a metadata configuration by ID
   * @param metadataConfigId - Metadata Configuration ID
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  deleteMetadataConfigurationById: (metadataConfigId: string) =>
    new OpenApiRequestBuilder<any>(
      'delete',
      '/pipelines/metadata/configurations/{metadataConfigId}',
      {
        pathParameters: { metadataConfigId }
      },
      MetadataConfigurationsApi._defaultBasePath
    ),
  /**
   * List the documents for a configuration
   * @param metadataConfigId - Metadata Configuration ID
   * @param queryParameters - Object containing the following keys: absolutePath, $top, $skip, $count.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  listMetadataConfigurationDocuments: (
    metadataConfigId: string,
    queryParameters?: {
      absolutePath?: string;
      $top?: number;
      $skip?: number;
      $count?: boolean;
    }
  ) =>
    new OpenApiRequestBuilder<ListConfigurationDocuments>(
      'get',
      '/pipelines/metadata/configurations/{metadataConfigId}/documents',
      {
        pathParameters: { metadataConfigId },
        queryParameters
      },
      MetadataConfigurationsApi._defaultBasePath
    ),
  /**
   * Patch the documents of a configuration in batch
   * @param metadataConfigId - Metadata Configuration ID
   * @param body - Request body.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  batchUpdateDocumentsMetadata: (
    metadataConfigId: string,
    body: DocumentMetadataBatchRequest
  ) =>
    new OpenApiRequestBuilder<BatchUpdateDocumentsResponse>(
      'patch',
      '/pipelines/metadata/configurations/{metadataConfigId}/documents',
      {
        pathParameters: { metadataConfigId },
        body,
        headerParameters: { 'content-type': 'application/merge-patch+json' }
      },
      MetadataConfigurationsApi._defaultBasePath
    ),
  /**
   * Get the details of a document by document id
   * @param metadataConfigId - Metadata Configuration ID
   * @param documentId - Document ID
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getMetadataDocumentDetails: (metadataConfigId: string, documentId: string) =>
    new OpenApiRequestBuilder<ConfigurationDocument>(
      'get',
      '/pipelines/metadata/configurations/{metadataConfigId}/documents/{documentId}',
      {
        pathParameters: { metadataConfigId, documentId }
      },
      MetadataConfigurationsApi._defaultBasePath
    )
};
