import type { BckndGenericSecretDetails } from './bcknd-generic-secret-details.js';
/**
 * This represents a list of meta-data of the secret. The 'data' field of the secret is never retrieved.
 */
export type BckndListGenericSecretsResponse = {
    /**
     * Number of the resource instances in the list
     */
    count: number;
    resources: BckndGenericSecretDetails[];
} & Record<string, any>;
//# sourceMappingURL=bcknd-list-generic-secrets-response.d.ts.map