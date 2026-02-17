import nock from 'nock';
import {
  mockInference,
  mockClientCredentialsGrantCall,
  mockDeploymentsList
} from '../../../test-util/mock-http.js';
import { RptClient } from './client.js';

describe('rpt', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should transform body', async () => {
    mockDeploymentsList(
      {
        scenarioId: 'foundation-models',
        executableId: 'aicore-sap'
      },
      { id: '1234', model: { name: 'sap-rpt-1-small', version: 'latest' } }
    );
    const requestSpy = mockInference(
      {
        data: {
          data_schema: {
            product: { dtype: 'string' },
            id: { dtype: 'numeric' },
            production_date: { dtype: 'date' }
          }
        }
      },
      {
        data: 'ok',
        status: 200
      },
      {
        url: 'inference/deployments/1234/predict'
      }
    );

    await new RptClient().predictWithSchema(
      [
        { name: 'product', dtype: 'string' },
        { name: 'id', dtype: 'numeric' },
        { name: 'production_date', dtype: 'date' }
      ],
      {} as any
    );
    expect(requestSpy.isDone()).toBe(true);
  });

  it('should transform body without schema', async () => {
    mockDeploymentsList(
      {
        scenarioId: 'foundation-models',
        executableId: 'aicore-sap'
      },
      { id: '1234', model: { name: 'sap-rpt-1-small', version: 'latest' } }
    );
    const requestSpy = mockInference(
      {
        data: {
          data_schema: null
        }
      },
      {
        data: 'ok',
        status: 200
      },
      {
        url: 'inference/deployments/1234/predict'
      }
    );

    await new RptClient().predictWithoutSchema({} as any);
    expect(requestSpy.isDone()).toBe(true);
  });

  it('should upload Parquet file with all parameters', async () => {
    mockDeploymentsList(
      {
        scenarioId: 'foundation-models',
        executableId: 'aicore-sap'
      },
      { id: '1234', model: { name: 'sap-rpt-1-small', version: 'latest' } }
    );

    const requestSpy = nock('https://api.ai.ml.hana.ondemand.com', {
      reqheaders: {
        'ai-resource-group': 'default'
      }
    })
      .post('/v2/inference/deployments/1234/predict_parquet', () => true)
      .reply(200, { predictions: [{ SALESGROUP: 'test' }] });

    const blob = new Blob(['fake parquet data']);
    const result = await new RptClient().predictParquet(
      blob,
      {
        target_columns: [
          { name: 'SALESGROUP', prediction_placeholder: '[PREDICT]' }
        ]
      },
      { index_column: '__row_idx__', parse_data_types: false }
    );

    expect(requestSpy.isDone()).toBe(true);
    expect(result.predictions).toEqual([{ SALESGROUP: 'test' }]);
  });

  // Only uses the required parameters, the Parquet file and the prediction configuration, only giving the mandatory first two paramters to the method.
  it('should upload Parquet file without optional parameters', async () => {
    mockDeploymentsList(
      {
        scenarioId: 'foundation-models',
        executableId: 'aicore-sap'
      },
      { id: '1234', model: { name: 'sap-rpt-1-small', version: 'latest' } }
    );

    const requestSpy = nock('https://api.ai.ml.hana.ondemand.com', {
      reqheaders: {
        'ai-resource-group': 'default'
      }
    })
      .post('/v2/inference/deployments/1234/predict_parquet', () => true)
      .reply(200, { predictions: [] });

    const blob = new Blob(['fake parquet data']);
    await new RptClient().predictParquet(blob, {
      target_columns: [
        { name: 'SALESGROUP', prediction_placeholder: '[PREDICT]' }
      ]
    });

    expect(requestSpy.isDone()).toBe(true);
  });
});
