import {
  predictWithSchema,
  predictWithSchemaCompressed,
  predictWithSchemaResilient,
  predictAutomaticParsing,
  predictParquetBlob,
  predictParquetFile
} from '@sap-ai-sdk/sample-code';

import { loadEnv } from './utils/load-env.ts';

import type { PredictResponsePayload } from '@sap-ai-sdk/rpt';

loadEnv();

describe('rpt', () => {
  function verifyPredictions(predictions: PredictResponsePayload[]) {
    expect(predictions.length).toBeGreaterThan(0);
    expect(predictions.length).toBe(2);
    expect(predictions[0]).toMatchObject({
      SALESGROUP: expect.anything(),
      __row_idx__: '35'
    });
    expect(predictions[1]).toMatchObject({
      SALESGROUP: expect.anything(),
      __row_idx__: '571'
    });
  }

  it('should predict sales groups', async () => {
    const { predictions } = await predictWithSchema();
    verifyPredictions(predictions);
  });

  it('should predict sales groups with automatic schema', async () => {
    const { predictions } = await predictAutomaticParsing();
    verifyPredictions(predictions);
  });

  it('should predict sales groups from Parquet file [Blob]', async () => {
    const { predictions } = await predictParquetBlob();
    verifyPredictions(predictions);
  });

  it('should predict sales groups from Parquet file [File]', async () => {
    const { predictions } = await predictParquetFile();
    verifyPredictions(predictions);
  });

  it('should predict sales groups with gzip compression', async () => {
    const { predictions } = await predictWithSchemaCompressed();

    verifyPredictions(predictions);
  });

  it('should predict sales groups with resilience middleware', async () => {
    const { predictions } = await predictWithSchemaResilient();

    verifyPredictions(predictions);
  });
});
