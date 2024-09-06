import type { BckndGenericSecretData } from './bcknd-generic-secret-data.js';
/**
 * Representation of the 'BckndGenericSecretPostBody' schema.
 */
export type BckndGenericSecretPostBody = {
    /**
     * The name of the secret
     * Max Length: 252.
     * Min Length: 1.
     * Pattern: "^[a-z0-9\\-\\.]+$".
     */
    name: string;
    data: BckndGenericSecretData;
} & Record<string, any>;
//# sourceMappingURL=bcknd-generic-secret-post-body.d.ts.map