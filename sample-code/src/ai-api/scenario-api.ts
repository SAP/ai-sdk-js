import {
  ScenarioApi,
  getModels,
  getFoundationModelDeploymentId
} from '@sap-ai-sdk/ai-api';

import type {
  AiScenarioList,
  AiModelList,
  AiModelBaseData
} from '@sap-ai-sdk/ai-api';

/**
 * Get all scenarios.
 * @param resourceGroup - AI-Resource-Group where the resources are available.
 * @returns All scenarios.
 */
export async function getScenarios(
  resourceGroup: string
): Promise<AiScenarioList> {
  return ScenarioApi.scenarioQuery({
    'AI-Resource-Group': resourceGroup
  }).execute();
}

/**
 * Retrieve information about all models available in LLM global scenario.
 * @param scenarioId - ID of the global scenario.
 * @param resourceGroup - AI-Resource-Group where the resources are available.
 * @returns All models in given scenario.
 */
export async function getModelsInScenario(
  scenarioId: string,
  resourceGroup: string
): Promise<AiModelList> {
  return ScenarioApi.scenarioQueryModels(scenarioId, {
    'AI-Resource-Group': resourceGroup
  }).execute();
}

/**
 * Retrieve all available models from the foundation-models scenario using the convenience helper.
 * @returns All models available on Gen AI Hub.
 */
export async function getAllAvailableModels(): Promise<AiModelBaseData[]> {
  return getModels();
}

/**
 * Resolve the deployment ID for a specific foundation model.
 * @param modelName - Name of the model (e.g. 'gpt-4o').
 * @param executableId - Executable ID of the model (e.g. 'azure-openai').
 * @returns The deployment ID.
 */
export async function resolveModelDeploymentId(
  modelName: string,
  executableId: string
): Promise<string> {
  return getFoundationModelDeploymentId(modelName, executableId);
}
