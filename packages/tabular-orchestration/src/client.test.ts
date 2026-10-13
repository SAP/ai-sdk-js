import nock from 'nock';

import {
  aiCoreDestination,
  mockClientCredentialsGrantCall,
  mockDeploymentsList,
  mockInference
} from '../../../test-util/mock-http.ts';
import { TabularOrchestrationClient } from './client.ts';

import type {
  PredictRequest,
  PredictResponse
} from './client/tabular-orchestration/index.ts';

const request: PredictRequest = {
  modelName: 'sap-rpt-1.6',
  scenarioConfigName: 'my-scenario',
  predictionConfig: { targetColumns: [{ name: 'salesgroup' }] },
  modelConfig: { index_column: 'id' },
  rows: [{ id: '1', product: 'Laptop', salesgroup: '[PREDICT]' }]
};

const response: PredictResponse = {
  id: 'prediction-id',
  metadata: {
    num_columns: 3,
    num_rows: 1,
    num_predictions: 1,
    num_query_rows: 1
  },
  predictions: [
    { id: '1', salesgroup: [{ prediction: 'Electronics', confidence: 0.9 }] }
  ],
  status: { code: 0, message: 'ok' }
};

describe('TabularOrchestrationClient', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('resolves the tabular-orchestration deployment and predicts', async () => {
    mockDeploymentsList(
      { scenarioId: 'tabular-orchestration' },
      { id: 'd123' }
    );
    const inferenceScope = mockInference(
      { data: request },
      { data: response, status: 200 },
      { url: 'inference/deployments/d123/predict' }
    );

    const result = await new TabularOrchestrationClient().predict(request);

    expect(result).toEqual(response);
    expect(inferenceScope.isDone()).toBe(true);
  });

  it('uses the given deployment ID and resource group without lookup', async () => {
    const inferenceScope = mockInference(
      { data: request },
      { data: response, status: 200 },
      {
        url: 'inference/deployments/d456/predict',
        resourceGroup: 'my-group'
      }
    );

    const result = await new TabularOrchestrationClient({
      deploymentId: 'd456',
      resourceGroup: 'my-group'
    }).predict(request);

    expect(result).toEqual(response);
    expect(inferenceScope.isDone()).toBe(true);
  });

  it('applies the custom request configuration', async () => {
    const inferenceScope = nock(aiCoreDestination.url, {
      reqheaders: {
        'ai-resource-group': 'default',
        'x-custom-header': 'custom-value'
      }
    })
      .post('/v2/inference/deployments/d789/predict', request)
      .reply(200, response);

    await new TabularOrchestrationClient({ deploymentId: 'd789' }).predict(
      request,
      { headers: { 'x-custom-header': 'custom-value' } }
    );

    expect(inferenceScope.isDone()).toBe(true);
  });

  it('throws if no deployment is running', async () => {
    mockDeploymentsList({
      scenarioId: 'tabular-orchestration',
      resourceGroup: 'empty-group'
    });

    await expect(
      new TabularOrchestrationClient({ resourceGroup: 'empty-group' }).predict(
        request
      )
    ).rejects.toThrow(/No deployment matched the given criteria/);
  });
});
