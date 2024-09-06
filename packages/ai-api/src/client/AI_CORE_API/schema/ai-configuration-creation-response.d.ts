import type { AiId } from './ai-id.js';
import type { AiConfigurationCreationResponseMessage } from './ai-configuration-creation-response-message.js';
/**
 * Representation of the 'AiConfigurationCreationResponse' schema.
 */
export type AiConfigurationCreationResponse = {
    id: AiId;
    message: AiConfigurationCreationResponseMessage;
} & Record<string, any>;
//# sourceMappingURL=ai-configuration-creation-response.d.ts.map