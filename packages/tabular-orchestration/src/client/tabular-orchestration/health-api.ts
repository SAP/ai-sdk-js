/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { HealthResponse } from './schema/index.js';
/**
 * Representation of the 'HealthApi'.
 * This API is part of the 'tabular-orchestration' service.
 */
export const HealthApi = {
  _defaultBasePath: undefined,
  /**
   * If this application is up and running, health_check has passed.
   * No need to check for dependencies because each dependencies also has their own health_check
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  healthCheckV1HealthGet: () =>
    new OpenApiRequestBuilder<HealthResponse>(
      'get',
      '/v1/health',
      {},
      HealthApi._defaultBasePath
    )
};
