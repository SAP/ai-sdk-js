import type { AiId } from './ai-id.js';
import type { AiExecutionCreationResponseMessage } from './ai-execution-creation-response-message.js';
import type { AiExecutionStatus } from './ai-execution-status.js';
/**
 * Representation of the 'AiExecutionCreationResponse' schema.
 */
export type AiExecutionCreationResponse = {
    id: AiId;
    message: AiExecutionCreationResponseMessage;
    status?: AiExecutionStatus;
} & Record<string, any>;
//# sourceMappingURL=ai-execution-creation-response.d.ts.map