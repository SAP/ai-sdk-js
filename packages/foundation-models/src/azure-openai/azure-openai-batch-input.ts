import type { AzureOpenAiCreateChatCompletionRequest } from './client/inference/schema/index.js';

interface AzureOpenAiBatchInputLine {
  custom_id: string;
  method: 'POST';
  url: '/v1/chat/completions';
  body: AzureOpenAiCreateChatCompletionRequest;
}

/**
 * Convenience class for creating OpenAI batch input in JSONL format.
 * Converts typed chat completion requests into a Blob suitable for upload via FileApi.
 */
export class AzureOpenAiBatchInput {
  private readonly lines: AzureOpenAiBatchInputLine[];

  /**
   * Creates a batch input from one or more chat completion requests.
   * Each request is assigned a sequential custom_id (request-1, request-2, ...).
   * @param requests - Chat completion requests to include in the batch.
   */
  constructor(...requests: AzureOpenAiCreateChatCompletionRequest[]) {
    this.lines = requests.map((body, i) => ({
      custom_id: `request-${i + 1}`,
      method: 'POST' as const,
      url: '/v1/chat/completions' as const,
      body
    }));
  }

  /**
   * Serializes the batch input to a JSONL Blob for upload via FileApi.
   * @returns A Blob containing one JSON object per line.
   */
  toBlob(): Blob {
    return new Blob([this.lines.map(line => JSON.stringify(line)).join('\n')]);
  }
}
