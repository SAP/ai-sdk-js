import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { TrckGetMetricResourceList, TrckStringArray, TrckmetricSelectorPermissibleValues, TrckMetricResource, TrckDeleteMetricsResponse, TrckExecutionId } from './schema/index.js';
/**
 * Representation of the 'MetricsApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export declare const MetricsApi: {
    /**
     * Retrieve metrics, labels, or tags according to filter conditions.
     * One query parameter is mandatory, either execution ID or filter.
     * Use up to 10 execution IDs in a query parameter.
     *
     * @param queryParameters - Object containing the following keys: $filter, executionIds, $select.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    metricsFind: (queryParameters: {
        $filter?: string;
        executionIds?: TrckStringArray;
        $select?: TrckmetricSelectorPermissibleValues;
    }, headerParameters: {
        "AI-Resource-Group": string;
    }) => OpenApiRequestBuilder<TrckGetMetricResourceList>;
    /**
     * Update or create metrics, tags, or labels associated with an execution.
     *
     * @param body - Request body.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    metricsPatch: (body: TrckMetricResource, headerParameters: {
        "AI-Resource-Group": string;
    }) => OpenApiRequestBuilder<any>;
    /**
     * Delete metrics, tags, or labels associated with an execution.
     * @param queryParameters - Object containing the following keys: executionId.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    metricsDelete: (queryParameters: {
        executionId: TrckExecutionId;
    }, headerParameters: {
        "AI-Resource-Group": string;
    }) => OpenApiRequestBuilder<TrckDeleteMetricsResponse>;
};
//# sourceMappingURL=metrics-api.d.ts.map