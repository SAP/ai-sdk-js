import type { BckndobjectStoreSecretStatus } from './bckndobject-store-secret-status.js';
/**
 * This represents a list of meta-data of a stored secret. The 'data' field of the secret is never retrieved.
 */
export type BckndobjectStoreSecretStatusResponse = {
    /**
     * Number of the resource instances in the list
     */
    count: number;
    resources: BckndobjectStoreSecretStatus[];
} & Record<string, any>;
//# sourceMappingURL=bckndobject-store-secret-status-response.d.ts.map