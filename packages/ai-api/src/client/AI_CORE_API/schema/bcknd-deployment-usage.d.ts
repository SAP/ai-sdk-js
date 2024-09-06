import type { BckndUsageResourcePlanItem } from './bcknd-usage-resource-plan-item.js';
/**
 * Representation of the 'BckndDeploymentUsage' schema.
 */
export type BckndDeploymentUsage = {
    count: number;
    resourcePlans: BckndUsageResourcePlanItem[];
} & Record<string, any>;
//# sourceMappingURL=bcknd-deployment-usage.d.ts.map