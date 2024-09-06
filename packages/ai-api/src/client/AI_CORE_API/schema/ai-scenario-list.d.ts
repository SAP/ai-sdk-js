import type { AiScenario } from './ai-scenario.js';
/**
 * Representation of the 'AiScenarioList' schema.
 */
export type AiScenarioList = {
    /**
     * Number of the resource instances in the list
     */
    count: number;
    resources: AiScenario[];
} & Record<string, any>;
//# sourceMappingURL=ai-scenario-list.d.ts.map