/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { DataRepositories, DataRepository } from './schema/index.js';
/**
 * Representation of the 'RetrievalDataRepositoryApi'.
 * This API is part of the 'retrieval-api' service.
 */
export const RetrievalDataRepositoryApi = {
  /**
   * Create a request builder for execution of get requests to the '/dataRepositories' endpoint.
   * @param queryParameters - Object containing the following keys: $top, $skip, $count.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  retrievalV1RetrievalEndpointsGetDataRepositories: (
    queryParameters: { $top?: number; $skip?: number; $count?: boolean },
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<DataRepositories>('get', '/dataRepositories', {
      queryParameters,
      headerParameters
    }),
  /**
   * Create a request builder for execution of get requests to the '/dataRepositories/{repositoryId}' endpoint.
   * @param repositoryId - Path parameter.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  retrievalV1RetrievalEndpointsGetDataRepository: (
    repositoryId: string,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<DataRepository>(
      'get',
      '/dataRepositories/{repositoryId}',
      {
        pathParameters: { repositoryId },
        headerParameters
      }
    )
};
