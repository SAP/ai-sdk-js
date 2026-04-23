import { BatchesApi } from '@sap-ai-sdk/batch-api';
import type {
  BatchListResponse,
  BatchCreateResponse,
  BatchDetailResponse,
  BatchStatusResponse,
  BatchCancelResponse,
  BatchDeleteResponse
} from '@sap-ai-sdk/batch-api';

const defaultHeaders = {
  'AI-Resource-Group': 'ai-sdk-js-e2e'
};

/**
 * List all batch jobs.
 * @returns Batch list response.
 */
export async function listBatches(): Promise<BatchListResponse> {
  return BatchesApi.batchServiceControllerBatchControllerListBatches()
    .addCustomHeaders(defaultHeaders)
    .execute();
}

/**
 * Create a new batch job.
 * @param inputUri - Object store URI of the input .jsonl file (e.g. ai://s3secret/input-batch.jsonl).
 * @param outputUri - Object store URI of the output directory (e.g. ai://s3secret/).
 * @returns Batch create response.
 */
export async function createBatch(
  inputUri: string,
  outputUri: string
): Promise<BatchCreateResponse> {
  return BatchesApi.batchServiceControllerBatchControllerCreateBatch({
    type: 'llm-native',
    input: { uri: inputUri },
    output: { uri: outputUri },
    spec: { provider: 'azure-openai', model: 'gpt-4.1' }
  })
    .addCustomHeaders(defaultHeaders)
    .execute();
}

/**
 * Get batch job details by ID.
 * @param batchId - The ID of the batch job.
 * @returns Batch detail response.
 */
export async function getBatchById(
  batchId: string
): Promise<BatchDetailResponse> {
  return BatchesApi.batchServiceControllerBatchControllerGetBatchById(batchId)
    .addCustomHeaders(defaultHeaders)
    .execute();
}

/**
 * Get batch job status by ID.
 * @param batchId - The ID of the batch job.
 * @returns Batch status response.
 */
export async function getBatchStatus(
  batchId: string
): Promise<BatchStatusResponse> {
  return BatchesApi.batchServiceControllerBatchControllerGetBatchStatus(batchId)
    .addCustomHeaders(defaultHeaders)
    .execute();
}

/**
 * Cancel a batch job by ID.
 * @param batchId - The ID of the batch job.
 * @returns Batch cancel response.
 */
export async function cancelBatch(
  batchId: string
): Promise<BatchCancelResponse> {
  return BatchesApi.batchServiceControllerBatchControllerCancelBatch(batchId)
    .addCustomHeaders(defaultHeaders)
    .execute();
}

/**
 * Delete a batch job by ID (only for cancelled, completed, or failed batches).
 * @param batchId - The ID of the batch job.
 * @returns Batch delete response.
 */
export async function deleteBatch(
  batchId: string
): Promise<BatchDeleteResponse> {
  return BatchesApi.batchServiceControllerBatchControllerDeleteBatch(batchId)
    .addCustomHeaders(defaultHeaders)
    .execute();
}
