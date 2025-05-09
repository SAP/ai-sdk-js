/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { AgentControllerServicereturnAgentControllerServiceTest } from './schema/index.js';
/**
 * Representation of the 'ServiceOperationsApi'.
 * This API is part of the 'pab' service.
 */
export const ServiceOperationsApi = {
  _defaultBasePath: undefined,
  /**
   * Create a request builder for execution of post requests to the '/test' endpoint.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  createTest: () =>
    new OpenApiRequestBuilder<AgentControllerServicereturnAgentControllerServiceTest>(
      'post',
      '/test',
      {},
      ServiceOperationsApi._defaultBasePath
    )
};
