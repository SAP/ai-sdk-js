import { ScenarioApi } from '@sap-ai-sdk/ai-api';
import type { AiScenarioList, AiModelList } from '@sap-ai-sdk/ai-api';

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
  return ScenarioApi.modelsGet(scenarioId, {
    'AI-Resource-Group': resourceGroup
  }).execute();
}
