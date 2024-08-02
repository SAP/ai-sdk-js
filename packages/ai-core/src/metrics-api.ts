/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-cloud-sdk/openapi';
import type {
  TrckGetMetricResourceList,
  TrckStringArray,
  TrckmetricSelectorPermissibleValues,
  TrckMetricResource,
  TrckDeleteMetricsResponse,
  TrckExecutionId
} from './schema';
/**
 * Representation of the 'MetricsApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export const MetricsApi = {
  /**
   * Retrieve metrics, labels, or tags according to filter conditions.
   * One query parameter is mandatory, either execution ID or filter.
   * Use up to 10 execution IDs in a query parameter.
   *
   * @param queryParameters - Object containing the following keys: $filter, executionIds, $select.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  metricsFind: (
    queryParameters: {
      $filter?: string;
      executionIds?: TrckStringArray;
      $select?: TrckmetricSelectorPermissibleValues;
    },
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<TrckGetMetricResourceList>('get', '/lm/metrics', {
      queryParameters,
      headerParameters
    }),
  /**
   * Update or create metrics, tags, or labels associated with an execution.
   *
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  metricsPatch: (
    body: TrckMetricResource,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<any>('patch', '/lm/metrics', {
      body,
      headerParameters
    }),
  /**
   * Delete metrics, tags, or labels associated with an execution.
   * @param queryParameters - Object containing the following keys: executionId.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  metricsDelete: (
    queryParameters: { executionId: TrckExecutionId },
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<TrckDeleteMetricsResponse>(
      'delete',
      '/lm/metrics',
      {
        queryParameters,
        headerParameters
      }
    )
};
