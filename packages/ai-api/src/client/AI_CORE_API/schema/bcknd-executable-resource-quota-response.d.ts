/**
 * Representation of the 'BckndExecutableResourceQuotaResponse' schema.
 */
export type BckndExecutableResourceQuotaResponse = {
    usage?: {
        servingTemplateCount?: number;
        workflowTemplateCount?: number;
    } & Record<string, any>;
    quota: {
        /**
         * The value can be 0(disabled) or a positive integer defining the maximum allowed number
         * @example 10
         */
        servingTemplateMaxCount?: number;
        /**
         * The value can be 0(disabled) or a positive integer defining the maximum allowed number
         * @example 10
         */
        workflowTemplateMaxCount?: number;
    } & Record<string, any>;
} & Record<string, any>;
//# sourceMappingURL=bcknd-executable-resource-quota-response.d.ts.map