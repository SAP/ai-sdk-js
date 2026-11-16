import {
  listDataDestinations,
  createTabularArtifact,
  deleteTabularArtifact,
  getOrCreateScenarioConfiguration,
  predictWithScenarioContext,
  predictWithInlineContext
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
    expect(config.status).toBe('ACTIVE');
  });

  it('should predict sales groups with context from a scenario configuration', async () => {
    const { metadata, predictions, status } =
      await predictWithScenarioContext();
    expect(status.code).toBe(0);
    expect(metadata.num_query_rows).toBe(2);
    expect(predictions).toHaveLength(2);
    expect(predictions[0]).toMatchObject({
      id: '1001',
      salesgroup: [{ prediction: expect.any(String) }]
    });
  });

  it('should predict sales groups with inline context rows', async () => {
    const { metadata, predictions, status } = await predictWithInlineContext();
    expect(status.code).toBe(0);
    expect(metadata.num_rows).toBe(5);
    expect(predictions).toHaveLength(2);
    expect(predictions[0]).toMatchObject({
      id: '35',
      salesgroup: [{ prediction: expect.any(String) }]
    });
  });
});
