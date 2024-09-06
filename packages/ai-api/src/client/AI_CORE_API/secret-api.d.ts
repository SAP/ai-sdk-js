import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { BckndListGenericSecretsResponse, BckndGenericSecretPostBody, BckndGenericSecretDataResponse, BckndGenericSecretPatchBody } from './schema/index.js';
/**
 * Representation of the 'SecretApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export declare const SecretApi: {
    /**
     * Lists all secrets corresponding to tenant. This retrieves metadata only, not the secret data itself.
     * @param queryParameters - Object containing the following keys: $top, $skip, $count.
     * @param headerParameters - Object containing the following keys: Authorization, AI-Resource-Group, AI-Tenant-Scope.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4GenericSecretsGet: (queryParameters?: {
        $top?: number;
        $skip?: number;
        $count?: boolean;
    }, headerParameters?: {
        Authorization?: string;
        "AI-Resource-Group"?: string;
        "AI-Tenant-Scope"?: boolean;
    }) => OpenApiRequestBuilder<BckndListGenericSecretsResponse>;
    /**
     * Create a new generic secret in the corresponding resource group or at main tenant level.
     * @param body - Request body.
     * @param headerParameters - Object containing the following keys: Authorization, AI-Resource-Group, AI-Tenant-Scope.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4GenericSecretsCreate: (body: BckndGenericSecretPostBody, headerParameters?: {
        Authorization?: string;
        "AI-Resource-Group"?: string;
        "AI-Tenant-Scope"?: boolean;
    }) => OpenApiRequestBuilder<BckndGenericSecretDataResponse>;
    /**
     * Update secret credentials. Replace secret data with the provided data.
     * @param secretName - Path parameter.
     * @param body - Request body.
     * @param headerParameters - Object containing the following keys: Authorization, AI-Resource-Group, AI-Tenant-Scope.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4GenericSecretsUpdate: (secretName: string, body: BckndGenericSecretPatchBody, headerParameters?: {
        Authorization?: string;
        "AI-Resource-Group"?: string;
        "AI-Tenant-Scope"?: boolean;
    }) => OpenApiRequestBuilder<BckndGenericSecretDataResponse>;
    /**
     * Deletes the secret from provided resource group namespace
     * @param secretName - Path parameter.
     * @param headerParameters - Object containing the following keys: Authorization, AI-Resource-Group, AI-Tenant-Scope.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4GenericSecretsDelete: (secretName: string, headerParameters?: {
        Authorization?: string;
        "AI-Resource-Group"?: string;
        "AI-Tenant-Scope"?: boolean;
    }) => OpenApiRequestBuilder<any>;
};
//# sourceMappingURL=secret-api.d.ts.map