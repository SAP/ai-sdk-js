/**
 * Error Response
 */
export type DSetError = {
    /**
     * Min Length: 1.
     */
    code: string;
    /**
     * Min Length: 1.
     */
    message: string;
    /**
     * Min Length: 1.
     */
    target?: string;
    requestId?: string;
    details?: Set<{
        /**
         * Min Length: 1.
         */
        code: string;
        /**
         * Min Length: 1.
         */
        message: string;
    } & Record<string, any>>;
} & Record<string, any>;
//# sourceMappingURL=d-set-error.d.ts.map