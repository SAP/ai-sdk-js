import type { AiDeployment } from '../client/AI_CORE_API/index.js';

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

function isFoundationModel(
  model: Partial<FoundationModel> | undefined
): model is FoundationModel {
  return typeof model === 'object' && 'name' in model;
}

/**
 * Get the model information from a deployment.
 * @param deployment - AI core model deployment.
 * @returns The model information.
 * @internal
 */
export function extractModel(
  deployment: AiDeployment
): FoundationModel | undefined {
  const model = deployment.details?.resources?.backendDetails?.model;
  if (isFoundationModel(model)) {
    return model;
  }
}
