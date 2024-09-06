/**
 * Representation of the 'BckndCommonResourceQuotaResponse' schema.
 */
export type BckndCommonResourceQuotaResponse = {
    usage?: {
        count?: number;
    } & Record<string, any>;
    quota: {
        /**
         * The value can be 0(disabled) or a positive integer defining the maximum allowed number
         * @example 10
         */
        maxCount?: number;
    } & Record<string, any>;
} & Record<string, any>;
//# sourceMappingURL=bcknd-common-resource-quota-response.d.ts.map