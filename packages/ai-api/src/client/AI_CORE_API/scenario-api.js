/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
/**
 * Representation of the 'ScenarioApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export const ScenarioApi = {
    /**
     * Retrieve a list of all available scenarios.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    scenarioQuery: (headerParameters) => new OpenApiRequestBuilder('get', '/lm/scenarios', {
        headerParameters
    }),
    /**
     * Retrieve details for a scenario specified by scenarioId.
     * @param scenarioId - Scenario identifier
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    scenarioGet: (scenarioId, headerParameters) => new OpenApiRequestBuilder('get', '/lm/scenarios/{scenarioId}', {
        pathParameters: { scenarioId },
        headerParameters
    }),
    /**
     * Retrieve a list of scenario versions based on the versions of executables
     * available within that scenario.
     *
     * @param scenarioId - Scenario identifier
     * @param queryParameters - Object containing the following keys: labelSelector.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    scenarioQueryVersions: (scenarioId, queryParameters, headerParameters) => new OpenApiRequestBuilder('get', '/lm/scenarios/{scenarioId}/versions', {
        pathParameters: { scenarioId },
        queryParameters,
        headerParameters
    })
};
//# sourceMappingURL=scenario-api.js.map