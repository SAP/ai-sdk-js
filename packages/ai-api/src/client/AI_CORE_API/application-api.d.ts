import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { BckndAllArgoCDApplicationData, BckndArgoCDApplicationData, BckndArgoCDApplicationDataRepoName, BckndArgoCDApplicationCreationResponse, BckndArgoCDApplicationStatus, BckndArgoCDApplicationBaseData, BckndArgoCDApplicationModificationResponse, BckndArgoCDApplicationDeletionResponse, BckndArgoCDApplicationRefreshResponse } from './schema/index.js';
/**
 * Representation of the 'ApplicationApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export declare const ApplicationApi: {
    /**
     * Return all Argo CD application data objects.
     *
     * @param queryParameters - Object containing the following keys: $top, $skip, $count.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4ApplicationsGetAll: (queryParameters?: {
        $top?: number;
        $skip?: number;
        $count?: boolean;
    }, headerParameters?: {
        Authorization?: string;
    }) => OpenApiRequestBuilder<BckndAllArgoCDApplicationData>;
    /**
     * Create an ArgoCD application to synchronise a repository.
     *
     * @param body - Request body.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4ApplicationsCreate: (body: BckndArgoCDApplicationData | BckndArgoCDApplicationDataRepoName, headerParameters?: {
        Authorization?: string;
    }) => OpenApiRequestBuilder<BckndArgoCDApplicationCreationResponse>;
    /**
     * Returns the ArgoCD application health and sync status.
     *
     * @param applicationName - Name of the ArgoCD application
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4ApplicationsGetStatus: (applicationName: string, headerParameters?: {
        Authorization?: string;
    }) => OpenApiRequestBuilder<BckndArgoCDApplicationStatus>;
    /**
     * Retrieve the ArgoCD application details.
     *
     * @param applicationName - Name of the ArgoCD application
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4ApplicationsGet: (applicationName: string, headerParameters?: {
        Authorization?: string;
    }) => OpenApiRequestBuilder<BckndArgoCDApplicationData>;
    /**
     * Update the referenced ArgoCD application to synchronize the repository.
     *
     * @param applicationName - Name of the ArgoCD application
     * @param body - Request body.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4ApplicationsUpdate: (applicationName: string, body: BckndArgoCDApplicationBaseData, headerParameters?: {
        Authorization?: string;
    }) => OpenApiRequestBuilder<BckndArgoCDApplicationModificationResponse>;
    /**
     * Delete an ArgoCD application
     * @param applicationName - Name of the ArgoCD application
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4ApplicationsDelete: (applicationName: string, headerParameters?: {
        Authorization?: string;
    }) => OpenApiRequestBuilder<BckndArgoCDApplicationDeletionResponse>;
    /**
     * Schedules a refresh of the specified application that will be picked up by ArgoCD asynchronously
     *
     * @param applicationName - Name of the ArgoCD application
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4ApplicationsRefresh: (applicationName: string, headerParameters?: {
        Authorization?: string;
    }) => OpenApiRequestBuilder<BckndArgoCDApplicationRefreshResponse>;
};
//# sourceMappingURL=application-api.d.ts.map