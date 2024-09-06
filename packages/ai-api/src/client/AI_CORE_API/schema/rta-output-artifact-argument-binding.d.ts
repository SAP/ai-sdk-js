import type { RTAArtifactName } from './rta-artifact-name.js';
import type { RTAArtifactUrl } from './rta-artifact-url.js';
/**
 * Result of execution
 */
export type RTAOutputArtifactArgumentBinding = {
    name: RTAArtifactName;
    url?: RTAArtifactUrl;
} & Record<string, any>;
//# sourceMappingURL=rta-output-artifact-argument-binding.d.ts.map