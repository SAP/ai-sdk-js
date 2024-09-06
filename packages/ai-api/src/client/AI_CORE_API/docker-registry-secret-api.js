/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
/**
 * Representation of the 'DockerRegistrySecretApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export const DockerRegistrySecretApi = {
    /**
     * Retrieve the stored secret metadata which matches the parameter dockerRegistryName. The base64 encoded field for the stored secret is not returned.
     *
     * @param dockerRegistryName - Name of the docker Registry store for the secret.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4DockerRegistrySecretsGet: (dockerRegistryName, headerParameters) => new OpenApiRequestBuilder('get', '/admin/dockerRegistrySecrets/{dockerRegistryName}', {
        pathParameters: { dockerRegistryName },
        headerParameters
    }),
    /**
     * Update a secret with name of dockerRegistryName if it exists.
     *
     * @param dockerRegistryName - Name of the docker Registry store for the secret.
     * @param body - Request body.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4DockerRegistrySecretsPatch: (dockerRegistryName, body, headerParameters) => new OpenApiRequestBuilder('patch', '/admin/dockerRegistrySecrets/{dockerRegistryName}', {
        pathParameters: { dockerRegistryName },
        body,
        headerParameters
    }),
    /**
     * Delete a secret with the name of dockerRegistryName if it exists.
     * @param dockerRegistryName - Name of the docker Registry store for the secret.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4DockerRegistrySecretsDelete: (dockerRegistryName, headerParameters) => new OpenApiRequestBuilder('delete', '/admin/dockerRegistrySecrets/{dockerRegistryName}', {
        pathParameters: { dockerRegistryName },
        headerParameters
    }),
    /**
     * Retrieve a list of metadata of the stored secrets
     *
     * @param queryParameters - Object containing the following keys: $top, $skip, $count.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4DockerRegistrySecretsQuery: (queryParameters, headerParameters) => new OpenApiRequestBuilder('get', '/admin/dockerRegistrySecrets', {
        queryParameters,
        headerParameters
    }),
    /**
     * Create a secret based on the configuration in the request body.
     *
     * @param body - Request body.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4DockerRegistrySecretsCreate: (body, headerParameters) => new OpenApiRequestBuilder('post', '/admin/dockerRegistrySecrets', {
        body,
        headerParameters
    })
};
//# sourceMappingURL=docker-registry-secret-api.js.map