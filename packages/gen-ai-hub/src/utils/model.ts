import { AiDeployment } from '@sap-ai-sdk/ai-core';

/**
 * A foundation model is identified by its name and potentially a version.
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
  // TODO: this type does not seem to be correct (backend_details => backendDetails), check why
  deployment: AiDeployment
): FoundationModel | undefined {
  const model = deployment.details?.resources?.backend_details?.model;
  if (isFoundationModel(model)) {
    return model;
  }
}
