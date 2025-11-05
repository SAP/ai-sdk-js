/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-cloud-sdk/openapi';
import type {
  CompletionPostRequest,
  CompletionPostResponse
} from './schema/index.js';
/**
 * Representation of the 'OrchestrationCompletionApi'.
 * This API is part of the 'api' service.
 */
export const OrchestrationCompletionApi = {
  _defaultBasePath: undefined,
  /**
   * Run an orchestrated completion inference request
   * @param body - Request body.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  orchestrationV2EndpointsCreate: (body: CompletionPostRequest) =>
    new OpenApiRequestBuilder<CompletionPostResponse | any>(
      'post',
      '/completion',
      {
        body
      },
      OrchestrationCompletionApi._defaultBasePath
    )
};
