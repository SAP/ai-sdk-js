import {
  chatCompletion,
  computeEmbedding
} from '@sap-ai-sdk/sample-code';
import { loadEnv } from './utils/load-env.js';

loadEnv();

describe('Azure OpenAI Foundation Model Access', () => {
  it('should complete a chat', async () => {
    const response = await chatCompletion();
    expect(response.getContent()!).toContain('Paris');
  });

  it('should compute an embedding vector', async () => {
    const response = await computeEmbedding();
    expect(response.getEmbedding()!).not.toHaveLength(0);
  });
});
