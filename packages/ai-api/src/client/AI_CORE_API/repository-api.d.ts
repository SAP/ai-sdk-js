import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { BckndArgoCDRepositoryDataResponse, BckndArgoCDRepositoryData, BckndArgoCDRepositoryCreationResponse, BckndArgoCDRepositoryDetails, BckndArgoCDRepositoryCredentials, BckndArgoCDRepositoryModificationResponse, BckndArgoCDRepositoryDeletionResponse } from './schema/index.js';
/**
 * Representation of the 'RepositoryApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export declare const RepositoryApi: {
    /**
     * Retrieve a list of all GitOps repositories for a tenant.
     * @param queryParameters - Object containing the following keys: $top, $skip, $count.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4RepositoriesGetAll: (queryParameters?: {
        $top?: number;
        $skip?: number;
        $count?: boolean;
    }, headerParameters?: {
        Authorization?: string;
    }) => OpenApiRequestBuilder<BckndArgoCDRepositoryDataResponse>;
    /**
     * On-board a new GitOps repository as specified in the content payload
     * @param body - Request body.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4RepositoriesCreate: (body: BckndArgoCDRepositoryData, headerParameters?: {
        Authorization?: string;
    }) => OpenApiRequestBuilder<BckndArgoCDRepositoryCreationResponse>;
    /**
     * Retrieve the access details for a repository if it exists.
     * @param repositoryName - Name of the repository
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4RepositoriesGet: (repositoryName: string, headerParameters?: {
        Authorization?: string;
    }) => OpenApiRequestBuilder<BckndArgoCDRepositoryDetails>;
    /**
     * Update the referenced repository credentials to synchronize a repository.
     *
     * @param repositoryName - Name of the repository
     * @param body - Request body.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4RepositoriesUpdate: (repositoryName: string, body: BckndArgoCDRepositoryCredentials, headerParameters?: {
        Authorization?: string;
    }) => OpenApiRequestBuilder<BckndArgoCDRepositoryModificationResponse>;
    /**
     * Remove a repository from GitOps.
     * @param repositoryName - Name of the repository
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4RepositoriesDelete: (repositoryName: string, headerParameters?: {
        Authorization?: string;
    }) => OpenApiRequestBuilder<BckndArgoCDRepositoryDeletionResponse>;
};
//# sourceMappingURL=repository-api.d.ts.map