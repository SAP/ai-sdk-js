/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
/**
 * Representation of the 'HealthSpecificationOtherApi'.
 * This API is part of the 'context-registry' service.
 */
export const HealthSpecificationOtherApi = {
  _defaultBasePath: '/admin/tcr',
  /**
   * Create a request builder for execution of get requests to the '/api/v1/healthz' endpoint.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  healthEndpointsHealthz: () =>
    new OpenApiRequestBuilder<string>(
      'get',
      '/api/v1/healthz',
      {},
      HealthSpecificationOtherApi._defaultBasePath
    )
};
