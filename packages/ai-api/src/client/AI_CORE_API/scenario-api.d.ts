import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { AiScenarioList, AiScenario, AiVersionList } from './schema/index.js';
/**
 * Representation of the 'ScenarioApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export declare const ScenarioApi: {
    /**
     * Retrieve a list of all available scenarios.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    scenarioQuery: (headerParameters: {
        "AI-Resource-Group": string;
    }) => OpenApiRequestBuilder<AiScenarioList>;
    /**
     * Retrieve details for a scenario specified by scenarioId.
     * @param scenarioId - Scenario identifier
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    scenarioGet: (scenarioId: string, headerParameters: {
        "AI-Resource-Group": string;
    }) => OpenApiRequestBuilder<AiScenario>;
    /**
     * Retrieve a list of scenario versions based on the versions of executables
     * available within that scenario.
     *
     * @param scenarioId - Scenario identifier
     * @param queryParameters - Object containing the following keys: labelSelector.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    scenarioQueryVersions: (scenarioId: string, queryParameters: {
        labelSelector?: string[];
    }, headerParameters: {
        "AI-Resource-Group": string;
    }) => OpenApiRequestBuilder<AiVersionList>;
};
//# sourceMappingURL=scenario-api.d.ts.map