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

  it('should derive filenames only for supported blob types', async () => {
    mockDeploymentsList(
      { scenarioId: 'foundation-models', executableId: 'prior-labs' },
      { id: '1234', model: { name: 'tabpfn-3.5-plus', version: 'latest' } }
    );

    const requestScope = nock('https://api.ai.ml.hana.ondemand.com', {
      reqheaders: {
        'ai-resource-group': 'default'
      }
    })
      .post('/v2/inference/deployments/1234/predict', body => {
        const multipartBody = body.toString();
        expect(multipartBody).toMatch(
          /name="x_train"; filename="x_train\.csv"\r\nContent-Type: application\/octet-stream/
        );
        expect(multipartBody).toMatch(
          /name="y_train"; filename="y_train"\r\nContent-Type: application\/json/
        );
        expect(multipartBody).toMatch(
          /name="x_test"; filename="x_test\.parquet"\r\nContent-Type: application\/vnd\.apache\.parquet/
        );
        return true;
      })
      .reply(200, { prediction: [1.7, 2.2] });

    const result = await new TabpfnClient('tabpfn-3.5-plus').predictFiles({
      x_train: new Blob(['fake csv data']),
      y_train: new Blob(['unsupported'], { type: 'application/json' }),
      x_test: new Blob(['fake parquet data'], {
        type: 'application/vnd.apache.parquet'
      }),
      request: {
        task_config: {
          task: 'regression',
          predict_params: { output_type: 'mean' }
        }
      }
    });

    expect(requestScope.isDone()).toBe(true);
    expect(result.prediction).toEqual([1.7, 2.2]);
  });
});
