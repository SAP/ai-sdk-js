import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { invoke, invokeChain, invokeRagChain } from '@sap-ai-sdk/sample-code';

// Pick .env file from root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

describe('Langchain OpenAI Access', () => {
  it('executes a basic invoke', async () => {
    const result = await invoke();
    expect(result).toContain('Paris');
  });

  it('executes invoke as part of a chain ', async () => {
    const result = await invokeChain();
    expect(result).toContain('Paris');
  });

  it('executes an invoke based on an embedding vector from our orchestration readme', async () => {
    const result = await invokeRagChain();
    expect(result).toContain('@sap-ai-sdk/orchestration');
  });
});
