import nock from 'nock';
import {
  mockInference,
  mockClientCredentialsGrantCall,
  mockDeploymentsList
} from '../../../test-util/mock-http.ts';
import { RptClient } from './client.ts';

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
          },
          parse_data_types: true
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

    await new RptClient('sap-rpt-1-small').predictWithSchema(
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
          data_schema: null,
          parse_data_types: true
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

    await new RptClient('sap-rpt-1-small').predictWithoutSchema({} as any);
    expect(requestSpy.isDone()).toBe(true);
  });

  it('should upload Parquet file', async () => {
    mockDeploymentsList(
      {
        scenarioId: 'foundation-models',
        executableId: 'aicore-sap'
      },
      { id: '1234', model: { name: 'sap-rpt-1-small', version: 'latest' } }
    );

    const requestScope = nock('https://api.ai.ml.hana.ondemand.com', {
      reqheaders: {
        'ai-resource-group': 'default'
      }
    })
      .post('/v2/inference/deployments/1234/predict_parquet', () => true)
      .reply(200, { predictions: [{ SALESGROUP: 'test' }] });

    const blob = new Blob(['fake parquet data']);
    const result = await new RptClient('sap-rpt-1-small').predictParquet({
      file: blob,
      prediction_config: {
        target_columns: [
          { name: 'SALESGROUP', prediction_placeholder: '[PREDICT]' }
        ]
      },
      index_column: '__row_idx__',
      parse_data_types: false
    });

    expect(requestScope.isDone()).toBe(true);
    expect(result.predictions).toEqual([{ SALESGROUP: 'test' }]);
  });

  it('should respect explicit parse_data_types: false for RPT-1.0 models', async () => {
    mockDeploymentsList(
      { scenarioId: 'foundation-models', executableId: 'aicore-sap' },
      { id: '1234', model: { name: 'sap-rpt-1-small', version: 'latest' } }
    );
    const requestSpy = mockInference(
      { data: { data_schema: null, parse_data_types: false } },
      { data: 'ok', status: 200 },
      { url: 'inference/deployments/1234/predict' }
    );

    await new RptClient('sap-rpt-1-small').predictWithoutSchema({
      parse_data_types: false
    } as any);
    expect(requestSpy.isDone()).toBe(true);
  });

  it('should not inject parse_data_types for RPT-1.5 models', async () => {
    mockDeploymentsList(
      { scenarioId: 'foundation-models', executableId: 'aicore-sap' },
      { id: '5678', model: { name: 'sap-rpt-1.5', version: 'latest' } }
    );
    const requestSpy = mockInference(
      { data: { data_schema: null } },
      { data: 'ok', status: 200 },
      { url: 'inference/deployments/5678/predict' }
    );

    await new RptClient('sap-rpt-1.5').predictWithoutSchema({} as any);
    expect(requestSpy.isDone()).toBe(true);
  });
});
