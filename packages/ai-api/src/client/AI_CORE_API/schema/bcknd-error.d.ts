/**
 * Representation of the 'BckndError' schema.
 */
export type BckndError = {
    /**
     * Descriptive error code (not http status code)
     */
    code: string;
    /**
     * Plaintext error description
     * @example "something went wrong"
     */
    message: string;
    /**
     * ID of the individual request
     */
    requestId?: string;
    /**
     * Invoked URL
     */
    target?: string;
    /**
     * Optional details of the error message
     */
    details?: Record<string, any>;
} & Record<string, any>;
//# sourceMappingURL=bcknd-error.d.ts.map