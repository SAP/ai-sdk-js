import type { AiBackendDetails } from './ai-backend-details.js';
/**
 * Resources details of a deployment
 * @example {
 *   "backendDetails": {
 *     "predictor": {
 *       "resourcePlan": "starter"
 *     }
 *   }
 * }
 */
export type AiResourcesDetails = {
    backendDetails?: AiBackendDetails;
} & Record<string, any>;
//# sourceMappingURL=ai-resources-details.d.ts.map