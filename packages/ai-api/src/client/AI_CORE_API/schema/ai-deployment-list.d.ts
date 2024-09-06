import type { AiDeployment } from './ai-deployment.js';
/**
 * Representation of the 'AiDeploymentList' schema.
 */
export type AiDeploymentList = {
    /**
     * Number of the resource instances in the list
     */
    count: number;
    resources: AiDeployment[];
} & Record<string, any>;
//# sourceMappingURL=ai-deployment-list.d.ts.map