import type { AiId } from './ai-id.js';
import type { AiApiError } from './ai-api-error.js';
/**
 * Representation of the 'AiApiErrorWithId' schema.
 */
export type AiApiErrorWithId = {
    id: AiId;
    error: AiApiError;
} & Record<string, any>;
//# sourceMappingURL=ai-api-error-with-id.d.ts.map