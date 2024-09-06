/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
/**
 * Representation of the 'MetricsApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export const MetricsApi = {
    /**
     * Retrieve metrics, labels, or tags according to filter conditions.
     * One query parameter is mandatory, either execution ID or filter.
     * Use up to 10 execution IDs in a query parameter.
     *
     * @param queryParameters - Object containing the following keys: $filter, executionIds, $select.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    metricsFind: (queryParameters, headerParameters) => new OpenApiRequestBuilder('get', '/lm/metrics', {
        queryParameters,
        headerParameters
    }),
    /**
     * Update or create metrics, tags, or labels associated with an execution.
     *
     * @param body - Request body.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    metricsPatch: (body, headerParameters) => new OpenApiRequestBuilder('patch', '/lm/metrics', {
        body,
        headerParameters
    }),
    /**
     * Delete metrics, tags, or labels associated with an execution.
     * @param queryParameters - Object containing the following keys: executionId.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    metricsDelete: (queryParameters, headerParameters) => new OpenApiRequestBuilder('delete', '/lm/metrics', {
        queryParameters,
        headerParameters
    })
};
//# sourceMappingURL=metrics-api.js.map