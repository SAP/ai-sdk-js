import type { AiDeploymentId } from './ai-deployment-id.js';
/**
 * Request object for changing the target status of a deployment ( STOPPED and DELETED are supported)
 */
export type AiDeploymentModificationRequestWithIdentifier = {
    id: AiDeploymentId;
    /**
     * Deployment target status
     */
    targetStatus: 'STOPPED' | 'DELETED';
} & Record<string, any>;
//# sourceMappingURL=ai-deployment-modification-request-with-identifier.d.ts.map