import type { AiVersion } from './ai-version.js';
/**
 * Representation of the 'AiVersionList' schema.
 */
export type AiVersionList = {
    /**
     * Number of the resource instances in the list
     */
    count: number;
    resources: AiVersion[];
} & Record<string, any>;
//# sourceMappingURL=ai-version-list.d.ts.map