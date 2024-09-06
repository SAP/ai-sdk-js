import type { BckndArgoCDApplicationData } from './bcknd-argo-cd-application-data.js';
/**
 * list of applications
 */
export type BckndAllArgoCDApplicationData = {
    /**
     * Number of the resource instances in the list
     */
    count: number;
    resources: BckndArgoCDApplicationData[];
} & Record<string, any>;
//# sourceMappingURL=bcknd-all-argo-cd-application-data.d.ts.map