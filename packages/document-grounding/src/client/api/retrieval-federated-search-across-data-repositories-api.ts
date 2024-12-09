/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { RetrievalSearchInput, SearchResults } from './schema/index.js';
/**
 * Representation of the 'RetrievalFederatedSearchAcrossDataRepositoriesApi'.
 * This API is part of the 'api' service.
 */
export const RetrievalFederatedSearchAcrossDataRepositoriesApi = {
  /**
   * Retrieve relevant content given a query string.
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  retrievalV1RetrievalEndpointsSearchDataRepositories: (
    body: RetrievalSearchInput,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<SearchResults>(
      'post',
      '/lm/document-grounding/retrieval/search',
      {
        body,
        headerParameters
      }
    )
};
