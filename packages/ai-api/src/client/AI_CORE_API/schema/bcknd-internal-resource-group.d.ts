import type { BckndInternalResourceGroupLabels } from './bcknd-internal-resource-group-labels.js';
import type { BckndInternalResourceGroupAnnotations } from './bcknd-internal-resource-group-annotations.js';
/**
 * Representation of the 'BckndInternalResourceGroup' schema.
 */
export type BckndInternalResourceGroup = {
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
    labels?: BckndInternalResourceGroupLabels;
    /**
     * aggregated status of the onboarding process
     */
    status: 'PROVISIONED' | 'ERROR' | 'PROVISIONING';
    /**
     * status message
     */
    statusMessage?: string;
    annotations?: BckndInternalResourceGroupAnnotations;
} & Record<string, any>;
//# sourceMappingURL=bcknd-internal-resource-group.d.ts.map