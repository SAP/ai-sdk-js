import {
  orchestrationInvokeChain,
  invokeLangGraphChain,
  invokeLangGraphChainStream,
  orchestrationInvokeWithStructuredOutput
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

  it('executes an stream with LangGraph', async () => {
    const result = await invokeLangGraphChainStream();
    expect(result).toContain('SAP Cloud SDK');
  });

  it('executes invoke with structured output [json-schema]', async () => {
    const result = await orchestrationInvokeWithStructuredOutput(
      'jsonSchema',
      true
    );
    expect(result.parsed).toMatchObject({
      setup: expect.any(String),
      punchline: expect.any(String),
      rating: expect.any(Number)
    });
  });

  it('executes invoke with structured output [tool-calling]', async () => {
    const result = await orchestrationInvokeWithStructuredOutput(
      'functionCalling',
      true
    );
    expect(result.parsed).toMatchObject({
      setup: expect.any(String),
      punchline: expect.any(String),
      rating: expect.any(Number)
    });
  });
});
