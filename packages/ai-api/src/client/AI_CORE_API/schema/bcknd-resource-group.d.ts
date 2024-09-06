import type { BckndResourceGroupLabels } from './bcknd-resource-group-labels.js';
/**
 * Representation of the 'BckndResourceGroup' schema.
 */
export type BckndResourceGroup = {
    /**
     * resource group id
     */
    resourceGroupId: string;
    /**
     * tenant id
     */
    tenantId?: string;
    /**
     * zone id
     */
    zoneId?: string;
    /**
     * Timestamp of resource group creation
     * Format: "date-time".
     */
    createdAt: string;
    labels?: BckndResourceGroupLabels;
    /**
     * aggregated status of the onboarding process
     */
    status: 'PROVISIONED' | 'ERROR' | 'PROVISIONING';
    /**
     * status message
     */
    statusMessage?: string;
} & Record<string, any>;
//# sourceMappingURL=bcknd-resource-group.d.ts.map