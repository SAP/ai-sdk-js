import type { AiLabelKey } from './ai-label-key.js';
import type { AiLabelValue } from './ai-label-value.js';
/**
 * Representation of the 'AiLabel' schema.
 */
export type AiLabel = {
    key: AiLabelKey;
    value: AiLabelValue;
} & Record<string, any>;
//# sourceMappingURL=ai-label.d.ts.map