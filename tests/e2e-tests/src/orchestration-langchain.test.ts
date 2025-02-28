import { orchestrationInvokeChain } from '@sap-ai-sdk/sample-code';
import { loadEnv } from './utils/load-env.js';

loadEnv();

describe('Langchain OpenAI Access', () => {
  it('executes invoke as part of a chain ', async () => {
    const result = await orchestrationInvokeChain();
    expect(result).toContain('SAP Cloud SDK');
  });
});
