/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type {
  GetPipelines,
  CreatePipeline,
  PipelineId,
  GetPipeline,
  GetPipelineStatus,
  GetPipelineExecutions,
  GetPipelineExecutionById,
  DocumentsStatusResponse,
  PipelineDocumentResponse
} from './schema/index.js';
/**
 * Representation of the 'PipelinesApi'.
 * This API is part of the 'api' service.
 */
export const PipelinesApi = {
  _defaultBasePath: '/lm/document-grounding',
  /**
   * Get all pipelines
   * @param queryParameters - Object containing the following keys: $top, $skip, $count.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  pipelineV1PipelineEndpointsGetAllPipeline: (
    queryParameters: { $top?: number; $skip?: number; $count?: boolean },
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<GetPipelines>(
      'get',
      '/pipelines',
      {
        queryParameters,
        headerParameters
      },
      PipelinesApi._defaultBasePath
    ),
  /**
   * Create a pipeline
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  pipelineV1PipelineEndpointsCreatePipeline: (
    body: CreatePipeline,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<PipelineId>(
      'post',
      '/pipelines',
      {
        body,
        headerParameters
      },
      PipelinesApi._defaultBasePath
    ),
  /**
   * Get details of a pipeline by pipeline id
   * @param pipelineId - The ID of the pipeline to get.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  pipelineV1PipelineEndpointsGetPipelineById: (
    pipelineId: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<GetPipeline>(
      'get',
      '/pipelines/{pipelineId}',
      {
        pathParameters: { pipelineId },
        headerParameters
      },
      PipelinesApi._defaultBasePath
    ),
  /**
   * Delete a pipeline by pipeline id
   * @param pipelineId - The ID of the pipeline to delete.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  pipelineV1PipelineEndpointsDeletePipelineById: (
    pipelineId: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<any>(
      'delete',
      '/pipelines/{pipelineId}',
      {
        pathParameters: { pipelineId },
        headerParameters
      },
      PipelinesApi._defaultBasePath
    ),
  /**
   * Get pipeline status by pipeline id
   * @param pipelineId - The ID of the pipeline to get status.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  pipelineV1PipelineEndpointsGetPipelineStatus: (
    pipelineId: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<GetPipelineStatus>(
      'get',
      '/pipelines/{pipelineId}/status',
      {
        pathParameters: { pipelineId },
        headerParameters
      },
      PipelinesApi._defaultBasePath
    ),
  /**
   * Retrieve all executions for a specific pipeline. Optionally, filter to get only the last execution.
   * @param pipelineId - The ID of the pipeline
   * @param queryParameters - Object containing the following keys: lastExecution, $top, $skip, $count.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  pipelineV1PipelineEndpointsGetPipelineExecutions: (
    pipelineId: string,
    queryParameters: {
      lastExecution?: boolean;
      $top?: number;
      $skip?: number;
      $count?: boolean;
    },
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<GetPipelineExecutions>(
      'get',
      '/pipelines/{pipelineId}/executions',
      {
        pathParameters: { pipelineId },
        queryParameters,
        headerParameters
      },
      PipelinesApi._defaultBasePath
    ),
  /**
   * Retrieve details of a specific pipeline execution by its execution ID.
   * @param pipelineId - The ID of the pipeline
   * @param executionId - The ID of the execution
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  pipelineV1PipelineEndpointsGetPipelineExecutionById: (
    pipelineId: string,
    executionId: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<GetPipelineExecutionById>(
      'get',
      '/pipelines/{pipelineId}/executions/{executionId}',
      {
        pathParameters: { pipelineId, executionId },
        headerParameters
      },
      PipelinesApi._defaultBasePath
    ),
  /**
   * Retrieve all documents associated with a specific pipeline execution. Optionally, filter the results using query parameters.
   * @param pipelineId - The ID of the pipeline
   * @param executionId - The ID of the execution
   * @param queryParameters - Object containing the following keys: $top, $skip, $count.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  pipelineV1PipelineEndpointsGetPipelineExecutionDocuments: (
    pipelineId: string,
    executionId: string,
    queryParameters: { $top?: number; $skip?: number; $count?: boolean },
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<DocumentsStatusResponse>(
      'get',
      '/pipelines/{pipelineId}/executions/{executionId}/documents',
      {
        pathParameters: { pipelineId, executionId },
        queryParameters,
        headerParameters
      },
      PipelinesApi._defaultBasePath
    ),
  /**
   * Retrieve details of a specific document associated with a pipeline execution.
   * @param pipelineId - The ID of the pipeline
   * @param executionId - The ID of the execution
   * @param documentId - The ID of the document to get.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  pipelineV1PipelineEndpointsGetPipelineExecutionDocumentById: (
    pipelineId: string,
    executionId: string,
    documentId: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<PipelineDocumentResponse>(
      'get',
      '/pipelines/{pipelineId}/executions/{executionId}/documents/{documentId}',
      {
        pathParameters: { pipelineId, executionId, documentId },
        headerParameters
      },
      PipelinesApi._defaultBasePath
    ),
  /**
   * Retrieve all documents associated with a specific pipeline. Optionally, filter the results using query parameters.
   * @param pipelineId - The ID of the pipeline to get.
   * @param queryParameters - Object containing the following keys: $top, $skip, $count.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  pipelineV1PipelineEndpointsGetPipelineDocuments: (
    pipelineId: string,
    queryParameters: { $top?: number; $skip?: number; $count?: boolean },
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<DocumentsStatusResponse>(
      'get',
      '/pipelines/{pipelineId}/documents',
      {
        pathParameters: { pipelineId },
        queryParameters,
        headerParameters
      },
      PipelinesApi._defaultBasePath
    ),
  /**
   * Retrieve details of a specific document associated with a pipeline.
   * @param pipelineId - The ID of the pipeline to get.
   * @param documentId - The ID of the document to get.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  pipelineV1PipelineEndpointsGetPipelineDocumentById: (
    pipelineId: string,
    documentId: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<PipelineDocumentResponse>(
      'get',
      '/pipelines/{pipelineId}/documents/{documentId}',
      {
        pathParameters: { pipelineId, documentId },
        headerParameters
      },
      PipelinesApi._defaultBasePath
    )
};
