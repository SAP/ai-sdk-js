import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { AiArtifactList, AiArtifactName, AiArtifactPostData, AiArtifactCreationResponse, AiArtifact } from './schema/index.js';
/**
 * Representation of the 'ArtifactApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export declare const ArtifactApi: {
    /**
     * Retrieve a list of artifacts that matches the specified filter criteria.
     * Filter criteria include scenario ID, execution ID, an artifact name, artifact kind, or artifact labels.
     * Use top/skip parameters to paginate the result list.
     * Search by substring of artifact name or description, if required.
     *
     * @param queryParameters - Object containing the following keys: scenarioId, executionId, name, kind, artifactLabelSelector, $top, $skip, $search, searchCaseInsensitive, $expand.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    artifactQuery: (queryParameters: {
        scenarioId?: string;
        executionId?: string;
        name?: AiArtifactName;
        kind?: "model" | "dataset" | "resultset" | "other";
        artifactLabelSelector?: string[];
        $top?: number;
        $skip?: number;
        $search?: string;
        searchCaseInsensitive?: boolean;
        $expand?: "scenario";
    }, headerParameters: {
        "AI-Resource-Group": string;
    }) => OpenApiRequestBuilder<AiArtifactList>;
    /**
     * Register an artifact for use in a configuration, for example a model or a dataset.
     * @param body - Request body.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    artifactCreate: (body: AiArtifactPostData, headerParameters: {
        "AI-Resource-Group": string;
    }) => OpenApiRequestBuilder<AiArtifactCreationResponse>;
    /**
     * Retrieve details for artifact with artifactId.
     * @param artifactId - Artifact identifier
     * @param queryParameters - Object containing the following keys: $expand.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    artifactGet: (artifactId: string, queryParameters: {
        $expand?: "scenario";
    }, headerParameters: {
        "AI-Resource-Group": string;
    }) => OpenApiRequestBuilder<AiArtifact>;
    /**
     * Retrieve  the number of available artifacts that match the specified filter criteria.
     * Filter criteria include a scenarioId, executionId, an artifact name, artifact kind, or artifact labels.
     * Search by substring of artifact name or description is also possible.
     *
     * @param queryParameters - Object containing the following keys: scenarioId, executionId, name, kind, $search, searchCaseInsensitive, artifactLabelSelector.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    artifactCount: (queryParameters: {
        scenarioId?: string;
        executionId?: string;
        name?: AiArtifactName;
        kind?: "model" | "dataset" | "resultset" | "other";
        $search?: string;
        searchCaseInsensitive?: boolean;
        artifactLabelSelector?: string[];
    }, headerParameters: {
        "AI-Resource-Group": string;
    }) => OpenApiRequestBuilder<any>;
};
//# sourceMappingURL=artifact-api.d.ts.map