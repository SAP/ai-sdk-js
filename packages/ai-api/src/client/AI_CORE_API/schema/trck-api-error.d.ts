import type { TrckDetailsErrorResponse } from './trck-details-error-response.js';
/**
 * Representation of the 'TrckApiError' schema.
 */
export type TrckApiError = {
    /**
     * Descriptive error code (not http status code).
     */
    code: string;
    /**
     * plaintext error description
     */
    message: string;
    /**
     * id of individual request
     */
    requestId?: string;
    /**
     * url that has been called
     */
    target?: string;
    details?: TrckDetailsErrorResponse[];
} & Record<string, any>;
//# sourceMappingURL=trck-api-error.d.ts.map