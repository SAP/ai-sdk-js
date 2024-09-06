import type { AiDeploymentTimeToLive } from './ai-deployment-time-to-live.js';
import type { AiConfigurationId } from './ai-configuration-id.js';
/**
 * Request object for creating an execution or an deployment
 */
export type AiDeploymentCreationRequest = {
    ttl?: AiDeploymentTimeToLive;
    configurationId: AiConfigurationId;
} & Record<string, any>;
//# sourceMappingURL=ai-deployment-creation-request.d.ts.map