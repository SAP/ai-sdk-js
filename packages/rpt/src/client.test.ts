import { mockInference } from '../../../test-util/mock-http.js';
import { RptClient } from './client.js';

describe('rpt', () => {
  it('should transform body', async () => {
    const requestSpy = mockInference(
      {
        data: {
          product: { dtype: 'string' },
          id: { dtype: 'numeric' },
          production_date: { dtype: 'date' }
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
    new RptClient().predict(
      [
        { name: 'product', dtype: 'string' },
        { name: 'id', dtype: 'numeric' },
        { name: 'production_date', dtype: 'date' }
      ],
      {} as any
    );

    expect(requestSpy.isDone()).toBe(true);
  });
});
