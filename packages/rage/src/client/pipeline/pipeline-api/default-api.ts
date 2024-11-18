/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type {
  GetPipelines,
  CreatePipeline,
  PipelineId,
  GetPipeline,
  GetPipelineStatus
} from './schema/index.js';
/**
 * Representation of the 'DefaultApi'.
 * This API is part of the 'pipeline-api' service.
 */
export const DefaultApi = {
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
    new OpenApiRequestBuilder<GetPipelines>('get', '/pipelines', {
      queryParameters,
      headerParameters
    }),
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
    new OpenApiRequestBuilder<PipelineId>('post', '/pipelines', {
      body,
      headerParameters
    }),
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
    new OpenApiRequestBuilder<GetPipeline>('get', '/pipelines/{pipelineId}', {
      pathParameters: { pipelineId },
      headerParameters
    }),
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
    new OpenApiRequestBuilder<any>('delete', '/pipelines/{pipelineId}', {
      pathParameters: { pipelineId },
      headerParameters
    }),
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
      }
    )
};
