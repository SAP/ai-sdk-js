import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  complexInvoke,
  simpleInvoke
, ragInvoke } from '@sap-ai-sdk/sample-code';

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

  it('executes an invoke based on an embedding vector from our orchestration readme', async () => {
    const result = await ragInvoke();
    expect(result).toContain('client');
  });
});
