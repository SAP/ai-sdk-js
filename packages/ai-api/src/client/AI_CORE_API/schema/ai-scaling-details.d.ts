import type { AiBackendDetails } from './ai-backend-details.js';
/**
 * Scaling details of a deployment
 * @example {
 *   "backendDetails": {
 *     "predictor": {
 *       "minReplicas": 0,
 *       "maxReplicas": 2,
 *       "runningReplicas": 1
 *     }
 *   }
 * }
 */
export type AiScalingDetails = {
    backendDetails?: AiBackendDetails;
} & Record<string, any>;
//# sourceMappingURL=ai-scaling-details.d.ts.map