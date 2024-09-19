import { chatCompletion, computeEmbedding } from '@sap-ai-sdk/sample-code';
import { loadEnv } from './utils/load-env.js';

loadEnv();

describe('Azure OpenAI Foundation Model Access', () => {
  it('should complete a chat', async () => {
    const result = await chatCompletion();
    expect(result).toContain('Paris');
  });

  it('should compute an embedding vector', async () => {
    const result = await computeEmbedding();
    expect(result).not.toHaveLength(0);
  });
});
