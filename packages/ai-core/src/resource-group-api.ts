/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-cloud-sdk/openapi';
import type {
  BckndResourceGroupList,
  BckndResourceGroupsPostRequest,
  BckndResourceGroupBase,
  BckndResourceGroup,
  BckndResourceGroupPatchRequest,
  BckndResourceGroupDeletionResponse
} from './schema';
/**
 * Representation of the 'ResourceGroupApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export const ResourceGroupApi = {
  /**
   * Retrieve a list of resource groups for a given tenant.
   *
   * @param queryParameters - Object containing the following keys: $top, $skip, $count, continueToken, labelSelector.
   * @param headerParameters - Object containing the following keys: Authorization, Prefer.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4ResourcegroupsGetAll: (
    queryParameters?: {
      $top?: number;
      $skip?: number;
      $count?: boolean;
      continueToken?: string;
      labelSelector?: string[];
    },
    headerParameters?: { Authorization?: string; Prefer?: string }
  ) =>
    new OpenApiRequestBuilder<BckndResourceGroupList>(
      'get',
      '/admin/resourceGroups',
      {
        queryParameters,
        headerParameters
      }
    ),
  /**
   * Create resource group to a given main tenant. The length of resource group id must be between 3 and 253.
   *
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4ResourcegroupsCreate: (
    body: BckndResourceGroupsPostRequest,
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<BckndResourceGroupBase>(
      'post',
      '/admin/resourceGroups',
      {
        body,
        headerParameters
      }
    ),
  /**
   * Get a resource group of a given main tenant.
   *
   * @param resourceGroupId - Resource group identifier
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4ResourcegroupsGet: (
    resourceGroupId: string,
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<BckndResourceGroup>(
      'get',
      '/admin/resourceGroups/{resourceGroupId}',
      {
        pathParameters: { resourceGroupId },
        headerParameters
      }
    ),
  /**
   * Replace some characteristics of the resource group, for instance labels.
   *
   * @param resourceGroupId - Resource group identifier
   * @param body - Request body.
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4ResourcegroupsPatch: (
    resourceGroupId: string,
    body: BckndResourceGroupPatchRequest,
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<any>(
      'patch',
      '/admin/resourceGroups/{resourceGroupId}',
      {
        pathParameters: { resourceGroupId },
        body,
        headerParameters
      }
    ),
  /**
   * Delete a resource group of a given main tenant.
   *
   * @param resourceGroupId - Resource group identifier
   * @param headerParameters - Object containing the following keys: Authorization.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  kubesubmitV4ResourcegroupsDelete: (
    resourceGroupId: string,
    headerParameters?: { Authorization?: string }
  ) =>
    new OpenApiRequestBuilder<BckndResourceGroupDeletionResponse>(
      'delete',
      '/admin/resourceGroups/{resourceGroupId}',
      {
        pathParameters: { resourceGroupId },
        headerParameters
      }
    )
};
