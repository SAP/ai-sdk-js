/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';

import type { Request, Response } from './schema/index.js';
/**
 * Representation of the 'DefaultApi'.
 * This API is part of the 'rpt-decisions' service.
 * @internal
 */
export const DefaultApi = {
  _defaultBasePath: undefined,
  /**
   * Create a request builder for execution of post requests to the "/systemone" endpoint.
   * @param body - Request body.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  systemone: (body: Request) =>
    new OpenApiRequestBuilder<Response>(
      'post',
      '/systemone',
      {
        body,
        headerParameters: { 'content-type': 'application/json' }
      },
      DefaultApi._defaultBasePath
    )
};
