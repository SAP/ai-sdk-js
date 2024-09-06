import type { RTABackendDetails } from './rta-backend-details.js';
/**
 * Representation of the 'RTADeploymentDetails' schema.
 */
export type RTADeploymentDetails = {
    scaling?: RTABackendDetails;
    resources?: RTABackendDetails;
} & Record<string, any>;
//# sourceMappingURL=rta-deployment-details.d.ts.map