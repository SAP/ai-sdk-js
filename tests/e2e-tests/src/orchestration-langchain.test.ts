import {
  orchestrationInvokeChain,
  invokeLangGraphChain
} from '@sap-ai-sdk/sample-code';
import { loadEnv } from './utils/load-env.js';

loadEnv();

describe('Orchestration LangChain client', () => {
  it('executes invoke as part of a chain ', async () => {
    const result = await orchestrationInvokeChain();
    expect(result).toContain('SAP Cloud SDK');
  }, 120000);

  it('executes an invoke with LangGraph', async () => {
    const result = await invokeLangGraphChain();
    expect(result).toContain('SAP Cloud SDK');
  }, 120000);
});
