import {
  predictWithSchema,
  predictWithSchemaCompressed
} from '@sap-ai-sdk/sample-code';
import { loadEnv } from './utils/load-env.js';

loadEnv();

describe('rpt', () => {
  it('should predict sales groups', async () => {
    const { predictions } = await predictWithSchema();
    expect(predictions.length).toBe(2);
    expect(predictions[0]).toMatchObject({
      SALESGROUP: expect.anything(),
      __row_idx__: '35'
    });
    expect(predictions[1]).toMatchObject({
      SALESGROUP: expect.anything(),
      __row_idx__: '571'
    });
  });

  const algorithms = ['gzip', 'brotli', 'deflate', 'zstd'] as const;

  algorithms.forEach(algorithm => {
    it(`should predict sales groups with ${algorithm} compression`, async () => {
      const { predictions } = await predictWithSchemaCompressed(algorithm);

      expect(predictions.length).toBe(2);
      expect(predictions[0]).toMatchObject({
        SALESGROUP: expect.anything(),
        __row_idx__: '35'
      });
      expect(predictions[1]).toMatchObject({
        SALESGROUP: expect.anything(),
        __row_idx__: '571'
      });
    });
  });
});
