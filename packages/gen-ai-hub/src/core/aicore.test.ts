import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import nock from 'nock';
import { resolveDeployment } from './aicore';

describe('AICore', () => {
  const destination: HttpDestination = {
    url: '/'
  };

  it('should be defined', () => {
    nock('/v2')
      .post(
        '/lm/deployments'
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
    expect(resolveDeployment({ scenarioId: 'foundation-models' }, destination)).toBeDefined();
  });
});
