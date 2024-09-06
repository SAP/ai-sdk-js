import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { BckndCommonResourceQuotaResponse, BckndExecutableResourceQuotaResponse } from './schema/index.js';
/**
 * Representation of the 'ResourceQuotaApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export declare const ResourceQuotaApi: {
    /**
     * Get the details about quota and usage for resource groups
     * @param queryParameters - Object containing the following keys: quotaOnly.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4ResourceQuotaGetResourceGroupQuota: (queryParameters?: {
        quotaOnly?: boolean;
    }, headerParameters?: {
        Authorization?: string;
    }) => OpenApiRequestBuilder<BckndCommonResourceQuotaResponse>;
    /**
     * Get the details about quota and usage for executables
     * @param queryParameters - Object containing the following keys: quotaOnly.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4ResourceQuotaGetExecutableQuota: (queryParameters?: {
        quotaOnly?: boolean;
    }, headerParameters?: {
        Authorization?: string;
    }) => OpenApiRequestBuilder<BckndExecutableResourceQuotaResponse>;
    /**
     * Get the details about quota and usage for applications
     * @param queryParameters - Object containing the following keys: quotaOnly.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4ResourceQuotaGetApplicationQuota: (queryParameters?: {
        quotaOnly?: boolean;
    }, headerParameters?: {
        Authorization?: string;
    }) => OpenApiRequestBuilder<BckndCommonResourceQuotaResponse>;
    /**
     * Get the details about quota and usage for repositories
     * @param queryParameters - Object containing the following keys: quotaOnly.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4ResourceQuotaGetRepositoryQuota: (queryParameters?: {
        quotaOnly?: boolean;
    }, headerParameters?: {
        Authorization?: string;
    }) => OpenApiRequestBuilder<BckndCommonResourceQuotaResponse>;
    /**
     * Get the details about quota and usage for tenant-level generic secrets
     * @param queryParameters - Object containing the following keys: quotaOnly.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4ResourceQuotaGetGenericSecretQuota: (queryParameters?: {
        quotaOnly?: boolean;
    }, headerParameters?: {
        Authorization?: string;
    }) => OpenApiRequestBuilder<BckndCommonResourceQuotaResponse>;
    /**
     * Get the details about quota and usage for docker registry secrets
     * @param queryParameters - Object containing the following keys: quotaOnly.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4ResourceQuotaGetDockerRegistrySecretQuota: (queryParameters?: {
        quotaOnly?: boolean;
    }, headerParameters?: {
        Authorization?: string;
    }) => OpenApiRequestBuilder<BckndCommonResourceQuotaResponse>;
};
//# sourceMappingURL=resource-quota-api.d.ts.map