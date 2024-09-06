/**
 * Common log record.
 */
export type AiLogCommonResultItem = {
    /**
     * Datetime in RFC 3339.
     * @example "2021-05-19T00:00:14.347+00:00"
     * Format: "date-time".
     */
    timestamp?: string;
    /**
     * message content.
     */
    msg?: string;
} & Record<string, any>;
//# sourceMappingURL=ai-log-common-result-item.d.ts.map