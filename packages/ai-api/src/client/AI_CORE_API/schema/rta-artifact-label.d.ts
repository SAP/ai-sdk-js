/**
 * Representation of the 'RTAArtifactLabel' schema.
 */
export type RTAArtifactLabel = {
    /**
     * @example "ext.ai.sap.com/s4hana-version"
     * Max Length: 256.
     * Pattern: "^ext\\.ai\\.sap\\.com\\/[\\w\\.-]+$".
     */
    key: string;
    /**
     * Max Length: 5000.
     */
    value: string;
} & Record<string, any>;
//# sourceMappingURL=rta-artifact-label.d.ts.map