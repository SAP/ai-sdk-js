import retry from 'async-retry';
import {
  listBatches,
  createBatch,
  getBatchById,
  getBatchStatus,
  cancelBatch,
  deleteBatch
} from '@sap-ai-sdk/sample-code';
import { loadEnv } from './utils/load-env.js';

loadEnv();

describe('batch api', () => {
  it('should list existing batch jobs', async () => {
    const result = await listBatches();

    expect(result.count).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(result.resources)).toBe(true);
  });

  it('should create a batch job, cancel it, then delete it', async () => {
    const response = await createBatch(
      'ai://s3secret/input-batch.jsonl',
      'ai://s3secret/'
    );
    expect(response.id).toBeDefined();
    const id = response.id!;

    const details = await getBatchById(id);
    expect(details.id).toBe(id);
    expect(details.type).toBe('llm-native');

    const status = await getBatchStatus(id);
    expect(status.current_status).toBeDefined();

    await cancelBatch(id);

    await retry(
      async () => {
        const { current_status } = await getBatchStatus(id);
        if (['CANCELLED', 'COMPLETED', 'FAILED'].includes(current_status!)) {
          return;
        }
        throw new Error(`Waiting for terminal status, got: ${current_status}`);
      },
      { retries: 10, minTimeout: 3000 }
    );

    await deleteBatch(id);
  });
});
