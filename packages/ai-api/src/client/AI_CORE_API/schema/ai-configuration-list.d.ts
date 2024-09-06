import type { AiConfiguration } from './ai-configuration.js';
/**
 * Representation of the 'AiConfigurationList' schema.
 */
export type AiConfigurationList = {
    /**
     * Number of the resource instances in the list
     */
    count: number;
    resources: AiConfiguration[];
} & Record<string, any>;
//# sourceMappingURL=ai-configuration-list.d.ts.map