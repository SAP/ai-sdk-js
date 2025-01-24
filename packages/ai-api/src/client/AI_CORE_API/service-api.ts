/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { BckndServiceList, BckndExtendedService } from './schema/index.js';
/**
 * Representation of the 'ServiceApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export const ServiceApi = {
  _defaultBasePath: undefined,
  /**
   * Retrieve a list of services for a given main tenant.
   *
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4AiservicesGetAll: (headerParameters?: {
    Authorization?: string;
  }) =>
    new OpenApiRequestBuilder<BckndServiceList>(
      'get',
      '/admin/services',
      {
        headerParameters
      },
      ServiceApi._defaultBasePath
    ),
  /**
   * Get an service of a given main tenant.
   *
   * @param serviceName - Name of the Service
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4AiservicesGet: (
    serviceName: string,
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<BckndExtendedService>(
      'get',
      '/admin/services/{serviceName}',
      {
        pathParameters: { serviceName },
        headerParameters
      },
      ServiceApi._defaultBasePath
    )
};
