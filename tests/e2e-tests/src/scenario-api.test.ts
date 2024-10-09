import { getScenarios, getModelsInScenario } from '@sap-ai-sdk/sample-code';
import { loadEnv } from './utils/load-env.js';
import { resourceGroup } from './utils/ai-api-utils.js';

loadEnv();

describe('ScenarioApi', () => {
  it('should get list of available scenarios', async () => {
    const scenarios = await getScenarios(resourceGroup);

    expect(scenarios).toBeDefined();
    const foundationModel = scenarios.resources.find(
      scenario => scenario.id === 'foundation-models'
    );
    expect(foundationModel).toBeDefined();
  });

  it('should get list of all models available in `foundation-models` scenario', async () => {
    const models = await getModelsInScenario(
      'foundation-models',
      resourceGroup
    );
    expect(models).toBeDefined();
  });
});
