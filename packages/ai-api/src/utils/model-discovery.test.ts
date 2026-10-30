import nock from 'nock';

import {
  aiCoreDestination,
  mockClientCredentialsGrantCall,
  mockModelsList,
  parseMockResponse
} from '../../../../test-util/mock-http.ts';
import {
  filterByCapability,
  filterByOrchestrationCapability,
  filterNonDeprecated,
  getLatestVersions,
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

  describe('filterByOrchestrationCapability()', () => {
    it('returns models with the given orchestration capability', () => {
      const result = filterByOrchestrationCapability(mockModels, 'chat');
      expect(result).toHaveLength(1);
      expect(result[0].model).toBe('gpt-4o');
    });

    it('returns models with embedding orchestration capability', () => {
      const result = filterByOrchestrationCapability(mockModels, 'embedding');
      expect(result).toHaveLength(1);
      expect(result[0].model).toBe('text-embedding-3-large');
    });

    it('excludes deprecated-only versions when filtering', () => {
      // gpt-4o has 'image_generation' only on its non-deprecated version
      const result = filterByOrchestrationCapability(
        mockModels,
        'image_generation'
      );
      expect(result).toHaveLength(1);
      expect(result[0].model).toBe('gpt-4o');
    });

    it('returns an empty array when no models match', () => {
      const result = filterByOrchestrationCapability(mockModels, 'nonexistent');
      expect(result).toHaveLength(0);
    });
  });

  describe('filterByCapability()', () => {
    it('returns models with the given capability', () => {
      const result = filterByCapability(mockModels, 'vision');
      expect(result).toHaveLength(1);
      expect(result[0].model).toBe('gpt-4o');
    });

    it('returns an empty array when no models match', () => {
      const result = filterByCapability(mockModels, 'nonexistent');
      expect(result).toHaveLength(0);
    });
  });

  describe('filterNonDeprecated()', () => {
    it('removes deprecated versions from each model', () => {
      const result = filterNonDeprecated(mockModels);
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
      const result = filterNonDeprecated(allDeprecated);
      expect(result).toHaveLength(0);
    });

    it('keeps models that have at least one active version', () => {
      const result = filterNonDeprecated(mockModels);
      expect(result).toHaveLength(2);
    });
  });

  describe('getLatestVersions()', () => {
    it('returns one entry per model with isLatest: true', () => {
      const result = getLatestVersions(mockModels);
      expect(result).toHaveLength(2);
    });

    it('includes the model name, executableId, and the latest version object', () => {
      const result = getLatestVersions(mockModels);
      const gpt4o = result.find(r => r.model === 'gpt-4o');
      expect(gpt4o).toBeDefined();
      expect(gpt4o!.executableId).toBe('azure-openai');
      expect(gpt4o!.latestVersion.name).toBe('2024-11-20');
      expect(gpt4o!.latestVersion.isLatest).toBe(true);
    });

    it('excludes models with no version marked as latest', () => {
      const noLatest: AiModelBaseData[] = [
        {
          model: 'no-latest',
          executableId: 'azure-openai',
          description: 'No latest version',
          versions: [{ name: '1', isLatest: false, deprecated: false }]
        }
      ];
      const result = getLatestVersions(noLatest);
      expect(result).toHaveLength(0);
    });
  });
});
