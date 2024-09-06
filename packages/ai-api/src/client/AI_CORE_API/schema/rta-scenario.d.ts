import type { RTAScenarioId } from './rta-scenario-id.js';
import type { RTALabelList } from './rta-label-list.js';
/**
 * Entity having labels
 */
export type RTAScenario = {
    id: RTAScenarioId;
    /**
     * Name of the scenario
     * Max Length: 256.
     */
    name: string;
    /**
     * Description of the scenario
     * Max Length: 5000.
     */
    description?: string;
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
//# sourceMappingURL=rta-scenario.d.ts.map