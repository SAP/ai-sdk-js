import type { AzureOpenAiCreateChatCompletionResponse } from './client/inference/schema/index.js';

/**
 * Error details for a failed batch request.
 */
export interface AzureOpenAiBatchOutputError {
  /** Error code, or null if not available. */
  code: string | null;
  /** Error message details. */
  message: unknown;
}

/**
 * Response details for a single batch output line.
 */
export interface AzureOpenAiBatchOutputResponse {
  /** HTTP status code of the response. */
  status_code: number;
  /** Request ID assigned by the service. */
  request_id?: string;
  /** The chat completion response body. */
  body?: AzureOpenAiCreateChatCompletionResponse;
}

/**
 * Represents a single parsed line from the batch output JSONL file.
 */
export interface AzureOpenAiBatchOutputLine {
  /** Custom identifier for the request. */
  custom_id: string;
  /** Response details, or null if the request failed. */
  response: AzureOpenAiBatchOutputResponse | null;
  /** Error details, or null if the request succeeded. */
  error: AzureOpenAiBatchOutputError | null;
}

/**
 * Parses a batch output Blob (JSONL format) into typed output lines.
 * @param blob - The Blob returned from FileApi.fileDownload().
 * @returns A Promise resolving to an array of parsed output lines.
 */
export async function parseBatchOutput(
  blob: Blob
): Promise<AzureOpenAiBatchOutputLine[]> {
  const text = await blob.text();
  return text
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => JSON.parse(line) as AzureOpenAiBatchOutputLine);
}
