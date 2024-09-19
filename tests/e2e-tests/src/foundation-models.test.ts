import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { chatCompletion, computeEmbedding } from '@sap-ai-sdk/sample-code';

// Pick .env file from root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

describe('Azure OpenAI Foundation Model Access', () => {
  it('should complete a chat', async () => {
    const result = await chatCompletion();
    expect(result).toBeDefined();
    expect(result).toContain('Paris');
  });

  it('should compute an embedding vector', async () => {
    const result = await computeEmbedding();
    expect(result).toBeDefined();
    expect(result).not.toHaveLength(0);
  });
});
