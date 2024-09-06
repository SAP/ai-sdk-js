import type { AiArtifactArray } from './ai-artifact-array.js';
/**
 * Representation of the 'AiArtifactList' schema.
 */
export type AiArtifactList = {
    /**
     * Number of the resource instances in the list
     */
    count: number;
    resources: AiArtifactArray;
} & Record<string, any>;
//# sourceMappingURL=ai-artifact-list.d.ts.map