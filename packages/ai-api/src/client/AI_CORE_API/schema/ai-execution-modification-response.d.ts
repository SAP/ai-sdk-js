import type { AiId } from './ai-id.js';
import type { AiExecutionModificationResponseMessage } from './ai-execution-modification-response-message.js';
/**
 * Representation of the 'AiExecutionModificationResponse' schema.
 */
export type AiExecutionModificationResponse = {
    id: AiId;
    message: AiExecutionModificationResponseMessage;
} & Record<string, any>;
//# sourceMappingURL=ai-execution-modification-response.d.ts.map