import type { BckndResourceGroupLabels } from './bcknd-resource-group-labels.js';
/**
 * Representation of the 'BckndResourceGroupsPostRequest' schema.
 */
export type BckndResourceGroupsPostRequest = {
    /**
     * resource group id
     * Max Length: 253.
     * Min Length: 3.
     * Pattern: "^[a-zA-Z0-9][a-zA-Z0-9.-]{1,251}[a-zA-Z0-9]$".
     */
    resourceGroupId?: string;
    labels?: BckndResourceGroupLabels;
} & Record<string, any>;
//# sourceMappingURL=bcknd-resource-groups-post-request.d.ts.map