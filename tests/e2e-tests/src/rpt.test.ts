import { predictWithSchema } from '@sap-ai-sdk/sample-code';
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
});
