/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
/**
 * Representation of the 'ExecutionApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export const ExecutionApi = {
    /**
     * Retrieve a list of executions that match the specified filter criteria.
     * Filter criteria include a list of executableIds, a scenarioId, a configurationId, or a execution status.
     * With top/skip parameters it is possible to paginate the result list.
     * With select parameter it is possible to select only status.
     *
     * @param queryParameters - Object containing the following keys: executableIds, configurationId, scenarioId, executionScheduleId, status, $top, $skip, $select.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    executionQuery: (queryParameters, headerParameters) => new OpenApiRequestBuilder('get', '/lm/executions', {
        queryParameters,
        headerParameters
    }),
    /**
     * Create an execution using the configuration specified by configurationId.
     * @param body - Request body.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    executionCreate: (body, headerParameters) => new OpenApiRequestBuilder('post', '/lm/executions', {
        body,
        headerParameters
    }),
    /**
     * Patch multiple executions' status to stopped or deleted.
     * @param body - Request body.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    executionBatchModify: (body, headerParameters) => new OpenApiRequestBuilder('patch', '/lm/executions', {
        body,
        headerParameters
    }),
    /**
     * Retrieve details for execution with executionId.
     * @param executionId - Execution identifier
     * @param queryParameters - Object containing the following keys: $select.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    executionGet: (executionId, queryParameters, headerParameters) => new OpenApiRequestBuilder('get', '/lm/executions/{executionId}', {
        pathParameters: { executionId },
        queryParameters,
        headerParameters
    }),
    /**
     * Update target status of the execution to stop an execution.
     * @param executionId - Execution identifier
     * @param body - Request body.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    executionModify: (executionId, body, headerParameters) => new OpenApiRequestBuilder('patch', '/lm/executions/{executionId}', {
        pathParameters: { executionId },
        body,
        headerParameters
    }),
    /**
     * Mark the execution with executionId as deleted.
     * @param executionId - Execution identifier
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    executionDelete: (executionId, headerParameters) => new OpenApiRequestBuilder('delete', '/lm/executions/{executionId}', {
        pathParameters: { executionId },
        headerParameters
    }),
    /**
     * Retrieve the number of available executions. The number can be filtered by
     * scenarioId, configurationId, executableIdsList or by execution status.
     *
     * @param queryParameters - Object containing the following keys: executableIds, configurationId, scenarioId, executionScheduleId, status.
     * @param headerParameters - Object containing the following keys: AI-Resource-Group.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    executionCount: (queryParameters, headerParameters) => new OpenApiRequestBuilder('get', '/lm/executions/$count', {
        queryParameters,
        headerParameters
    }),
    /**
     * Retrieve logs of an execution for getting insight into the execution results or failures.
     * @param executionId - Execution identifier
     * @param queryParameters - Object containing the following keys: $top, start, end, $order.
     * @param headerParameters - Object containing the following keys: Authorization.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kubesubmitV4ExecutionsGetLogs: (executionId, queryParameters, headerParameters) => new OpenApiRequestBuilder('get', '/lm/executions/{executionId}/logs', {
        pathParameters: { executionId },
        queryParameters,
        headerParameters
    })
};
//# sourceMappingURL=execution-api.js.map