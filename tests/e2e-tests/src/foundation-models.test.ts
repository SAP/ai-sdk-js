import { chatCompletion, computeEmbedding } from '@sap-ai-sdk/sample-code';
import { AzureOpenAiChatClient } from '@sap-ai-sdk/foundation-models';
import { addNumbersTool } from '../../../test-util/tools.js';
import { loadEnv } from './utils/load-env.js';

loadEnv();

describe('Azure OpenAI Foundation Model Access', () => {
  it('should complete a chat', async () => {
    const response = await chatCompletion();
    expect(response.getContent()!).toContain('Paris');
  });

  it('should compute an embedding vector', async () => {
    const response = await computeEmbedding();
    expect(response.getEmbedding()!).not.toHaveLength(0);
  });

  it('should return multiple tool calls in a single stream response', async () => {
    const response = await new AzureOpenAiChatClient('gpt-4o').stream({
      messages: [
        {
          role: 'user',
          content: 'Add 1 and 2, as well as 3 and 4.'
        }
      ],
      tools: [addNumbersTool]
    });

    for await (const _ of response.stream) {
      /* do nothing */
    }

    const tools = response.getToolCalls();

    expect(tools).toHaveLength(2);
    expect(tools!.every(tool => tool.id !== undefined)).toBe(true);
    expect(tools!.map(tool => ({ ...tool, id: 'mock_id' })))
      .toMatchInlineSnapshot(`
       [
         {
           "function": {
             "arguments": "{"a": 1, "b": 2}",
             "name": "add",
           },
           "id": "mock_id",
           "type": "function",
         },
         {
           "function": {
             "arguments": "{"a": 3, "b": 4}",
             "name": "add",
           },
           "id": "mock_id",
           "type": "function",
         },
       ]
      `);
  });
});
