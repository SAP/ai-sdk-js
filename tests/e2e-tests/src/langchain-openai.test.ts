import {
  embedQueryOpenAi,
  invokeChatOpenAi,
  invokeChatOpenAiAgent,
  invokeChatOpenAiReasoning,
  invokeChatOpenAiResponses,
  invokeChatOpenAiStructuredOutput,
  streamChatOpenAi
} from '@sap-ai-sdk/sample-code';

import { loadEnv } from './utils/load-env.ts';

loadEnv();

describe('LangChain OpenAI with @sap-ai-sdk/openai', () => {
  it('invokes the Chat Completions API', async () => {
    const result = await invokeChatOpenAi();
    expect(result).toContain('Paris');
  });

  it('invokes the Responses API', async () => {
    const result = await invokeChatOpenAiResponses();
    expect(result).toContain('Paris');
  });

  it('streams a response with token usage', async () => {
    const stream = await streamChatOpenAi();
    let content = '';
    let outputTokens = 0;
    for await (const chunk of stream) {
      content += chunk.text;
      outputTokens += chunk.usage_metadata?.output_tokens ?? 0;
    }
    expect(content.length).toBeGreaterThan(0);
    expect(outputTokens).toBeGreaterThan(0);
  });

  it('runs an agent with tool calling', async () => {
    const result = await invokeChatOpenAiAgent();
    expect(result).toContain('21');
  });

  it('returns structured output', async () => {
    const result = await invokeChatOpenAiStructuredOutput();
    expect(result).toEqual({
      city: expect.stringContaining('Paris'),
      country: expect.stringContaining('France')
    });
  });

  it('uses a reasoning model', async () => {
    const result = await invokeChatOpenAiReasoning();
    expect(result).toContain('Paris');
  });

  it('embeds a query', async () => {
    const result = await embedQueryOpenAi();
    expect(result.length).toBeGreaterThan(0);
  });
});
