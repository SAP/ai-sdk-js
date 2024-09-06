import type { BckndServiceServicePlanItemMetadata } from './bcknd-service-service-plan-item-metadata.js';
/**
 * Representation of the 'BckndServiceServicePlanItem' schema.
 */
export type BckndServiceServicePlanItem = {
    /**
     * description of the service plan
     */
    description?: string;
    /**
     * if the service plan free
     */
    free?: boolean;
    /**
     * id of the service plan
     */
    id?: string;
    /**
     * name of the service plan
     */
    name?: string;
    metadata?: BckndServiceServicePlanItemMetadata;
} & Record<string, any>;
//# sourceMappingURL=bcknd-service-service-plan-item.d.ts.map