import {
  listDataDestinations,
  createTabularArtifact,
  deleteTabularArtifact,
  getOrCreateScenarioConfiguration
} from '@sap-ai-sdk/sample-code';

import { loadEnv } from './utils/load-env.ts';

loadEnv();

describe('tabular-orchestration', () => {
  it('should list data destinations', async () => {
    const result = await listDataDestinations();
    expect(result.resources).toBeDefined();
  });

  it('should create, poll, and delete a tabular artifact', async () => {
    const name = `ai-sdk-tabular-artifact-${Date.now()}`;
    const artifact = await createTabularArtifact(name);
    expect(artifact.status).toBe('ACTIVE');
    await deleteTabularArtifact(name);
  }, 180_000);

  it('should get or create a scenario configuration', async () => {
    const config = await getOrCreateScenarioConfiguration();
    expect(config.name).toBeDefined();
    expect(config.contextSelectionStrategy).toBeDefined();
  });
});
