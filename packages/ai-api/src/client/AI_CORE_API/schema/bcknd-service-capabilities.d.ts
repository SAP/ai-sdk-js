/**
 * Representation of the 'BckndServiceCapabilities' schema.
 */
export type BckndServiceCapabilities = {
    /**
     * Capabilities to read logs from deployments and executions.
     */
    logs?: {
        deployments?: boolean;
        executions?: boolean;
    } & Record<string, any>;
    /**
     * Basic capabilities like creating deployments and executions.
     */
    basic?: {
        /**
         * There are static always running endpoints that can be used for inference without the need to do user deployments.
         */
        staticDeployments?: boolean;
        /**
         * Services that only support batch inference typically neither allow listing nor creation of deployments. For these, userDeployments == false
         */
        userDeployments?: boolean;
        /**
         * Services that only support deployment typically neither allow create executions. For these, createExecutions == false
         */
        createExecutions?: boolean;
        /**
         * true-> AI API implementation supports resource groups (Main Tenant scenario), false-> implementation does not support resource groups (Service Tenant scenario)
         */
        multitenant?: boolean;
    } & Record<string, any>;
} & Record<string, any>;
//# sourceMappingURL=bcknd-service-capabilities.d.ts.map