import { SapAnthropicBedrockInvoke } from '@sap-ai-sdk/anthropic';

import type { MessageStream } from '@anthropic-ai/sdk/lib/MessageStream';
import type { Message } from '@anthropic-ai/sdk/resources/messages';

/**
 * Ask Claude Sonnet 4.6 about the capital of France through Bedrock Invoke.
 * @returns The Anthropic message, including content blocks and token usage.
 */
export async function messages(): Promise<Message> {
  const model = 'anthropic--claude-4.6-sonnet';
  const client = await SapAnthropicBedrockInvoke.createClient(model);

  return client.messages.create({
    model,
    max_tokens: 100,
    messages: [{ role: 'user', content: 'What is the capital of France?' }]
  });
}

/**
 * Stream a Claude Sonnet 4.6 message through Bedrock Invoke.
 * @returns The native Anthropic stream with text events and final-message helpers.
 */
export async function messagesStream(): Promise<MessageStream> {
  const model = 'anthropic--claude-4.6-sonnet';
  const client = await SapAnthropicBedrockInvoke.createClient(model);

  return client.messages.stream({
    model,
    max_tokens: 100,
    messages: [{ role: 'user', content: 'What is the capital of France?' }]
  });
}
