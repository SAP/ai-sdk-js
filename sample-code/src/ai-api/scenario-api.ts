import {
    ScenarioApi,
    AiScenarioList,
    AiModelList
} from '@sap-ai-sdk/ai-api';

/**
 * Get all scenarios.
 * @param resourceGroup - AI-Resource-Group where the resources are available.
 * @returns All scenarios.
 */
export async function getScenarios(
    resourceGroup: string
  ): Promise<AiScenarioList> {
    const response = await ScenarioApi.scenarioQuery(
      { 'AI-Resource-Group': resourceGroup }
    ).execute();
  
    return response;
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
  const response = await ScenarioApi.modelsGet(
    scenarioId,
    { 'AI-Resource-Group': resourceGroup }
  ).execute();

  return response;
}