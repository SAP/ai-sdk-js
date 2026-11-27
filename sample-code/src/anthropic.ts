import { SapAnthropicBedrockInvoke } from '@sap-ai-sdk/anthropic';

import type { MessageStream } from '@anthropic-ai/sdk/lib/MessageStream';
import type { Message } from '@anthropic-ai/sdk/resources/messages';

/**
 * Ask Claude Sonnet 4.6 about the capital of France through Bedrock Invoke.
 * @returns The Anthropic message, including content blocks and token usage.
 */
export async function createMessage(): Promise<Message> {
  const client = new SapAnthropicBedrockInvoke();

  return client.messages.create({
    model: 'anthropic--claude-4.6-sonnet',
    max_tokens: 100,
    messages: [{ role: 'user', content: 'What is the capital of France?' }]
  });
}

/**
 * Stream a Claude Sonnet 4.6 message through Bedrock Invoke.
 * @returns The native Anthropic stream with text events and final-message helpers.
 */
export function streamMessage(): MessageStream {
  const client = new SapAnthropicBedrockInvoke();

  return client.messages.stream({
    model: 'anthropic--claude-4.6-sonnet',
    max_tokens: 100,
    messages: [{ role: 'user', content: 'What is the capital of France?' }]
  });
}
