import type { DSetUrl } from './d-set-url.js';
/**
 * Response for successful file creation
 */
export type DSetFileCreationResponse = {
    /**
     * File creation response message
     * @example "File creation acknowledged"
     */
    message: string;
    url: DSetUrl;
} & Record<string, any>;
//# sourceMappingURL=d-set-file-creation-response.d.ts.map