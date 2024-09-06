import type { AiConfigurationName } from './ai-configuration-name.js';
import type { AiExecutableId } from './ai-executable-id.js';
import type { AiScenarioId } from './ai-scenario-id.js';
import type { AiParameterArgumentBindingList } from './ai-parameter-argument-binding-list.js';
import type { AiArtifactArgumentBindingList } from './ai-artifact-argument-binding-list.js';
/**
 * Representation of the 'AiConfigurationBaseData' schema.
 */
export type AiConfigurationBaseData = {
    name: AiConfigurationName;
    executableId: AiExecutableId;
    scenarioId: AiScenarioId;
    parameterBindings?: AiParameterArgumentBindingList;
    inputArtifactBindings?: AiArtifactArgumentBindingList;
} & Record<string, any>;
//# sourceMappingURL=ai-configuration-base-data.d.ts.map