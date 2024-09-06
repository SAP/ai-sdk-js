import type { AiVersionDescription } from './ai-version-description.js';
import type { AiVersionId } from './ai-version-id.js';
import type { AiScenarioId } from './ai-scenario-id.js';
/**
 * Representation of the 'AiVersion' schema.
 */
export type AiVersion = {
    description?: AiVersionDescription;
    id: AiVersionId;
    scenarioId?: AiScenarioId;
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
//# sourceMappingURL=ai-version.d.ts.map