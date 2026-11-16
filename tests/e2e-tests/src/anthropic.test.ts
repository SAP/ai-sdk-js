import {
  anthropicMessages,
  anthropicMessagesStream
} from '@sap-ai-sdk/sample-code';

import { loadEnv } from './utils/load-env.ts';

loadEnv();

describe('Claude via Anthropic Bedrock SDK', () => {
  it('should create a message through Invoke', async () => {
    const message = await anthropicMessages();
    expect(message.content).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'text',
          text: expect.stringContaining('Paris')
        })
      ])
    );
  });

  it('should stream text and accumulate a final message', async () => {
    const stream = anthropicMessagesStream();
    let content = '';
    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        content += event.delta.text;
      }
    }

    expect(content).toContain('Paris');
    expect(await stream.finalText()).toBe(content);
    expect((await stream.finalMessage()).stop_reason).toBe('end_turn');
  });
});
