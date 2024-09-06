import type { RTAArtifactName } from './rta-artifact-name.js';
import type { RTAArtifactUrl } from './rta-artifact-url.js';
import type { RTAArtifactSignature } from './rta-artifact-signature.js';
/**
 * Required for execution
 */
export type RTAInputArtifactArgumentBinding = {
    name: RTAArtifactName;
    url: RTAArtifactUrl;
    signature?: RTAArtifactSignature;
} & Record<string, any>;
//# sourceMappingURL=rta-input-artifact-argument-binding.d.ts.map