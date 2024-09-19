import { ScenarioApi } from '@sap-ai-sdk/ai-api';
import { loadEnv } from './utils/load-env.js';
import { resourceGroup } from './utils/ai-api-utils.js';

loadEnv();

describe('ScenarioApi', () => {
  it('should get list of available scenarios', async () => {
    const scenarios = await ScenarioApi.scenarioQuery({
      'AI-Resource-Group': resourceGroup
    }).execute();

    expect(scenarios).toBeDefined();
    const foundationModel = scenarios.resources.find(
      scenario => scenario.id === 'foundation-models'
    );
    expect(foundationModel).toBeDefined();
  });
});
