import type { BckndResourceGroup } from './bcknd-resource-group.js';
/**
 * Representation of the 'BckndResourceGroupList' schema.
 */
export type BckndResourceGroupList = {
    /**
     * Number of the resource instances in the list
     */
    count: number;
    resources: BckndResourceGroup[];
} & Record<string, any>;
//# sourceMappingURL=bcknd-resource-group-list.d.ts.map