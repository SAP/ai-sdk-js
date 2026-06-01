import retry from 'async-retry';
import {
  listBatches,
  createBatch,
  getBatchById,
  getBatchStatus,
  cancelBatch,
  deleteBatch,
  downloadBatchOutput,
  uploadBatchInput,
  deleteFile
} from '@sap-ai-sdk/sample-code';
import { loadEnv } from './utils/load-env.js';

loadEnv();

const secretName = 's3secret';
const outputFolder = 'output/';

describe('batch api', () => {
  it('should list existing batch jobs', async () => {
    const result = await listBatches();

    expect(result.count).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(result.resources)).toBe(true);
  });

  it('should create a batch job, cancel it, then delete it', async () => {
    const inputFileName = `test-input-to-cancel-${Date.now()}.jsonl`;
    const inputUri = await uploadBatchInput(secretName, inputFileName);

    try {
      const response = await createBatch(
        inputUri,
        `ai://${secretName}/${outputFolder}`
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
          throw new Error(
            `Waiting for terminal status, got: ${current_status}`
          );
        },
        { retries: 10, minTimeout: 3000 }
      );

      await deleteBatch(id);
    } finally {
      await deleteFile(secretName, inputFileName);
    }
  });

  it('should create a batch job and submit it for processing', async () => {
    const inputFileName = `test-input-complete-${Date.now()}.jsonl`;
    const inputUri = await uploadBatchInput(secretName, inputFileName);

    const response = await createBatch(
      inputUri,
      `ai://${secretName}/${outputFolder}`
    );
    expect(response.id).toBeDefined();
    // Input file is intentionally not deleted here — the batch needs it during PREPARING_INPUT.
    // Cleanup is handled in the download test after the batch reaches COMPLETED.
  });

  it('should download and delete a completed batch job if one exists', async () => {
    const { resources } = await listBatches();
    const completedBatch = resources?.find(b => b.status === 'COMPLETED');

    if (!completedBatch?.id) {
      return;
    }

    const id = completedBatch.id;
    const details = await getBatchById(id);
    const inputFilePath = details.input?.uri?.replace(
      `ai://${secretName}/`,
      ''
    );

    try {
      const output = await downloadBatchOutput(secretName, outputFolder, id);
      expect(output.length).toBeGreaterThan(0);
      expect(output.filter(line => line.error === null).length).toBeGreaterThan(
        0
      );
      await deleteFile(secretName, `${outputFolder}${id}/output.jsonl`);
      if (inputFilePath) {
        await deleteFile(secretName, inputFilePath);
      }
    } catch (e: any) {
      // A COMPLETED batch may have its output file already deleted from a previous test run.
      // In that case, skip assertions and proceed to cleanup.
      if (!e.message?.includes('404')) {
        throw e;
      }
    } finally {
      await deleteBatch(id);
    }
  });
});
