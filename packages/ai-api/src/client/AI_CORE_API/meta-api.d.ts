import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { MetaCapabilities } from './schema/index.js';
/**
 * Representation of the 'MetaApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export declare const MetaApi: {
    /**
     * Meta information about an implementation of AI API, describing its capabilities, limits and extensions
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    metaGet: () => OpenApiRequestBuilder<MetaCapabilities>;
};
//# sourceMappingURL=meta-api.d.ts.map