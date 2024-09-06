/**
 * Representation of the 'BckndArgoCDApplicationBaseData' schema.
 */
export type BckndArgoCDApplicationBaseData = {
    /**
     * URL of the repository to synchronise
     */
    repositoryUrl: string;
    /**
     * revision to synchronise
     */
    revision: string;
    /**
     * path within the repository to synchronise
     */
    path: string;
} & Record<string, any>;
//# sourceMappingURL=bcknd-argo-cd-application-base-data.d.ts.map