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
  // this workaround fixes an error in AI Core, where the API spec calls it "backendDetails" but the service returns "backend_details
  // TODO: remove this workaround once fixed in AI Core (AIWDF-2124)
  const model = (
    deployment.details?.resources?.backendDetails ||
    deployment.details?.resources?.backend_details
  )?.model;
  if (isFoundationModel(model)) {
    return model;
  }
}
