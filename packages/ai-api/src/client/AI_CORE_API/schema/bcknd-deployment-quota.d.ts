/**
 * Representation of the 'BckndDeploymentQuota' schema.
 */
export type BckndDeploymentQuota = {
    /**
     * The value can be 0(disabled) or a positive integer defining the maximum allowed number
     * @example 10
     */
    maxCount: number;
    maxReplicaPerDeployment: number;
} & Record<string, any>;
//# sourceMappingURL=bcknd-deployment-quota.d.ts.map