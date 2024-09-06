/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
/**
 * Representation of the 'ServiceApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export const ServiceApi = {
    /**
     * Retrieve a list of services for a given main tenant.
     *
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4AiservicesGetAll: (headerParameters) => new OpenApiRequestBuilder('get', '/admin/services', {
        headerParameters
    }),
    /**
     * Get an service of a given main tenant.
     *
     * @param serviceName - Name of the Service
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4AiservicesGet: (serviceName, headerParameters) => new OpenApiRequestBuilder('get', '/admin/services/{serviceName}', {
        pathParameters: { serviceName },
        headerParameters
    })
};
//# sourceMappingURL=service-api.js.map