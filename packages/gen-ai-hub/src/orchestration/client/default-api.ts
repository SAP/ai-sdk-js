/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-cloud-sdk/openapi';
import type {
  CompletionPostRequest,
  CompletionPostResponse
} from './schema/index.js';
/**
 * Representation of the 'DefaultApi'.
 * This API is part of the 'client' service.
 */
export const DefaultApi = {
  /**
   * Create a request builder for execution of post requests to the '/completion' endpoint.
   * @param body - Request body.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  orchestrationV1EndpointsCreate: (body: CompletionPostRequest) =>
    new OpenApiRequestBuilder<CompletionPostResponse>('post', '/completion', {
      body
    }),
  /**
   * Create a request builder for execution of get requests to the '/healthz' endpoint.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  orchestrationV1EndpointsHealthz: () =>
    new OpenApiRequestBuilder<any>('get', '/healthz')
};
