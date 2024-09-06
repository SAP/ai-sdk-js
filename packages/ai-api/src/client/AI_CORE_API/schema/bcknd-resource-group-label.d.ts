/**
 * Representation of the 'BckndResourceGroupLabel' schema.
 */
export type BckndResourceGroupLabel = {
    /**
     * @example "ext.ai.sap.com/my-label"
     * Max Length: 63.
     * Pattern: "^ext.ai.sap.com/(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]){1,48}$".
     */
    key: string;
    /**
     * Max Length: 5000.
     */
    value: string;
} & Record<string, any>;
//# sourceMappingURL=bcknd-resource-group-label.d.ts.map