import type { AiArtifactId } from './ai-artifact-id.js';
/**
 * Required for execution
 * Result of activation
 *
 */
export type AiArtifactArgumentBinding = {
    /**
     * Max Length: 256.
     */
    key: string;
    artifactId: AiArtifactId;
} & Record<string, any>;
//# sourceMappingURL=ai-artifact-argument-binding.d.ts.map