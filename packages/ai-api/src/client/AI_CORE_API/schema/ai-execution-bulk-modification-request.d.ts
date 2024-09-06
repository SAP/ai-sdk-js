import type { AiExecutionModificationRequestList } from './ai-execution-modification-request-list.js';
/**
 * Request object to change status of multiple executions
 */
export type AiExecutionBulkModificationRequest = {
    executions?: AiExecutionModificationRequestList;
} & Record<string, any>;
//# sourceMappingURL=ai-execution-bulk-modification-request.d.ts.map