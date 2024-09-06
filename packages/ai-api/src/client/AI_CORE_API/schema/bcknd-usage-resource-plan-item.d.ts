import type { BckndNestedUsageItem } from './bcknd-nested-usage-item.js';
/**
 * Representation of the 'BckndUsageResourcePlanItem' schema.
 */
export type BckndUsageResourcePlanItem = {
    plan: string;
    count: number;
    usage: BckndNestedUsageItem[];
} & Record<string, any>;
//# sourceMappingURL=bcknd-usage-resource-plan-item.d.ts.map