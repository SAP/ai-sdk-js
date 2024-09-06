import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { AiModelList } from './schema/index.js';
/**
 * Representation of the 'ModelApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export declare const ModelApi: {
    /**
     * Retrieve information about all models available in LLM global scenario
     * @param scenarioId - Scenario identifier
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    modelsGet: (scenarioId: string) => OpenApiRequestBuilder<AiModelList>;
};
//# sourceMappingURL=model-api.d.ts.map