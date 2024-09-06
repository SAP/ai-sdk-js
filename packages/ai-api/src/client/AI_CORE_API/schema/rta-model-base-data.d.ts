import type { RTAExecutableId } from './rta-executable-id.js';
import type { RTAModelVersionList } from './rta-model-version-list.js';
/**
 * Representation of the 'RTAModelBaseData' schema.
 */
export type RTAModelBaseData = {
    /**
     * Name of the model
     */
    model: string;
    executableId: RTAExecutableId;
    /**
     * Description of the model and its capabilities
     */
    description: string;
    versions: RTAModelVersionList;
} & Record<string, any>;
//# sourceMappingURL=rta-model-base-data.d.ts.map