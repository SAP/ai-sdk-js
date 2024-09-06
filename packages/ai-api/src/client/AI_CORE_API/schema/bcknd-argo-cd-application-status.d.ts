/**
 * ArgoCD application definition and status
 */
export type BckndArgoCDApplicationStatus = {
    /**
     * ArgoCD application health status
     */
    healthStatus?: string;
    /**
     * ArgoCD application sync status
     */
    syncStatus?: string;
    /**
     * ArgoCD application health status message
     */
    message?: string;
    /**
     * Information about the ArgoCD application itself
     */
    source?: {
        /**
         * URL of the repository
         */
        repoURL?: string;
        /**
         * Path of the repository
         */
        path?: string;
        /**
         * Revision number of the ArgoCD application
         */
        revision?: string;
    } & Record<string, any>;
    /**
     * Gets the timestamp information related to the sync state of the ArgoCD application
     */
    syncFinishedAt?: string;
    /**
     * Get timestamp information related to the sync state of the ArgoCD application
     */
    syncStartedAt?: string;
    /**
     * Get timestamp information related to the sync state of the ArgoCD application
     */
    reconciledAt?: string;
    /**
     * Status of all resources that need to be synchronized with the gitops repo
     */
    syncResourcesStatus?: ({
        /**
         * ArgoCD application object name
         */
        name?: string;
        /**
         * ArgoCD application object kind
         */
        kind?: string;
        /**
         * ArgoCD application object sync status
         */
        status?: string;
        /**
         * ArgoCD application object message
         */
        message?: string;
    } & Record<string, any>)[];
    /**
     * Status of all resources that need to be synchronized with the gitops repo. Misspelled and deprecated, use syncResourcesStatus instead.
     * @deprecated
     */
    syncRessourcesStatus?: ({
        /**
         * ArgoCD application object name
         */
        name?: string;
        /**
         * ArgoCD application object kind
         */
        kind?: string;
        /**
         * ArgoCD application object sync status
         */
        status?: string;
        /**
         * ArgoCD application object message
         */
        message?: string;
    } & Record<string, any>)[];
} & Record<string, any>;
//# sourceMappingURL=bcknd-argo-cd-application-status.d.ts.map