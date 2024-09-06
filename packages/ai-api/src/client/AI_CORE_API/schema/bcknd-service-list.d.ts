import type { BckndService } from './bcknd-service.js';
/**
 * Representation of the 'BckndServiceList' schema.
 */
export type BckndServiceList = {
    /**
     * Number of the resource instances in the list
     */
    count: number;
    resources: BckndService[];
} & Record<string, any>;
//# sourceMappingURL=bcknd-service-list.d.ts.map