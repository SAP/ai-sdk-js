/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
/**
 * Representation of the 'RepositoryApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export const RepositoryApi = {
    /**
     * Retrieve a list of all GitOps repositories for a tenant.
     * @param queryParameters - Object containing the following keys: $top, $skip, $count.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4RepositoriesGetAll: (queryParameters, headerParameters) => new OpenApiRequestBuilder('get', '/admin/repositories', {
        queryParameters,
        headerParameters
    }),
    /**
     * On-board a new GitOps repository as specified in the content payload
     * @param body - Request body.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4RepositoriesCreate: (body, headerParameters) => new OpenApiRequestBuilder('post', '/admin/repositories', {
        body,
        headerParameters
    }),
    /**
     * Retrieve the access details for a repository if it exists.
     * @param repositoryName - Name of the repository
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4RepositoriesGet: (repositoryName, headerParameters) => new OpenApiRequestBuilder('get', '/admin/repositories/{repositoryName}', {
        pathParameters: { repositoryName },
        headerParameters
    }),
    /**
     * Update the referenced repository credentials to synchronize a repository.
     *
     * @param repositoryName - Name of the repository
     * @param body - Request body.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4RepositoriesUpdate: (repositoryName, body, headerParameters) => new OpenApiRequestBuilder('patch', '/admin/repositories/{repositoryName}', {
        pathParameters: { repositoryName },
        body,
        headerParameters
    }),
    /**
     * Remove a repository from GitOps.
     * @param repositoryName - Name of the repository
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4RepositoriesDelete: (repositoryName, headerParameters) => new OpenApiRequestBuilder('delete', '/admin/repositories/{repositoryName}', {
        pathParameters: { repositoryName },
        headerParameters
    })
};
//# sourceMappingURL=repository-api.js.map