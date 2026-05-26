import type { AzureOpenAiCreateChatCompletionRequest } from './client/inference/schema/index.js';

/**
 * Creates a JSONL Blob for upload via FileApi from typed chat completion requests.
 * Each request is assigned a sequential custom_id (request-1, request-2, ...).
 * @param requests - Chat completion requests to include in the batch.
 * @returns A Blob containing one JSON object per line.
 */
export function createAzureOpenAiBatchInput(
  requests: AzureOpenAiCreateChatCompletionRequest[]
): Blob {
  const lines = requests.map((body, i) =>
    JSON.stringify({
      custom_id: `request-${i + 1}`,
      method: 'POST',
      url: '/v1/chat/completions',
      body
    })
  );
  return new Blob([lines.join('\n')]);
}
