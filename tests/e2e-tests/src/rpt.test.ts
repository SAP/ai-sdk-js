import {
  predictWithSchema,
  predictAutomaticParsing,
  predictParquet
} from '@sap-ai-sdk/sample-code';
import { loadEnv } from './utils/load-env.js';
import type { PredictResponsePayload } from '@sap-ai-sdk/rpt';

loadEnv();

describe('rpt', () => {
  function verifyPredictions(
    predictions: PredictResponsePayload[],
    hasSchema: boolean = true
  ) {
    expect(predictions.length).toBeGreaterThan(0);
    expect(predictions.length).toBe(2);
    expect(predictions[0]).toMatchObject({
      SALESGROUP: expect.anything(),
      __row_idx__: hasSchema ? '35' : 35
    });
    expect(predictions[1]).toMatchObject({
      SALESGROUP: expect.anything(),
      __row_idx__: hasSchema ? '571' : 571
    });
  }

  it('should predict sales groups', async () => {
    const { predictions } = await predictWithSchema();
    verifyPredictions(predictions);
  });

  it('should predict sales groups with automatic schema ', async () => {
    const { predictions } = await predictAutomaticParsing();
    verifyPredictions(predictions, false);
  });

  it('should predict sales groups from Parquet file [Blob]', async () => {
    const { predictions } = await predictParquet('Blob');
    verifyPredictions(predictions);
  });

  it('should predict sales groups from Parquet file [File]', async () => {
    const { predictions } = await predictParquet('File');
    verifyPredictions(predictions);
  });
});
