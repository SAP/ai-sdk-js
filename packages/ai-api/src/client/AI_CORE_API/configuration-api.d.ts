import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { AiConfigurationList, AiConfigurationBaseData, AiConfigurationCreationResponse, AiConfiguration } from './schema/index.js';
/**
 * Representation of the 'ConfigurationApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export declare const ConfigurationApi: {
    /**
     * Retrieve a list of configurations. Filter results by scenario ID or a list of executable IDs.
     * Search for configurations containing the search string as substring in the configuration name.
     *
     * @param queryParameters - Object containing the following keys: scenarioId, $top, $skip, executableIds, $search, searchCaseInsensitive, $expand.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    configurationQuery: (queryParameters: {
        scenarioId?: string;
        $top?: number;
        $skip?: number;
        executableIds?: string[];
        $search?: string;
        searchCaseInsensitive?: boolean;
        $expand?: "scenario";
    }, headerParameters: {
        "AI-Resource-Group": string;
    }) => OpenApiRequestBuilder<AiConfigurationList>;
    /**
     * Create a new configuration linked to a specific scenario and executable for use in an execution
     * or deployment.
     *
     * @param body - Request body.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    configurationCreate: (body: AiConfigurationBaseData, headerParameters: {
        "AI-Resource-Group": string;
    }) => OpenApiRequestBuilder<AiConfigurationCreationResponse>;
    /**
     * Retrieve details for configuration with configurationId.
     * @param configurationId - Configuration identifier
     * @param queryParameters - Object containing the following keys: $expand.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    configurationGet: (configurationId: string, queryParameters: {
        $expand?: "scenario";
    }, headerParameters: {
        "AI-Resource-Group": string;
    }) => OpenApiRequestBuilder<AiConfiguration>;
    /**
     * Retrieve the number of available configurations that match the specified filter criteria.
     * Filter criteria include a scenarioId or executableIdsList. Search by substring of configuration name is also possible.
     *
     * @param queryParameters - Object containing the following keys: scenarioId, $search, searchCaseInsensitive, executableIds.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    configurationCount: (queryParameters: {
        scenarioId?: string;
        $search?: string;
        searchCaseInsensitive?: boolean;
        executableIds?: string[];
    }, headerParameters: {
        "AI-Resource-Group": string;
    }) => OpenApiRequestBuilder<any>;
};
//# sourceMappingURL=configuration-api.d.ts.map