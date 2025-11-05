/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-cloud-sdk/openapi';
import type {
  EmbeddingsPostRequest,
  EmbeddingsPostResponse
} from './schema/index.js';
/**
 * Representation of the 'OrchestrationEmbeddingsApi'.
 * This API is part of the 'api' service.
 */
export const OrchestrationEmbeddingsApi = {
  _defaultBasePath: undefined,
  /**
   * Generate embeddings for input strings.
   *
   * @param body - Request body.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  orchestrationV2EndpointsCreateEmbeddings: (body: EmbeddingsPostRequest) =>
    new OpenApiRequestBuilder<EmbeddingsPostResponse>(
      'post',
      '/embeddings',
      {
        body
      },
      OrchestrationEmbeddingsApi._defaultBasePath
    )
};
