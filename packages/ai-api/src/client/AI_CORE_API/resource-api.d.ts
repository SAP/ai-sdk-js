import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { BckndResourceGetResponse, BckndResourcePatchBody, BckndResourcePatchResponse } from './schema/index.js';
/**
 * Representation of the 'ResourceApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export declare const ResourceApi: {
    /**
     * Lists all hot spare nodes, used nodes and total nodes corresponding to tenant.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4ResourcesGet: (headerParameters?: {
        Authorization?: string;
    }) => OpenApiRequestBuilder<BckndResourceGetResponse>;
    /**
     * Set hot spare nodes corresponding to tenant at main tenant level.
     * @param body - Request body.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4ResourcesPatch: (body: BckndResourcePatchBody, headerParameters?: {
        Authorization?: string;
    }) => OpenApiRequestBuilder<BckndResourcePatchResponse>;
};
//# sourceMappingURL=resource-api.d.ts.map