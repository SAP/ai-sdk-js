import { AiDeployment } from '../client/AI_CORE_API/index.js';
/**
 * A foundation model is identified by its name and optionally a version.
 * @internal
 */
export interface FoundationModel {
    /**
     * The name of the model.
     */
    name: string;
    /**
     * The version of the model.
     */
    version?: string;
}
/**
 * Get the model information from a deployment.
 * @param deployment - AI core model deployment.
 * @returns The model information.
 * @internal
 */
export declare function extractModel(deployment: AiDeployment): FoundationModel | undefined;
//# sourceMappingURL=model.d.ts.map