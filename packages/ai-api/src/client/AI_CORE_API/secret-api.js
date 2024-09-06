/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
/**
 * Representation of the 'SecretApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export const SecretApi = {
    /**
     * Lists all secrets corresponding to tenant. This retrieves metadata only, not the secret data itself.
     * @param queryParameters - Object containing the following keys: $top, $skip, $count.
     * @param headerParameters - Object containing the following keys: Authorization, AI-Resource-Group, AI-Tenant-Scope.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4GenericSecretsGet: (queryParameters, headerParameters) => new OpenApiRequestBuilder('get', '/admin/secrets', {
        queryParameters,
        headerParameters
    }),
    /**
     * Create a new generic secret in the corresponding resource group or at main tenant level.
     * @param body - Request body.
     * @param headerParameters - Object containing the following keys: Authorization, AI-Resource-Group, AI-Tenant-Scope.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4GenericSecretsCreate: (body, headerParameters) => new OpenApiRequestBuilder('post', '/admin/secrets', {
        body,
        headerParameters
    }),
    /**
     * Update secret credentials. Replace secret data with the provided data.
     * @param secretName - Path parameter.
     * @param body - Request body.
     * @param headerParameters - Object containing the following keys: Authorization, AI-Resource-Group, AI-Tenant-Scope.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4GenericSecretsUpdate: (secretName, body, headerParameters) => new OpenApiRequestBuilder('patch', '/admin/secrets/{secretName}', {
        pathParameters: { secretName },
        body,
        headerParameters
    }),
    /**
     * Deletes the secret from provided resource group namespace
     * @param secretName - Path parameter.
     * @param headerParameters - Object containing the following keys: Authorization, AI-Resource-Group, AI-Tenant-Scope.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4GenericSecretsDelete: (secretName, headerParameters) => new OpenApiRequestBuilder('delete', '/admin/secrets/{secretName}', {
        pathParameters: { secretName },
        headerParameters
    })
};
//# sourceMappingURL=secret-api.js.map