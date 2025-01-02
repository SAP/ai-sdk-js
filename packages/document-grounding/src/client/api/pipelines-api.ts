/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type {
  Pipelines,
  PipelinePostRequst,
  PipelineId,
  Pipeline,
  PipelineStatus
} from './schema/index.js';
/**
 * Representation of the 'PipelinesApi'.
 * This API is part of the 'api' service.
 */
export const PipelinesApi = {
  /**
   * Get all pipelines
   * @param queryParameters - Object containing the following keys: $top, $skip, $count.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAllPipelines: (
    queryParameters: { $top?: number; $skip?: number; $count?: boolean },
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<Pipelines>(
      'get',
      '/lm/document-grounding/pipelines',
      {
        queryParameters,
        headerParameters
      }
    ),
  /**
   * Create a pipeline
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createPipeline: (
    body: PipelinePostRequst,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<PipelineId>(
      'post',
      '/lm/document-grounding/pipelines',
      {
        body,
        headerParameters
      }
    ),
  /**
   * Get details of a pipeline by pipeline id
   * @param pipelineId - The ID of the pipeline to get.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getPipelineById: (
    pipelineId: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<Pipeline>(
      'get',
      '/lm/document-grounding/pipelines/{pipelineId}',
      {
        pathParameters: { pipelineId },
        headerParameters
      }
    ),
  /**
   * Delete a pipeline by pipeline id
   * @param pipelineId - The ID of the pipeline to delete.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  deletePipelineById: (
    pipelineId: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<any>(
      'delete',
      '/lm/document-grounding/pipelines/{pipelineId}',
      {
        pathParameters: { pipelineId },
        headerParameters
      }
    ),
  /**
   * Get pipeline status by pipeline id
   * @param pipelineId - The ID of the pipeline to get status.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getPipelineStatus: (
    pipelineId: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<PipelineStatus>(
      'get',
      '/lm/document-grounding/pipelines/{pipelineId}/status',
      {
        pathParameters: { pipelineId },
        headerParameters
      }
    )
};
