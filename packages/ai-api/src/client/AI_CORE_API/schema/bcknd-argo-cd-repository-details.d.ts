/**
 * Repository details
 */
export type BckndArgoCDRepositoryDetails = {
    /**
     * The name of the repository
     */
    name?: string;
    /**
     * The repository URL
     */
    url?: string;
    /**
     * The status of the repository's on-boarding
     * @example "COMPLETED"
     */
    status?: 'ERROR' | 'IN-PROGRESS' | 'COMPLETED';
} & Record<string, any>;
//# sourceMappingURL=bcknd-argo-cd-repository-details.d.ts.map