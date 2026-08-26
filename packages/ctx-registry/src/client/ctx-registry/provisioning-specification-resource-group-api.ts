/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';

import type { ProvisioningResourceGroup } from './schema/index.js';
/**
 * Representation of the 'ProvisioningSpecificationResourceGroupApi'.
 * This API is part of the 'ctx-registry' service.
 */
export const ProvisioningSpecificationResourceGroupApi = {
  _defaultBasePath: '/v2/admin/tcr',
  /**
   * Get details of about a resourceGroup
   * @param tenantId - Id of a main tenant, which corresponds to the SCP subaccount id
   * @param resourceGroupId - Id of a resourceGroup. This id is defined by a tenant
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  controllersProvisioningV1EndpointsGetRgProvisionInfo: (
    tenantId: string,
    resourceGroupId: string
  ) =>
    new OpenApiRequestBuilder<ProvisioningResourceGroup>(
      'get',
      '/provisioning/tenants/{tenantId}/resourceGroups/{resourceGroupId}',
      {
        pathParameters: { tenantId, resourceGroupId }
      },
      ProvisioningSpecificationResourceGroupApi._defaultBasePath
    ),
  /**
   * Start resourceGroup creation
   * @param tenantId - Id of a main tenant, which corresponds to the SCP subaccount id
   * @param resourceGroupId - Id of a resourceGroup. This id is defined by a tenant
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  controllersProvisioningV1EndpointsCreateRg: (
    tenantId: string,
    resourceGroupId: string
  ) =>
    new OpenApiRequestBuilder<any>(
      'put',
      '/provisioning/tenants/{tenantId}/resourceGroups/{resourceGroupId}',
      {
        pathParameters: { tenantId, resourceGroupId }
      },
      ProvisioningSpecificationResourceGroupApi._defaultBasePath
    ),
  /**
   * Deprovision a tenant
   * @param tenantId - Id of a main tenant, which corresponds to the SCP subaccount id
   * @param resourceGroupId - Id of a resourceGroup. This id is defined by a tenant
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  controllersProvisioningV1EndpointsDeleteRg: (
    tenantId: string,
    resourceGroupId: string
  ) =>
    new OpenApiRequestBuilder<any>(
      'delete',
      '/provisioning/tenants/{tenantId}/resourceGroups/{resourceGroupId}',
      {
        pathParameters: { tenantId, resourceGroupId }
      },
      ProvisioningSpecificationResourceGroupApi._defaultBasePath
    )
};
