/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { TextSearchRequest, SearchResults } from './schema/index.js';
/**
 * Representation of the 'SearchApi'.
 * This API is part of the 'vector-api' service.
 */
export const SearchApi = {
  /**
   * Create a request builder for execution of post requests to the '/search' endpoint.
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  vectorV1VectorEndpointsSearchChunk: (
    body: TextSearchRequest,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<SearchResults>('post', '/search', {
      body,
      headerParameters
    })
};
