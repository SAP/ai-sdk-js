import type { BcknddockerRegistrySecretStatus } from './bcknddocker-registry-secret-status.js';
/**
 * This represents a list of meta-data of a stored secret. The 'data' field of the secret is never retrieved.
 */
export type BcknddockerRegistrySecretStatusResponse = {
    /**
     * Number of the resource instances in the list
     */
    count: number;
    resources: BcknddockerRegistrySecretStatus[];
} & Record<string, any>;
//# sourceMappingURL=bcknddocker-registry-secret-status-response.d.ts.map