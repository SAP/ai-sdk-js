/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
/**
 * Representation of the 'HealthApi'.
 * This API is part of the 'prompt-registry' service.
 */
export const HealthApi = {
  _defaultBasePath: undefined,
  /**
   * Health check endpoint
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  healthz: () =>
    new OpenApiRequestBuilder<string>(
      'get',
      '/healthz',
      {},
      HealthApi._defaultBasePath
    )
};
