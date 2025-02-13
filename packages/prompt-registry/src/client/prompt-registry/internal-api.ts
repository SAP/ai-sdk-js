/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { ProvisioningResponse } from './schema/index.js';
/**
 * Representation of the 'InternalApi'.
 * This API is part of the 'prompt-registry' service.
 */
export const InternalApi = {
  _defaultBasePath: undefined,
  /**
   * Onboard a tenant
   * @param headerParameters - Object containing the following keys: AI-Main-Tenant.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  onboardTenant: (headerParameters: { 'AI-Main-Tenant': string }) =>
    new OpenApiRequestBuilder<ProvisioningResponse>(
      'post',
      '/internal/promptTemplates/provisioning',
      {
        headerParameters
      },
      InternalApi._defaultBasePath
    ),
  /**
   * Offboard a tenant
   * @param headerParameters - Object containing the following keys: AI-Main-Tenant.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  offboardTenant: (headerParameters: { 'AI-Main-Tenant': string }) =>
    new OpenApiRequestBuilder<ProvisioningResponse>(
      'delete',
      '/internal/promptTemplates/provisioning',
      {
        headerParameters
      },
      InternalApi._defaultBasePath
    )
};
