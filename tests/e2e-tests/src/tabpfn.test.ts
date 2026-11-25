import {
  predictClassification,
  predictRegression,
  predictRegressionQuantiles,
  predictFiles,
  predictResilient,
  predictWithStringFeatures
} from '@sap-ai-sdk/sample-code';
import { TabpfnClient } from '@sap-ai-sdk/tabpfn';

import { parquetWriteBuffer } from 'hyparquet-writer';

import { loadEnv } from './utils/load-env.ts';

import type { PredictResponse } from '@sap-ai-sdk/tabpfn';

loadEnv();

describe('tabpfn', () => {
  function verifyMetadata(
    response: PredictResponse,
    task: 'classification' | 'regression'
  ) {
    expect(response.metadata.task).toBe(task);
    expect(response.metadata.test_set_num_rows).toBeGreaterThan(0);
    expect(response.metadata.test_set_num_cols).toBeGreaterThan(0);
    expect(response.metadata.tabpfn_config).toEqual(expect.any(Object));
  }

  it('should predict classification probabilities', async () => {
    const response = await predictClassification();
    verifyMetadata(response, 'classification');
    expect(Array.isArray(response.prediction)).toBe(true);
  });

  it('should predict regression means', async () => {
    const response = await predictRegression();
    verifyMetadata(response, 'regression');
    expect(Array.isArray(response.prediction)).toBe(true);
  });

  it('should predict regression quantiles', async () => {
    const response = await predictRegressionQuantiles();
    verifyMetadata(response, 'regression');
    expect(Array.isArray(response.prediction)).toBe(true);
  });

  it('should predict from uploaded dataset files', async () => {
    const response = await predictFiles();
    verifyMetadata(response, 'classification');
    expect(Array.isArray(response.prediction)).toBe(true);
  });

  describe('Parquet endpoint', () => {
    const client = new TabpfnClient('tabpfn-3.5-plus');
    const request = {
      task_config: {
        task: 'classification' as const,
        predict_params: { output_type: 'probas' as const }
      }
    };

    const tables = {
      x_train: [
        { name: 'age', data: [42, 51, 29, 37, 33], type: 'INT32' as const },
        { name: 'tenure', data: [3, 9, 1, 5, 2], type: 'INT32' as const }
      ],
      y_train: [
        { name: 'churn', data: [0, 1, 0, 0, 1], type: 'INT32' as const }
      ],
      x_test: [
        { name: 'age', data: [37], type: 'INT32' as const },
        { name: 'tenure', data: [5], type: 'INT32' as const }
      ]
    };

    function parquet(columnData: (typeof tables)[keyof typeof tables]): Blob {
      return new Blob([parquetWriteBuffer({ columnData })], {
        type: 'application/vnd.apache.parquet'
      });
    }

    it('should predict from Parquet tables', async () => {
      const response = await client.predictParquet({
        request,
        x_train: parquet(tables.x_train),
        y_train: parquet(tables.y_train),
        x_test: parquet(tables.x_test)
      });
      verifyMetadata(response, 'classification');
      expect(response.prediction).toEqual([
        [expect.any(Number), expect.any(Number)]
      ]);
      expect(response.usage.num_predictions).toBe(1);
    });

    it.each(['x_train', 'y_train', 'x_test'] as const)(
      'should reject CSV in the %s part',
      async part => {
        const csv = {
          x_train: 'age,tenure\n42,3\n51,9\n29,1\n37,5\n33,2\n',
          y_train: 'churn\n0\n1\n0\n0\n1\n',
          x_test: 'age,tenure\n37,5\n'
        };
        await expect(
          client.predictParquet({
            request,
            x_train: parquet(tables.x_train),
            y_train: parquet(tables.y_train),
            x_test: parquet(tables.x_test),
            [part]: new File([csv[part]], `${part}.csv`, { type: 'text/csv' })
          })
        ).rejects.toMatchObject({ response: { status: 415 } });
      }
    );
  });

  it('should predict with resilience middleware', async () => {
    const response = await predictResilient();
    verifyMetadata(response, 'classification');
    expect(Array.isArray(response.prediction)).toBe(true);
  });

  it('should predict classification with string features using tabpfn-3.5-plus', async () => {
    const response = await predictWithStringFeatures();
    verifyMetadata(response, 'classification');
    expect(Array.isArray(response.prediction)).toBe(true);
  });
});
