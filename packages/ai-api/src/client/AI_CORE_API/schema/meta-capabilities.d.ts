import type { MetaVersion } from './meta-version.js';
import type { MetaAiApi } from './meta-ai-api.js';
import type { MetaExtensions } from './meta-extensions.js';
/**
 * Representation of the 'MetaCapabilities' schema.
 */
export type MetaCapabilities = {
    /**
     * The name of the runtime
     * @example "aicore"
     */
    runtimeIdentifier?: string;
    runtimeApiVersion?: MetaVersion;
    description?: string;
    aiApi: MetaAiApi;
    extensions?: MetaExtensions;
} & Record<string, any>;
//# sourceMappingURL=meta-capabilities.d.ts.map