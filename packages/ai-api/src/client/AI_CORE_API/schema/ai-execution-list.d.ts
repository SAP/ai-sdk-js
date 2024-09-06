import type { AiExecution } from './ai-execution.js';
/**
 * Representation of the 'AiExecutionList' schema.
 */
export type AiExecutionList = {
    /**
     * Number of the resource instances in the list
     */
    count: number;
    resources: AiExecution[];
} & Record<string, any>;
//# sourceMappingURL=ai-execution-list.d.ts.map