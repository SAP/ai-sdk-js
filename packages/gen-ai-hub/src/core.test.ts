import nock from 'nock';
import { resolveDeployment } from './core.js';
import { mockClientCredentialsGrantCall, mockAiCoreEnvVariable, aiCoreDestination } from '../../../test-util/mock-http.js';

describe('AICore', () => {
  beforeEach(() => {
    mockAiCoreEnvVariable();
    mockClientCredentialsGrantCall();
  });

  afterEach(() => {
    nock.cleanAll();
  });
  
  it('should be defined', async () => {
    nock(aiCoreDestination.url, {
      reqheaders: {
        'ai-resource-group': 'default'
      }})
      .get(
        '/v2/lm/deployments'
      )
      .query({ 'scenarioId': 'foundation-models', 'status': 'RUNNING' })
      .reply(200, {
        'count': 1,
        'resources': [
          {
            'configurationId': 'af7a5804-0820-4fbb-8e09-04837b204095',
            'configurationName': 'gpt-4-32k',
            'deploymentUrl': 'https://api.ai.staging.eu-west-1.mlf-aws-dev.com/v2/inference/deployments/d0d49e445e7df086',
            'details': {
              'resources': {
                'backend_details': {
                  'model': {
                    'name': 'gpt-4-32k',
                    'version': 'latest'
                  }
                }
              },
              'scaling': {
                'backend_details': {}
              }
            },
            'id': 'd0d49e445e7df086',
            'lastOperation': 'CREATE',
            'status': 'RUNNING'
          }]
      }
      );

      const result = await resolveDeployment({ scenarioId: 'foundation-models' });
      expect(result).toBeDefined();
      expect(result.id).toBe('d0d49e445e7df086');
      expect(result.configurationName).toBe('gpt-4-32k');
  });

  it('should throw on empty list', async () => {
    nock(aiCoreDestination.url, {
      reqheaders: {
        'ai-resource-group': 'default'
      }})
      .get(
        '/v2/lm/deployments'
      )
      .query({ 'scenarioId': 'foundation-models', 'status': 'RUNNING' })
      .reply(200, {
        'count': 0,
        'resources': []
      }
      );

      await expect(resolveDeployment({ scenarioId: 'foundation-models' })).rejects.toThrow('No deployment matched the given criteria');
  });
});