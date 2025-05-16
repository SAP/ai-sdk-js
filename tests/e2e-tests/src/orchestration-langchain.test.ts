import {
  orchestrationInvokeChain,
  invokeLangGraphChain,
  streamOrchestrationLangChain
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

  it('supports streaming responses', async () => {
    // Create an abort controller for the test
    const controller = new AbortController();

    // Get the stream
    const stream = await streamOrchestrationLangChain(controller);

    // Collect all chunks
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    // Verify we received chunks
    expect(chunks.length).toBeGreaterThan(0);

    // Verify the chunks contain expected content
    const combinedContent = chunks.map(chunk => chunk.content).join('');
    expect(combinedContent).toContain('SAP Cloud SDK');
  });
});
