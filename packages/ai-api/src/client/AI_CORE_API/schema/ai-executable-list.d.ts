import type { AiExecutable } from './ai-executable.js';
/**
 * Representation of the 'AiExecutableList' schema.
 */
export type AiExecutableList = {
    /**
     * Number of the resource instances in the list
     */
    count: number;
    resources: AiExecutable[];
} & Record<string, any>;
//# sourceMappingURL=ai-executable-list.d.ts.map