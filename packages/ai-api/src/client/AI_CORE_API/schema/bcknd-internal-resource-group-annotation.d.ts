/**
 * Representation of the 'BckndInternalResourceGroupAnnotation' schema.
 */
export type BckndInternalResourceGroupAnnotation = {
    /**
     * @example "internal.ai.sap.com/my-annotation"
     * Max Length: 63.
     * Pattern: "^internal.ai.sap.com/(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]){1,43}$".
     */
    key: string;
    /**
     * Max Length: 5000.
     */
    value: string;
} & Record<string, any>;
//# sourceMappingURL=bcknd-internal-resource-group-annotation.d.ts.map