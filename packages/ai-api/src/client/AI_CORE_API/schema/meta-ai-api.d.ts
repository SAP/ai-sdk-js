import type { MetaVersion } from './meta-version.js';
/**
 * There are (currently) the following types of execution engines  1) complete runtimes that offer executions and deployments, 2) runtimes that do only batch inference and therefore don't support deployments 3) runtimes that allow deployments, but with predefined models and therefore don't need executions 4) runtimes that have fixed endpoints and therefore only need listing deployments
 */
export type MetaAiApi = {
    version: MetaVersion;
    capabilities?: {
        /**
         * true-> AI API implementation supports resource groups (Main Tenant scenario), false-> implementation does not support resource groups (Service Tenant scenario)
         * Default: true.
         */
        multitenant?: boolean;
        /**
         * true-> clients can use just one instance (global static models), false-> clients should avoid sharing an instance
         * Default: true.
         */
        shareable?: boolean;
        /**
         * There are static always running endpoints that can be used for inference without the need to do user deployments.
         * Default: true.
         */
        staticDeployments?: boolean;
        /**
         * Services that only support batch inference typically neither allow listing nor creation of deployments. For these, userDeployments == false
         * Default: true.
         */
        userDeployments?: boolean;
        /**
         * Default: true.
         */
        userExecutions?: boolean;
        timeToLiveDeployments?: boolean;
        executionSchedules?: boolean;
        logs?: {
            /**
             * Default: true.
             */
            executions?: boolean;
            /**
             * Default: true.
             */
            deployments?: boolean;
        } & Record<string, any>;
        /**
         * Services that support patch on /executions and /deployments to change targetStatus of multiple executions and deployments.
         */
        bulkUpdates?: {
            executions?: boolean;
            deployments?: boolean;
        } & Record<string, any>;
    } & Record<string, any>;
    limits?: {
        executions?: {
            /**
             * Max nr of executions allowed by this runtime per resource group. <0 means unlimited.
             * Default: -1.
             */
            maxRunningCount?: number;
        } & Record<string, any>;
        deployments?: {
            /**
             * Max nr of deployments allowed by this runtime per resource group. <0 means unlimited.
             * Default: -1.
             */
            maxRunningCount?: number;
        } & Record<string, any>;
        timeToLiveDeployments?: {
            /**
             * Default: "10m".
             */
            minimum?: string;
            /**
             * Default: "-1".
             */
            maximum?: string;
        } & Record<string, any>;
    } & Record<string, any>;
} & Record<string, any>;
//# sourceMappingURL=meta-ai-api.d.ts.map