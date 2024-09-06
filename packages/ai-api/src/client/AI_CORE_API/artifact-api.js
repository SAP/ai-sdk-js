/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
/**
 * Representation of the 'ArtifactApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export const ArtifactApi = {
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
    artifactQuery: (queryParameters, headerParameters) => new OpenApiRequestBuilder('get', '/lm/artifacts', {
        queryParameters,
        headerParameters
    }),
    /**
     * Register an artifact for use in a configuration, for example a model or a dataset.
     * @param body - Request body.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    artifactCreate: (body, headerParameters) => new OpenApiRequestBuilder('post', '/lm/artifacts', {
        body,
        headerParameters
    }),
    /**
     * Retrieve details for artifact with artifactId.
     * @param artifactId - Artifact identifier
     * @param queryParameters - Object containing the following keys: $expand.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    artifactGet: (artifactId, queryParameters, headerParameters) => new OpenApiRequestBuilder('get', '/lm/artifacts/{artifactId}', {
        pathParameters: { artifactId },
        queryParameters,
        headerParameters
    }),
    /**
     * Retrieve  the number of available artifacts that match the specified filter criteria.
     * Filter criteria include a scenarioId, executionId, an artifact name, artifact kind, or artifact labels.
     * Search by substring of artifact name or description is also possible.
     *
     * @param queryParameters - Object containing the following keys: scenarioId, executionId, name, kind, $search, searchCaseInsensitive, artifactLabelSelector.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    artifactCount: (queryParameters, headerParameters) => new OpenApiRequestBuilder('get', '/lm/artifacts/$count', {
        queryParameters,
        headerParameters
    })
};
//# sourceMappingURL=artifact-api.js.map