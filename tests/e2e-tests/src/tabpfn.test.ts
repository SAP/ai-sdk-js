import {
  predictClassification,
  predictRegression,
  predictRegressionQuantiles,
  predictFiles,
  predictResilient,
  predictWithStringFeatures
} from '@sap-ai-sdk/sample-code';

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
