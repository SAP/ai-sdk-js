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
 * Convenience class for parsing OpenAI batch output JSONL files.
 * Converts the Blob returned by FileApi into typed output lines.
 */
export class AzureOpenAiBatchOutput {
  /**
   * Parses a batch output Blob (JSONL format) into typed output lines.
   * @param blob - The Blob returned from FileApi.fileDownload().
   * @returns A Promise resolving to an AzureOpenAiBatchOutput instance.
   */
  static async from(blob: Blob): Promise<AzureOpenAiBatchOutput> {
    const text = await blob.text();
    const lines = text
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => JSON.parse(line) as AzureOpenAiBatchOutputLine);
    return new AzureOpenAiBatchOutput(lines);
  }

  /**
   * All parsed output lines.
   */
  readonly lines: AzureOpenAiBatchOutputLine[];

  private constructor(lines: AzureOpenAiBatchOutputLine[]) {
    this.lines = lines;
  }

  /**
   * Returns only successful output lines (error is null).
   * @returns Array of output lines where error is null.
   */
  getSuccessful(): AzureOpenAiBatchOutputLine[] {
    return this.lines.filter(line => line.error === null);
  }

  /**
   * Returns only failed output lines (error is not null).
   * @returns Array of output lines where error is not null.
   */
  getFailed(): AzureOpenAiBatchOutputLine[] {
    return this.lines.filter(line => line.error !== null);
  }
}
