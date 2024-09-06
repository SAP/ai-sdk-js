/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
/**
 * Representation of the 'ResourceQuotaApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export const ResourceQuotaApi = {
    /**
     * Get the details about quota and usage for resource groups
     * @param queryParameters - Object containing the following keys: quotaOnly.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4ResourceQuotaGetResourceGroupQuota: (queryParameters, headerParameters) => new OpenApiRequestBuilder('get', '/admin/resourceQuota/resourceGroups', {
        queryParameters,
        headerParameters
    }),
    /**
     * Get the details about quota and usage for executables
     * @param queryParameters - Object containing the following keys: quotaOnly.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4ResourceQuotaGetExecutableQuota: (queryParameters, headerParameters) => new OpenApiRequestBuilder('get', '/admin/resourceQuota/executables', {
        queryParameters,
        headerParameters
    }),
    /**
     * Get the details about quota and usage for applications
     * @param queryParameters - Object containing the following keys: quotaOnly.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4ResourceQuotaGetApplicationQuota: (queryParameters, headerParameters) => new OpenApiRequestBuilder('get', '/admin/resourceQuota/applications', {
        queryParameters,
        headerParameters
    }),
    /**
     * Get the details about quota and usage for repositories
     * @param queryParameters - Object containing the following keys: quotaOnly.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4ResourceQuotaGetRepositoryQuota: (queryParameters, headerParameters) => new OpenApiRequestBuilder('get', '/admin/resourceQuota/repositories', {
        queryParameters,
        headerParameters
    }),
    /**
     * Get the details about quota and usage for tenant-level generic secrets
     * @param queryParameters - Object containing the following keys: quotaOnly.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4ResourceQuotaGetGenericSecretQuota: (queryParameters, headerParameters) => new OpenApiRequestBuilder('get', '/admin/resourceQuota/secrets', {
        queryParameters,
        headerParameters
    }),
    /**
     * Get the details about quota and usage for docker registry secrets
     * @param queryParameters - Object containing the following keys: quotaOnly.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4ResourceQuotaGetDockerRegistrySecretQuota: (queryParameters, headerParameters) => new OpenApiRequestBuilder('get', '/admin/resourceQuota/dockerRegistrySecrets', {
        queryParameters,
        headerParameters
    })
};
//# sourceMappingURL=resource-quota-api.js.map