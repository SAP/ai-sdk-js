import type { AzureOpenAiCreateChatCompletionResponse } from './client/inference/schema/index.js';

/**
 * Error details for a failed batch request.
 */
export interface AzureOpenAiBatchOutputError {
  code: string | null;
  message: unknown;
}

/**
 * Response details for a single batch output line.
 */
export interface AzureOpenAiBatchOutputResponse {
  status_code: number;
  request_id?: string;
  body?: AzureOpenAiCreateChatCompletionResponse;
}

/**
 * Represents a single parsed line from the batch output JSONL file.
 */
export interface AzureOpenAiBatchOutputLine {
  custom_id: string;
  response: AzureOpenAiBatchOutputResponse | null;
  error: AzureOpenAiBatchOutputError | null;
}

/**
 * Convenience class for parsing OpenAI batch output JSONL files.
 * Converts the Blob returned by FileApi into typed output lines.
 */
export class AzureOpenAiBatchOutput {
  /**
   * All parsed output lines.
   */
  readonly lines: AzureOpenAiBatchOutputLine[];

  private constructor(lines: AzureOpenAiBatchOutputLine[]) {
    this.lines = lines;
  }

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
   * Returns only successful output lines (error is null).
   */
  getSuccessful(): AzureOpenAiBatchOutputLine[] {
    return this.lines.filter(line => line.error === null);
  }

  /**
   * Returns only failed output lines (error is not null).
   */
  getFailed(): AzureOpenAiBatchOutputLine[] {
    return this.lines.filter(line => line.error !== null);
  }
}
