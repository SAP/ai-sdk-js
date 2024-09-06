import type { AiDeploymentTargetStatus } from './ai-deployment-target-status.js';
import type { AiConfigurationId } from './ai-configuration-id.js';
/**
 * Request object for changing the target status of a deployment (currently only STOPPED is supported)
 */
export type AiDeploymentModificationRequest = {
    targetStatus?: AiDeploymentTargetStatus;
    configurationId?: AiConfigurationId;
} & Record<string, any>;
//# sourceMappingURL=ai-deployment-modification-request.d.ts.map