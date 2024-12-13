/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { TextSearchRequest, SearchResults } from './schema/index.js';
/**
 * Representation of the 'SearchApi'.
 * This API is part of the 'api' service.
 */
export const SearchApi = {
  _defaultBasePath: '/lm/document-grounding',
  /**
   * Search chunk by vector
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: AI-Resource-Group.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  vectorV1VectorEndpointsSearchChunk: (
    body: TextSearchRequest,
    headerParameters: { 'AI-Resource-Group': string }
  ) =>
    new OpenApiRequestBuilder<SearchResults>(
      'post',
      '/vector/search',
      {
        body,
        headerParameters
      },
      SearchApi._defaultBasePath
    )
};
