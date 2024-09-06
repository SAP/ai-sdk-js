import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { BckndServiceList, BckndExtendedService } from './schema/index.js';
/**
 * Representation of the 'ServiceApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export declare const ServiceApi: {
    /**
     * Retrieve a list of services for a given main tenant.
     *
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4AiservicesGetAll: (headerParameters?: {
        Authorization?: string;
    }) => OpenApiRequestBuilder<BckndServiceList>;
    /**
     * Get an service of a given main tenant.
     *
     * @param serviceName - Name of the Service
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4AiservicesGet: (serviceName: string, headerParameters?: {
        Authorization?: string;
    }) => OpenApiRequestBuilder<BckndExtendedService>;
};
//# sourceMappingURL=service-api.d.ts.map