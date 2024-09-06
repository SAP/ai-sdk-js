import type { AiExecutableId } from './ai-executable-id.js';
import type { AiModelVersionList } from './ai-model-version-list.js';
/**
 * Representation of the 'AiModelBaseData' schema.
 */
export type AiModelBaseData = {
    /**
     * Name of the model
     */
    model: string;
    executableId: AiExecutableId;
    /**
     * Description of the model and its capabilities
     */
    description: string;
    versions: AiModelVersionList;
} & Record<string, any>;
//# sourceMappingURL=ai-model-base-data.d.ts.map