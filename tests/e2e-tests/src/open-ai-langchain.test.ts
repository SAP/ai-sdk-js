import {
  invoke,
  invokeLcAzureOpenAi,
  invokeLcAzureOpenAiResponses,
  invokeLcAzureOpenAiResponsesReasoning,
  invokeLcAzureOpenAiResponsesStructuredOutput,
  invokeLcAzureOpenAiResponsesToolCalling,
  invokeChain,
  invokeRagChain,
  invokeReasoningWithMaxTokens,
  invokeToolChain,
  invokeWithStructuredOutputJsonSchema,
  invokeWithStructuredOutputToolCalling
} from '@sap-ai-sdk/sample-code';

import { loadEnv } from './utils/load-env.ts';

loadEnv();

describe('LangChain OpenAI Access', () => {
  it('executes a basic invoke', async () => {
    const result = await invoke();
    expect(result).toContain('Paris');
  });

  it('executes the LangChain AzureOpenAI client', async () => {
    const result = await invokeLcAzureOpenAi();
    expect(result).toContain('Paris');
  });

  it('executes the LangChain AzureOpenAI client through Responses API', async () => {
    const result = await invokeLcAzureOpenAiResponses();
    expect(result).toContain('Paris');
  });

  it('executes tool calling through Responses API', async () => {
    const result = await invokeLcAzureOpenAiResponsesToolCalling();
    expect(result).toContain('add_numbers');
    expect(result).toContain('2');
    expect(result).toContain('3');
  });

  it('executes structured output through Responses API', async () => {
    const result = JSON.parse(
      await invokeLcAzureOpenAiResponsesStructuredOutput()
    );
    expect(result).toMatchObject({
      answer: expect.stringContaining('Paris'),
      confidence: expect.any(Number)
    });
  });

  it('executes reasoning through Responses API', async () => {
    const result = await invokeLcAzureOpenAiResponsesReasoning();
    expect(result).toContain('Paris');
  });

  it('executes reasoning with max tokens', async () => {
    const result = await invokeReasoningWithMaxTokens();
    expect(result).toContain('Paris');
  });

  it('executes tool calling', async () => {
    const result = await invokeToolChain();
    expect(result).toContain('20');
  });

  it('executes invoke as part of a chain', async () => {
    const result = await invokeChain();
    expect(result).toContain('Paris');
  });

  it('executes an invoke based on an embedding vector from our orchestration readme', async () => {
    const result = await invokeRagChain();
    expect(result).toContain('OrchestrationClient');
  }, 90000);

  it('executes invoke with structured output', async () => {
    const result = await invokeWithStructuredOutputJsonSchema();
    expect(result).toMatchObject({
      setup: expect.any(String),
      punchline: expect.any(String),
      rating: expect.any(Number)
    });
  });

  it('executes invoke with structured output using tool calling', async () => {
    const result = await invokeWithStructuredOutputToolCalling();
    expect(JSON.parse(result)).toMatchObject({
      setup: expect.any(String),
      punchline: expect.any(String)
    });
  });
});
