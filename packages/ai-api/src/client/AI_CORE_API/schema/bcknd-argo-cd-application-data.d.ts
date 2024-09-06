/**
 * Representation of the 'BckndArgoCDApplicationData' schema.
 */
export type BckndArgoCDApplicationData = {
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
    /**
     * ArgoCD application name
     * Max Length: 54.
     * Min Length: 3.
     * Pattern: "^[a-z0-9\\-]+$".
     */
    applicationName?: string;
} & Record<string, any>;
//# sourceMappingURL=bcknd-argo-cd-application-data.d.ts.map