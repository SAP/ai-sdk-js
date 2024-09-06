import type { AiExecutionId } from './ai-execution-id.js';
/**
 * Request object for changing the target status of an execution (currently STOPPED and DELETED are supported)
 */
export type AiExecutionModificationRequestWithIdentifier = {
    id: AiExecutionId;
    /**
     * Desired target status of the execution (currently STOPPED and DELETED are supported)
     */
    targetStatus: 'STOPPED' | 'DELETED';
} & Record<string, any>;
//# sourceMappingURL=ai-execution-modification-request-with-identifier.d.ts.map