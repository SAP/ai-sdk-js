/**
 * Representation of the 'BckndEvent' schema.
 */
export type BckndEvent = {
    /**
     * tenant id
     */
    tenantId?: string;
    action?: 'PROVISION' | 'DEPROVISION';
    state?: 'SUCCESSFUL' | 'FAILED' | 'PENDING';
    /**
     * describes the event state
     */
    description?: string;
    /**
     * @example "2017-09-28T08:56:23.275Z"
     * Format: "date-time".
     */
    createdAt?: string;
} & Record<string, any>;
//# sourceMappingURL=bcknd-event.d.ts.map