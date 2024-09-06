/**
 * Representation of the 'BckndInternalResourceGroupLabel' schema.
 */
export type BckndInternalResourceGroupLabel = {
    /**
     * @example "internal.ai.sap.com/my-label"
     * Max Length: 63.
     * Pattern: "^internal.ai.sap.com/(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]){1,43}$".
     */
    key: string;
    /**
     * Max Length: 5000.
     */
    value: string;
} & Record<string, any>;
//# sourceMappingURL=bcknd-internal-resource-group-label.d.ts.map