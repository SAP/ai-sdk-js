import type { AiDeploymentModificationRequestWithIdentifier } from './ai-deployment-modification-request-with-identifier.js';
/**
 * Representation of the 'AiDeploymentModificationRequestList' schema.
 * @example [
 *   {
 *     "id": "aa97b177-9383-4934-8543-0f91a7a0283a",
 *     "targetStatus": "STOPPED"
 *   },
 *   {
 *     "id": "qweq32131-qwee-1231-8543-0f91a7a2e2e",
 *     "targetStatus": "DELETED"
 *   }
 * ]
 * Min Items: 1.
 * Max Items: 100.
 */
export type AiDeploymentModificationRequestList = Set<AiDeploymentModificationRequestWithIdentifier>;
//# sourceMappingURL=ai-deployment-modification-request-list.d.ts.map