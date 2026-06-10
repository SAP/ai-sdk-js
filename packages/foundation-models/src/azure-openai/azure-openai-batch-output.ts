import type { AzureOpenAiCreateChatCompletionResponse } from './client/inference/schema/index.js';

/**
 * Error details for a failed batch request.
 * @experimental This API is experimental and may change at any time without prior notice.
 */
export interface BatchOutputError {
  /** Error code, or null if not available. */
  code: string | null;
  /** Error message details. */
  message: unknown;
}

/**
 * Response details for a single batch output line.
 * @experimental This API is experimental and may change at any time without prior notice.
 */
export interface BatchOutputResponse {
  /** HTTP status code of the response. */
  status_code: number;
  /** Request ID assigned by the service. */
  request_id?: string;
  /** The chat completion response body. */
  body?: AzureOpenAiCreateChatCompletionResponse;
}

/**
 * Represents a single parsed line from the batch output JSONL file.
 * @experimental This API is experimental and may change at any time without prior notice.
 */
export interface BatchOutputLine {
  /** Custom identifier for the request. */
  custom_id: string;
  /** Response details, or null if the request failed. */
  response: BatchOutputResponse | null;
  /** Error details, or null if the request succeeded. */
  error: BatchOutputError | null;
}

/**
 * Parses a batch output JSONL payload into typed output lines.
 * @param data - The data returned from FileApi.fileDownload(), as a Blob, Buffer, or string.
 * @returns A Promise resolving to an array of parsed output lines.
 * @experimental This API is experimental and may change at any time without prior notice.
 */
export async function parseBatchOutput(
  data: Blob | Buffer | string
): Promise<BatchOutputLine[]> {
  let text: string;
  if (typeof data === 'string') {
    text = data;
  } else if (Buffer.isBuffer(data)) {
    text = data.toString('utf-8');
  } else {
    // Blob case
    text = await data.text();
  }
  return text
    .split('\n')
    .filter(line => line.trim().length)
    .map(line => JSON.parse(line) as BatchOutputLine);
}
