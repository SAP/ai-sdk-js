/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
/**
 * Representation of the 'DataDestinationAsyncSpecificationOtherApi'.
 * This API is part of the 'ctx-registry' service.
 */
export const DataDestinationAsyncSpecificationOtherApi = {
  _defaultBasePath: '/v2/admin/tcr',
  /**
   * Create a request builder for execution of get requests to the '/health' endpoint.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  healthEndpointsGetContextRegistryHealth: () =>
    new OpenApiRequestBuilder<string>(
      'get',
      '/health',
      {},
      DataDestinationAsyncSpecificationOtherApi._defaultBasePath
    )
};
