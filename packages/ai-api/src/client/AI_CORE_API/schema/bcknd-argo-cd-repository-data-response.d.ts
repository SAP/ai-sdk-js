import type { BckndArgoCDRepositoryDetails } from './bcknd-argo-cd-repository-details.js';
/**
 * This represents a list of GitOps repositories for the tenant.
 */
export type BckndArgoCDRepositoryDataResponse = {
    /**
     * Number of the resource instances in the list
     */
    count: number;
    resources: BckndArgoCDRepositoryDetails[];
} & Record<string, any>;
//# sourceMappingURL=bcknd-argo-cd-repository-data-response.d.ts.map