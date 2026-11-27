import nock from 'nock';

import {
  mockClientCredentialsGrantCall,
  mockDeploymentsList,
  mockInference
} from '../../../../test-util/mock-http.ts';
import { RptDecisionsClient } from './client.ts';

import type { SystemOneRequest, SystemOneResponse } from './types.ts';

const request: SystemOneRequest = {
  state: 'const add = (a, b) => a + b;',
  questions: {
    language: {
      type: 'choice',
      instructions: 'Is this Java or JavaScript?',
      criteria: { Java: 'Statically typed Java.', JavaScript: 'JavaScript.' }
    },
    executable: { type: 'noul', instructions: 'Is this executable code?' },
    complexity: {
      type: 'score',
      instructions: 'How complex is this code?',
      criteria: ['Simple', 'Complex']
    }
  },
  examples: [
    {
      state: 'public int add(int a, int b) { return a + b; }',
      answers: { language: 'Java', executable: true, complexity: 0 }
    },
    {
      state: 'const greet = name => console.log(name);',
      answers: { language: 'JavaScript', executable: true, complexity: 0 }
    }
  ]
};

const response: SystemOneResponse = {
  model: 'sap-rpt-decisions',
  answers: {
    language: {
      type: 'choice',
      choice: 'JavaScript',
      probabilities: { Java: 0.1, JavaScript: 0.9 },
      confidence: 0.8
    },
    executable: { type: 'noul', noul: 0.95 },
    complexity: {
      type: 'score',
      score: 0.1,
      legend: { '0': 'Simple', '1': 'Complex' },
      probabilities: { '0': 0.9, '1': 0.1 },
      confidence: 0.8
    }
  },
  metadata: {
    num_columns: 4,
    num_rows: 3,
    num_predictions: 3,
    num_query_rows: 1
  }
};

describe('rpt decisions', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should resolve a model deployment and preserve the request and response', async () => {
    const deploymentScope = mockDeploymentsList(
      { scenarioId: 'foundation-models', executableId: 'aicore-sap' },
      {
        id: 'decisions',
        model: { name: 'sap-rpt-decisions', version: 'latest' }
      }
    );
    const scope = mockInference(
      { data: request },
      { data: response, status: 200 },
      { url: 'inference/deployments/decisions/systemone' }
    );
    const result = await new RptDecisionsClient('sap-rpt-decisions').systemone(
      request
    );
    expect(result).toEqual(response);
    expect(deploymentScope.isDone()).toBe(true);
    expect(scope.isDone()).toBe(true);
  });

  it('should use an explicit deployment, resource group and request configuration', async () => {
    const scope = nock('https://api.ai.ml.hana.ondemand.com', {
      reqheaders: {
        'ai-resource-group': 'decisions-group',
        'x-request-id': 'test-request'
      }
    })
      .post('/v2/inference/deployments/explicit/systemone', request)
      .reply(200, response);

    const client = new RptDecisionsClient({
      deploymentId: 'explicit',
      resourceGroup: 'decisions-group'
    });
    expect(
      await client.systemone(request, {
        headers: { 'x-request-id': 'test-request' }
      })
    ).toEqual(response);
    expect(scope.isDone()).toBe(true);
  });

  it('should use a custom destination', async () => {
    const scope = nock('https://decisions.example.com', {
      reqheaders: { 'ai-resource-group': 'default' }
    })
      .post('/v2/inference/deployments/custom/systemone', request)
      .reply(200, response);
    const client = new RptDecisionsClient(
      { deploymentId: 'custom' },
      { url: 'https://decisions.example.com' }
    );
    expect(await client.systemone(request)).toEqual(response);
    expect(scope.isDone()).toBe(true);
  });

  it('should propagate service errors', async () => {
    const scope = mockInference(
      { data: request },
      { data: { error: { message: 'Invalid questions' } }, status: 422 },
      { url: 'inference/deployments/invalid/systemone' }
    );
    const client = new RptDecisionsClient({ deploymentId: 'invalid' });
    await expect(client.systemone(request)).rejects.toThrow(
      'Request failed with status code 422.'
    );
    expect(scope.isDone()).toBe(true);
  });
});
