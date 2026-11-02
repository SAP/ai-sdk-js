import nock from 'nock';

import {
  aiCoreDestination,
  mockClientCredentialsGrantCall,
  mockModelsList,
  parseMockResponse
} from '../../../../test-util/mock-http.ts';
import {
  filterFoundationModelsByCapability,
  filterFoundationModelsNonDeprecated,
  getFoundationModelLatestVersions,
  getModels
} from './model-discovery.ts';

import type { AiModelBaseData } from '../client/AI_CORE_API/index.ts';

describe('model discovery', () => {
  let mockModels: AiModelBaseData[];

  beforeAll(async () => {
    const response = await parseMockResponse<{
      count: number;
      resources: AiModelBaseData[];
    }>('ai-api', 'foundation-models-models.json');
    mockModels = response.resources;
  });

  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('getModels()', () => {
    it('fetches models from the foundation-models scenario by default', async () => {
      mockModelsList('foundation-models', {
        data: { count: 2, resources: mockModels }
      });
      const models = await getModels();
      expect(models).toHaveLength(2);
      expect(models[0].model).toBe('gpt-4o');
      expect(models[1].model).toBe('text-embedding-3-large');
    });

    it('fetches models from a custom scenario', async () => {
      mockModelsList('my-scenario', {
        data: { count: 1, resources: [mockModels[0]] }
      });
      const models = await getModels({ scenarioId: 'my-scenario' });
      expect(models).toHaveLength(1);
    });

    it('uses a custom resource group header', async () => {
      nock(aiCoreDestination.url, {
        reqheaders: { 'ai-resource-group': 'my-group' }
      })
        .get('/v2/lm/scenarios/foundation-models/models')
        .reply(200, { count: 2, resources: mockModels });

      const models = await getModels({ resourceGroup: 'my-group' });
      expect(models).toHaveLength(2);
    });

    it('wraps API errors with a descriptive message', async () => {
      nock(aiCoreDestination.url)
        .get('/v2/lm/scenarios/foundation-models/models')
        .reply(404, { message: 'Scenario not found' });

      await expect(getModels()).rejects.toThrow(
        "Failed to fetch models for scenario 'foundation-models'."
      );
    });
  });

  describe('filterFoundationModelsByCapability()', () => {
    it('returns models with the given capability', () => {
      const result = filterFoundationModelsByCapability(mockModels, 'vision');
      expect(result).toHaveLength(1);
      expect(result[0].model).toBe('gpt-4o');
    });

    it('returns an empty array when no models match', () => {
      const result = filterFoundationModelsByCapability(
        mockModels,
        'nonexistent'
      );
      expect(result).toHaveLength(0);
    });
  });

  describe('filterFoundationModelsNonDeprecated()', () => {
    it('removes deprecated versions from each model', () => {
      const result = filterFoundationModelsNonDeprecated(mockModels);
      const gpt4o = result.find(m => m.model === 'gpt-4o');
      expect(gpt4o).toBeDefined();
      expect(gpt4o!.versions).toHaveLength(1);
      expect(gpt4o!.versions[0].name).toBe('2024-11-20');
    });

    it('excludes models whose all versions are deprecated', () => {
      const allDeprecated: AiModelBaseData[] = [
        {
          model: 'old-model',
          executableId: 'azure-openai',
          description: 'Deprecated model',
          versions: [{ name: '1', isLatest: false, deprecated: true }]
        }
      ];
      const result = filterFoundationModelsNonDeprecated(allDeprecated);
      expect(result).toHaveLength(0);
    });

    it('keeps models that have at least one active version', () => {
      const result = filterFoundationModelsNonDeprecated(mockModels);
      expect(result).toHaveLength(2);
    });
  });

  describe('getFoundationModelLatestVersions()', () => {
    it('returns one entry per model', () => {
      const result = getFoundationModelLatestVersions(mockModels);
      expect(result).toHaveLength(2);
    });

    it('returns the version marked isLatest when present', () => {
      const result = getFoundationModelLatestVersions(mockModels);
      const gpt4o = result.find(r => r.model === 'gpt-4o');
      expect(gpt4o).toBeDefined();
      expect(gpt4o!.executableId).toBe('azure-openai');
      expect(gpt4o!.latestVersions).toHaveLength(1);
      expect(gpt4o!.latestVersions[0].name).toBe('2024-11-20');
      expect(gpt4o!.latestVersions[0].isLatest).toBe(true);
    });

    it('returns all versions when none is marked as latest', () => {
      const noLatest: AiModelBaseData[] = [
        {
          model: 'no-latest',
          executableId: 'azure-openai',
          description: 'No latest version',
          versions: [
            { name: '1', isLatest: false, deprecated: false },
            { name: '2', isLatest: false, deprecated: false }
          ]
        }
      ];
      const result = getFoundationModelLatestVersions(noLatest);
      expect(result).toHaveLength(1);
      expect(result[0].latestVersions).toHaveLength(2);
    });

    it('returns the single version even if not marked as latest', () => {
      const singleVersion: AiModelBaseData[] = [
        {
          model: 'single',
          executableId: 'azure-openai',
          description: 'Single version',
          versions: [{ name: '1', isLatest: false, deprecated: false }]
        }
      ];
      const result = getFoundationModelLatestVersions(singleVersion);
      expect(result).toHaveLength(1);
      expect(result[0].latestVersions).toHaveLength(1);
      expect(result[0].latestVersions[0].name).toBe('1');
    });
  });
});
