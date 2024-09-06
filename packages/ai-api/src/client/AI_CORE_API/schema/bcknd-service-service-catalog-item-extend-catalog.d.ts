import type { BckndServiceServicePlanItem } from './bcknd-service-service-plan-item.js';
/**
 * Representation of the 'BckndServiceServiceCatalogItemExtendCatalog' schema.
 */
export type BckndServiceServiceCatalogItemExtendCatalog = {
    /**
     * if the service is bindable
     */
    bindable?: boolean;
    /**
     * description of the service
     */
    description?: string;
    /**
     * id of the service
     */
    id?: string;
    /**
     * name of the service
     */
    name?: string;
    plans?: BckndServiceServicePlanItem[];
} & Record<string, any>;
//# sourceMappingURL=bcknd-service-service-catalog-item-extend-catalog.d.ts.map