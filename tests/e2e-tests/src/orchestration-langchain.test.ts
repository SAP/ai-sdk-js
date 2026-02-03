import {
  orchestrationInvokeChain,
  invokeLangGraphChain,
  invokeDynamicModelAgent,
  invokeLangGraphChainStream
} from '@sap-ai-sdk/sample-code';
import { loadEnv } from './utils/load-env.js';

loadEnv();

describe('Orchestration LangChain client', () => {
  it('executes invoke as part of a chain ', async () => {
    const result = await orchestrationInvokeChain();
    expect(result).toContain('SAP Cloud SDK');
  });

  it('executes an invoke with LangGraph', async () => {
    const result = await invokeLangGraphChain();
    expect(result).toContain('SAP Cloud SDK');
  });

  it('executes an invoke with dynamic model selection agent', async () => {
    const result = await invokeDynamicModelAgent();
    expect(result).toContain('SAP');
  });

  it('executes a stream with LangGraph', async () => {
    const result = await invokeLangGraphChainStream();
    expect(result).toContain('SAP Cloud SDK');
  });
});
