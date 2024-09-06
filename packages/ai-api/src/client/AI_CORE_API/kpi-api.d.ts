import { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { KpiResultSet, KpiColumnName } from './schema/index.js';
/**
 * Representation of the 'KPIApi'.
 * This API is part of the 'AI_CORE_API' service.
 */
export declare const KPIApi: {
    /**
     * Retrieve the number of executions, artifacts, and deployments
     * for each resource group, scenario, and executable. The columns to be returned can be specified in a query parameter.
     *
     * @param queryParameters - Object containing the following keys: $select.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    kpiGet: (queryParameters?: {
        $select?: Set<KpiColumnName>;
    }) => OpenApiRequestBuilder<KpiResultSet>;
};
//# sourceMappingURL=kpi-api.d.ts.map