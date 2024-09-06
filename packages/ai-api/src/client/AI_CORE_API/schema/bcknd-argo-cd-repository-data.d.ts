/**
 * Representation of the 'BckndArgoCDRepositoryData' schema.
 */
export type BckndArgoCDRepositoryData = {
    /**
     * Name of the repository
     * Max Length: 51.
     * Min Length: 1.
     * Pattern: "^[a-z0-9\\-]+$".
     */
    name?: string;
    /**
     * URL of the repository to synchronise
     */
    url: string;
    /**
     * Username for read-access to the repository
     */
    username: string;
    /**
     * Password for read-access to the repository
     */
    password: string;
} & Record<string, any>;
//# sourceMappingURL=bcknd-argo-cd-repository-data.d.ts.map