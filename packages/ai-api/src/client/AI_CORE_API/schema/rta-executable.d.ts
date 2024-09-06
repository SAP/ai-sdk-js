import type { RTAExecutableId } from './rta-executable-id.js';
import type { RTAScenarioId } from './rta-scenario-id.js';
import type { RTAExecutableInputArtifactList } from './rta-executable-input-artifact-list.js';
import type { RTAExecutableOutputArtifactList } from './rta-executable-output-artifact-list.js';
import type { RTAExecutableParameterList } from './rta-executable-parameter-list.js';
import type { RTALabelList } from './rta-label-list.js';
/**
 * Entity having labels
 */
export type RTAExecutable = {
    id: RTAExecutableId;
    /**
     * Name of the executable
     */
    name: string;
    /**
     * Description of the executable
     */
    description?: string;
    scenarioId: RTAScenarioId;
    inputArtifacts?: RTAExecutableInputArtifactList;
    outputArtifacts?: RTAExecutableOutputArtifactList;
    parameters?: RTAExecutableParameterList;
    /**
     * Whether this pipeline is deployable
     */
    deployable: boolean;
    labels?: RTALabelList;
    /**
     * Timestamp of resource creation
     * Format: "date-time".
     */
    createdAt: string;
    /**
     * Timestamp of latest resource modification
     * Format: "date-time".
     */
    modifiedAt: string;
} & Record<string, any>;
//# sourceMappingURL=rta-executable.d.ts.map