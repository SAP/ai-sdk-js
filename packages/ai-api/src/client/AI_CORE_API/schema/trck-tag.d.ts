import type { TrckGenericName } from './trck-generic-name.js';
/**
 * A dictionary of name-value pairs to support segregation at execution level.
 * @example {
 *   "name": "Artifact Group",
 *   "value": "RFC-1"
 * }
 */
export type TrckTag = {
    name: TrckGenericName;
    /**
     * tag value
     * @example "RFC-1"
     * Max Length: 256.
     * Min Length: 1.
     */
    value: string;
} & Record<string, any>;
//# sourceMappingURL=trck-tag.d.ts.map