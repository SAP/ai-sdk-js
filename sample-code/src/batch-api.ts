import { BatchesApi } from '@sap-ai-sdk/batch-api';
import { FileApi } from '@sap-ai-sdk/ai-api';
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
  return BatchesApi.listBatches(defaultHeaders).execute();
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
  return BatchesApi.createBatch(
    {
      type: 'llm-native',
      input: { uri: inputUri },
      output: { uri: outputUri },
      spec: { provider: 'azure-openai', model: 'gpt-4.1' }
    },
    defaultHeaders
  ).execute();
}

/**
 * Get batch job details by ID.
 * @param batchId - The ID of the batch job.
 * @returns Batch detail response.
 */
export async function getBatchById(
  batchId: string
): Promise<BatchDetailResponse> {
  return BatchesApi.getBatchById(batchId, defaultHeaders).execute();
}

/**
 * Get batch job status by ID.
 * @param batchId - The ID of the batch job.
 * @returns Batch status response.
 */
export async function getBatchStatus(
  batchId: string
): Promise<BatchStatusResponse> {
  return BatchesApi.getBatchStatus(batchId, defaultHeaders).execute();
}

/**
 * Cancel a batch job by ID.
 * @param batchId - The ID of the batch job.
 * @returns Batch cancel response.
 */
export async function cancelBatch(
  batchId: string
): Promise<BatchCancelResponse> {
  return BatchesApi.cancelBatch(batchId, defaultHeaders).execute();
}

/**
 * Delete a batch job by ID (only for cancelled, completed, or failed batches).
 * @param batchId - The ID of the batch job.
 * @returns Batch delete response.
 */
export async function deleteBatch(
  batchId: string
): Promise<BatchDeleteResponse> {
  return BatchesApi.deleteBatch(batchId, defaultHeaders).execute();
}

/**
 * Upload a JSONL input file for batch processing.
 * @param secretName - The object store secret name (e.g. 's3secret').
 * @param fileName - The file name / path within the secret (e.g. 'test-input-123.jsonl').
 * @returns The object store URI to use as the batch input URI.
 */
export async function uploadBatchInput(
  secretName: string,
  fileName: string
): Promise<string> {
  const content = [
    '{"custom_id":"request-1","method":"POST","url":"/v1/chat/completions","body":{"model":"gpt-4.1","messages":[{"role":"user","content":"What is machine learning?"}],"max_tokens":150}}',
    '{"custom_id":"request-2","method":"POST","url":"/v1/chat/completions","body":{"model":"gpt-4.1","messages":[{"role":"user","content":"Explain neural networks in simple terms"}],"max_tokens":150}}'
  ].join('\n');
  const blob = new Blob([content], { type: 'application/octet-stream' });
  await FileApi.fileUpload(
    `${secretName}//${fileName}`,
    blob,
    { overwrite: true },
    { 'AI-Resource-Group': defaultHeaders['AI-Resource-Group'] }
  ).execute();
  return `ai://${secretName}/${fileName}`;
}

/**
 * Delete a file from the object store.
 * @param secretName - The object store secret name (e.g. 's3secret').
 * @param filePath - The file path within the secret (e.g. 'output/my-id/output.jsonl').
 */
export async function deleteFile(
  secretName: string,
  filePath: string
): Promise<void> {
  await FileApi.fileDelete(`${secretName}//${filePath}`, {
    'AI-Resource-Group': defaultHeaders['AI-Resource-Group']
  }).execute();
}

/**
 * Download the output file of a completed batch job.
 * The output is written to `{outputFolder}{batchId}/output.jsonl`.
 * @param secretName - The object store secret name used when creating the batch job (e.g. 's3secret').
 * @param outputFolder - The output folder prefix used when creating the batch job (e.g. 'output/').
 * @param batchId - The ID of the completed batch job.
 * @returns The output file as a Blob.
 */
export async function downloadBatchOutput(
  secretName: string,
  outputFolder: string,
  batchId: string
): Promise<Blob> {
  return FileApi.fileDownload(
    `${secretName}//${outputFolder}${batchId}/output.jsonl`,
    { 'AI-Resource-Group': defaultHeaders['AI-Resource-Group'] }
  ).execute();
}
