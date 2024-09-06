import type { AiId } from './ai-id.js';
import type { AiArtifactCreationResponseMessage } from './ai-artifact-creation-response-message.js';
import type { AiArtifactUrl } from './ai-artifact-url.js';
/**
 * Representation of the 'AiArtifactCreationResponse' schema.
 */
export type AiArtifactCreationResponse = {
    id: AiId;
    message: AiArtifactCreationResponseMessage;
    url: AiArtifactUrl;
} & Record<string, any>;
//# sourceMappingURL=ai-artifact-creation-response.d.ts.map