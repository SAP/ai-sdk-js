import nock from 'nock';

import {
  mockClientCredentialsGrantCall,
  mockDeploymentsList,
  mockInference
} from '../../../test-util/mock-http.ts';
import { TabpfnClient } from './client.ts';

describe('tabpfn', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should send an inline JSON prediction using generated request types', async () => {
    mockDeploymentsList(
      { scenarioId: 'foundation-models', executableId: 'prior-labs' },
      { id: '1234', model: { name: 'tabpfn-3.5-plus', version: 'latest' } }
    );
    const requestSpy = mockInference(
      body => body.task_config.task === 'classification',
      {
        data: {
          prediction: [[0.83, 0.17]],
          metadata: {
            task: 'classification',
            test_set_num_rows: 1,
            test_set_num_cols: 2,
            package_version: '9a8f2c44',
            tabpfn_config: {}
          },
          usage: {
            X_train: { num_rows: 3, num_cols: 2, num_cells: 6 },
            y_train: { num_rows: 3, num_cols: 1, num_cells: 3 },
            X_test: { num_rows: 1, num_cols: 2, num_cells: 2 },
            n_estimators: 8,
            num_cells: 8,
            num_predictions: 1
          }
        },
        status: 200
      },
      { url: 'inference/deployments/1234/predict' }
    );

    const result = await new TabpfnClient('tabpfn-3.5-plus').predict({
      task_config: { task: 'classification' },
      X_train: { age: [42, 51, 29], tenure: [3, 9, 1] },
      y_train: { churn: [0, 1, 0] },
      X_test: { age: [37], tenure: [5] }
    });

    expect(requestSpy.isDone()).toBe(true);
    expect(result.prediction).toEqual([[0.83, 0.17]]);
  });

  it.each(['predictFiles'] as const)(
    'should send files and a plain JSON configuration field with %s',
    async method => {
      mockDeploymentsList(
        { scenarioId: 'foundation-models', executableId: 'prior-labs' },
        { id: '1234', model: { name: 'tabpfn-3.5-plus', version: 'latest' } }
      );
      const request = { task_config: { task: 'regression' as const } };
      const path = 'predict';
      const scope = nock('https://api.ai.ml.hana.ondemand.com', {
        reqheaders: { 'ai-resource-group': 'default' }
      })
        .post(`/v2/inference/deployments/1234/${path}`, body => {
          const text = body.toString();
          expect(text).toContain('name="x_test"');
          expect(text).toContain('application/vnd.apache.parquet');
          expect(text).toContain(JSON.stringify(request));
          expect(text).not.toMatch(/name="request"; filename=/);
          return true;
        })
        .reply(200, { prediction: [1.7] });
      const data = new Blob(['PAR1'], {
        type: 'application/vnd.apache.parquet'
      });
      const result = await new TabpfnClient('tabpfn-3.5-plus')[method]({
        x_train: data,
        y_train: data,
        x_test: data,
        request
      });
      expect(scope.isDone()).toBe(true);
      expect(result.prediction).toEqual([1.7]);
    }
  );
});
