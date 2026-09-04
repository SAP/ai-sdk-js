import * as httpClient from '@sap-cloud-sdk/http-client';

import nock from 'nock';
import { vi } from 'vitest';

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
          rows: []
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
      { rows: [] } as any
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
          rows: []
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

    await new RptClient('sap-rpt-1-small').predictWithoutSchema({
      rows: []
    } as any);
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
      { data: { data_schema: null, parse_data_types: false, rows: [] } },
      { data: 'ok', status: 200 },
      { url: 'inference/deployments/1234/predict' }
    );

    await new RptClient('sap-rpt-1-small').predictWithoutSchema({
      parse_data_types: false,
      rows: []
    } as any);
    expect(requestSpy.isDone()).toBe(true);
  });

  it('should not inject parse_data_types for RPT-1.5 models', async () => {
    mockDeploymentsList(
      { scenarioId: 'foundation-models', executableId: 'aicore-sap' },
      { id: '5678', model: { name: 'sap-rpt-1.5', version: 'latest' } }
    );
    const requestSpy = mockInference(
      { data: { data_schema: null, rows: [] } },
      { data: 'ok', status: 200 },
      { url: 'inference/deployments/5678/predict' }
    );

    await new RptClient('sap-rpt-1.5').predictWithoutSchema({ rows: [] } as any);
    expect(requestSpy.isDone()).toBe(true);
  });

  it('should not inject parse_data_types when only a deployment ID is given', async () => {
    const requestSpy = mockInference(
      { data: { data_schema: null, rows: [] } },
      { data: 'ok', status: 200 },
      { url: 'inference/deployments/1234/predict' }
    );

    await new RptClient({ deploymentId: '1234' }).predictWithoutSchema(
      { rows: [] } as any
    );
    expect(requestSpy.isDone()).toBe(true);
  });

  it('should serialize boolean values in rows to strings', async () => {
    mockDeploymentsList(
      { scenarioId: 'foundation-models', executableId: 'aicore-sap' },
      { id: '5678', model: { name: 'sap-rpt-1.5', version: 'latest' } }
    );
    const requestSpy = mockInference(
      (body: any) =>
        body.rows?.[0].active === 'true' && body.rows?.[1].active === 'false',
      { data: 'ok', status: 200 },
      { url: 'inference/deployments/5678/predict' }
    );

    await new RptClient('sap-rpt-1.5').predictWithoutSchema({
      rows: [{ active: true }, { active: false }]
    } as any);
    expect(requestSpy.isDone()).toBe(true);
  });

  it('should serialize boolean values in columns to strings', async () => {
    mockDeploymentsList(
      { scenarioId: 'foundation-models', executableId: 'aicore-sap' },
      { id: '5678', model: { name: 'sap-rpt-1.5', version: 'latest' } }
    );
    const requestSpy = mockInference(
      (body: any) =>
        body.columns?.active?.[0] === 'true' &&
        body.columns?.active?.[1] === 'false',
      { data: 'ok', status: 200 },
      { url: 'inference/deployments/5678/predict' }
    );

    await new RptClient('sap-rpt-1.5').predictWithoutSchema({
      columns: { active: [true, false] }
    } as any);
    expect(requestSpy.isDone()).toBe(true);
  });
});

describe('rpt compression', () => {
  let compressSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockClientCredentialsGrantCall();
    compressSpy = vi.spyOn(httpClient, 'compress');
  });

  afterEach(() => {
    nock.cleanAll();
    vi.restoreAllMocks();
  });

  it('should default to compression level 1', async () => {
    mockDeploymentsList(
      { scenarioId: 'foundation-models', executableId: 'aicore-sap' },
      { id: '1234', model: { name: 'sap-rpt-1-small', version: 'latest' } }
    );
    mockInference(
      () => true,
      { data: 'ok', status: 200 },
      { url: 'inference/deployments/1234/predict' }
    );

    await new RptClient('sap-rpt-1-small').predictWithoutSchema({
      rows: []
    } as any);

    expect(compressSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        compressOptions: expect.objectContaining({ level: 1 })
      })
    );
  });

  it('should allow overriding the compression level', async () => {
    mockDeploymentsList(
      { scenarioId: 'foundation-models', executableId: 'aicore-sap' },
      { id: '1234', model: { name: 'sap-rpt-1-small', version: 'latest' } }
    );
    mockInference(
      () => true,
      { data: 'ok', status: 200 },
      { url: 'inference/deployments/1234/predict' }
    );

    await new RptClient('sap-rpt-1-small').predictWithoutSchema(
      { rows: [] } as any,
      {
        compress: { mode: 'always', compressOptions: { level: 6 } }
      }
    );

    expect(compressSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        compressOptions: expect.objectContaining({ level: 6 })
      })
    );
  });
});
