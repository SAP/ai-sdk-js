/**
 * Representation of the 'RTALabel' schema.
 */
export type RTALabel = {
    /**
     * @example "ai.sap.com/scenarioName"
     * Pattern: "^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)*ai\\.sap\\.com\\/[\\w\\.-]+$".
     */
    key: string;
    /**
     * Max Length: 5000.
     */
    value: string;
} & Record<string, any>;
//# sourceMappingURL=rta-label.d.ts.map