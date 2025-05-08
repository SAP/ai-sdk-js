/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { Count, AgentControllerServiceAiModels } from './schema/index.js';
/**
 * Representation of the 'AiModelsApi'.
 * This API is part of the 'pab' service.
 */
export const AiModelsApi = {
  _defaultBasePath: undefined,
  /**
   * Create a request builder for execution of get requests to the '/AiModels' endpoint.
   * @param queryParameters - Object containing the following keys: $top, $skip, $search, $filter, $count, $orderby, $select.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAiModels: (queryParameters?: {
    $top?: number;
    $skip?: number;
    $search?: string;
    $filter?: string;
    $count?: boolean;
    $orderby?: Set<
      | 'modelId'
      | 'modelId desc'
      | 'modelName'
      | 'modelName desc'
      | 'providerId'
      | 'providerId desc'
      | 'providerName'
      | 'providerName desc'
      | 'rank'
      | 'rank desc'
    >;
    $select?: Set<
      'modelId' | 'modelName' | 'providerId' | 'providerName' | 'rank'
    >;
  }) =>
    new OpenApiRequestBuilder<
      {
        '@count'?: Count;
        value?: AgentControllerServiceAiModels[];
      } & Record<string, any>
    >(
      'get',
      '/AiModels',
      {
        queryParameters
      },
      AiModelsApi._defaultBasePath
    ),
  /**
   * Create a request builder for execution of get requests to the '/AiModels('{modelId}')' endpoint.
   * @param modelId - key: modelId
   * @param queryParameters - Object containing the following keys: $select.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  getAiModelsModelId: (
    modelId: string,
    queryParameters?: {
      $select?: Set<
        'modelId' | 'modelName' | 'providerId' | 'providerName' | 'rank'
      >;
    }
  ) =>
    new OpenApiRequestBuilder<AgentControllerServiceAiModels>(
      'get',
      "/AiModels('{modelId}')",
      {
        pathParameters: { modelId },
        queryParameters
      },
      AiModelsApi._defaultBasePath
    )
};
