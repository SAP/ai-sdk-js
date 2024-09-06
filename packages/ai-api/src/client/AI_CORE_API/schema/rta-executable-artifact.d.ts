import type { RTAArtifactLabelList } from './rta-artifact-label-list.js';
/**
 * Input or output artifact
 */
export type RTAExecutableArtifact = {
    /**
     * Name of the signature argument
     */
    name: string;
    /**
     * Description of the signature argument
     * Max Length: 5000.
     */
    description?: string;
    /**
     * Kind of the artifact, i.e. model or dataset
     */
    kind?: string;
    labels?: RTAArtifactLabelList;
} & Record<string, any>;
//# sourceMappingURL=rta-executable-artifact.d.ts.map