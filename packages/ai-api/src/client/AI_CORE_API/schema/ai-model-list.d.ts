import type { AiModelBaseData } from './ai-model-base-data.js';
/**
 * Representation of the 'AiModelList' schema.
 */
export type AiModelList = {
    /**
     * Number of the resource instances in the list
     */
    count: number;
    resources: AiModelBaseData[];
} & Record<string, any>;
//# sourceMappingURL=ai-model-list.d.ts.map