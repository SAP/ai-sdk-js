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
});
