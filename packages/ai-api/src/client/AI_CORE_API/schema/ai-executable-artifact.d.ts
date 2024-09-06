import type { AiLabelList } from './ai-label-list.js';
/**
 * Representation of the 'AiExecutableArtifact' schema.
 */
export type AiExecutableArtifact = {
    /**
     * Name of the executable input artifacts
     */
    name: string;
    /**
     * Artifact kind (model, dataset, other)
     */
    kind?: string;
    /**
     * Description of the signature argument
     */
    description?: string;
    labels?: AiLabelList;
} & Record<string, any>;
//# sourceMappingURL=ai-executable-artifact.d.ts.map