import { createBatchInput } from './azure-openai-batch-input.js';
import type { AzureOpenAiCreateChatCompletionRequest } from './client/inference/schema/index.js';

describe('createBatchInput', () => {
  const request1: AzureOpenAiCreateChatCompletionRequest = {
    model: 'gpt-4.1',
    messages: [{ role: 'user', content: 'What is machine learning?' }]
  };
  const request2: AzureOpenAiCreateChatCompletionRequest = {
    model: 'gpt-4.1',
    messages: [
      { role: 'user', content: 'Explain neural networks in simple terms' }
    ]
  };

  it('should produce a Blob', () => {
    const blob = createBatchInput([request1]);
    expect(blob).toBeInstanceOf(Blob);
  });

  it('should generate correct structure for a single request', async () => {
    const blob = createBatchInput([request1]);
    const parsed = JSON.parse(await blob.text());

    expect(parsed.custom_id).toBe('request-1');
    expect(parsed.method).toBe('POST');
    expect(parsed.url).toBe('/v1/chat/completions');
    expect(parsed.body).toEqual(request1);
  });

  it('should auto-generate sequential custom_ids for multiple requests', async () => {
    const text = await createBatchInput([request1, request2]).text();
    const lines = text.split('\n');

    expect(lines).toHaveLength(2);
    expect(JSON.parse(lines[0]).custom_id).toBe('request-1');
    expect(JSON.parse(lines[1]).custom_id).toBe('request-2');
  });

  it('should produce valid JSONL where each line is independent JSON', async () => {
    const text = await createBatchInput([request1, request2]).text();
    const lines = text.split('\n');

    expect(lines).toHaveLength(2);
    expect(() => lines.forEach(line => JSON.parse(line))).not.toThrow();
  });
});
