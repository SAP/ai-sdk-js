import { invoke, invokeChain, invokeRagChain, invokeWithStructuredOutputJsonSchema } from '@sap-ai-sdk/sample-code';
import { loadEnv } from './utils/load-env.js';

loadEnv();

describe('LangChain OpenAI Access', () => {
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
    expect(result).toContain('OrchestrationClient');
  });

  it('executes invoke with structured output', async () => {
    const result = await invokeWithStructuredOutputJsonSchema();
    expect(result).toMatchObject({
      setup: expect.any(String),
      punchline: expect.any(String),
      rating: expect.any(Number)
    })
  });
});
