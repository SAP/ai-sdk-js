import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { complexInvoke, embedDocument, embedQuery, simpleInvoke } from '@sap-ai-sdk/sample-code';

// Pick .env file from root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

describe('Langchain OpenAI Access', () => {
  it('executes a basic invoke', async () => {
    const result = await simpleInvoke();
    expect(result).toContain('Paris');
  });

  it('executes invoke as part of a chain ', async () => {
    const result = await complexInvoke();
    expect(result).toContain('Paris');
  });

  it('should compute an embedding vector based on a string', async () => {
    const result = await embedQuery();
    expect(result).not.toHaveLength(0);
  });

  it('should compute an embedding vector based on a string array', async () => {
    const result = await embedDocument();
    expect(result).not.toHaveLength(0);
  });
});
