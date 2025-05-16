/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { TntTenantInfo } from './schema/index.js';
/**
 * Representation of the 'TenantInfoApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export const TenantInfoApi = {
  _defaultBasePath: undefined,
  /**
   * Tenant information containing the service plan that the tenant is subscribed to.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  tenantInfoGet: () =>
    new OpenApiRequestBuilder<TntTenantInfo>(
      'get',
      '/admin/tenantInfo',
      {},
      TenantInfoApi._defaultBasePath
    )
};
