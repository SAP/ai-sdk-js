import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { BckndResourceGroupList, BckndResourceGroupsPostRequest, BckndResourceGroupBase, BckndResourceGroup, BckndResourceGroupPatchRequest, BckndResourceGroupDeletionResponse } from './schema/index.js';
/**
 * Representation of the 'ResourceGroupApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export declare const ResourceGroupApi: {
    /**
     * Retrieve a list of resource groups for a given tenant.
     *
     * @param queryParameters - Object containing the following keys: $top, $skip, $count, continueToken, labelSelector.
     * @param headerParameters - Object containing the following keys: Authorization, Prefer.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4ResourcegroupsGetAll: (queryParameters?: {
        $top?: number;
        $skip?: number;
        $count?: boolean;
        continueToken?: string;
        labelSelector?: string[];
    }, headerParameters?: {
        Authorization?: string;
        Prefer?: string;
    }) => OpenApiRequestBuilder<BckndResourceGroupList>;
    /**
     * Create resource group to a given main tenant. The length of resource group id must be between 3 and 253.
     *
     * @param body - Request body.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4ResourcegroupsCreate: (body: BckndResourceGroupsPostRequest, headerParameters?: {
        Authorization?: string;
    }) => OpenApiRequestBuilder<BckndResourceGroupBase>;
    /**
     * Get a resource group of a given main tenant.
     *
     * @param resourceGroupId - Resource group identifier
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4ResourcegroupsGet: (resourceGroupId: string, headerParameters?: {
        Authorization?: string;
    }) => OpenApiRequestBuilder<BckndResourceGroup>;
    /**
     * Replace some characteristics of the resource group, for instance labels.
     *
     * @param resourceGroupId - Resource group identifier
     * @param body - Request body.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4ResourcegroupsPatch: (resourceGroupId: string, body: BckndResourceGroupPatchRequest, headerParameters?: {
        Authorization?: string;
    }) => OpenApiRequestBuilder<any>;
    /**
     * Delete a resource group of a given main tenant.
     *
     * @param resourceGroupId - Resource group identifier
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4ResourcegroupsDelete: (resourceGroupId: string, headerParameters?: {
        Authorization?: string;
    }) => OpenApiRequestBuilder<BckndResourceGroupDeletionResponse>;
};
//# sourceMappingURL=resource-group-api.d.ts.map