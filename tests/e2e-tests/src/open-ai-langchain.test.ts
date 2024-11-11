import { invoke, invokeChain, invokeRagChain } from '@sap-ai-sdk/sample-code';
import { loadEnv } from './utils/load-env.js';

loadEnv();

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
    expect(result).toContain('OrchestrationClient');
  });
});
