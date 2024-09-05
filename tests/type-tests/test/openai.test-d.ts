import { expectError, expectType } from 'tsd';
import {
  OpenAiChatCompletionOutput,
  OpenAiEmbeddingOutput,
  OpenAiChatClient,
  OpenAiEmbeddingClient,
  OpenAiChatCompletionResponse,
  OpenAiUsage
} from '@sap-ai-sdk/gen-ai-hub';

/**
 * Chat Completion.
 */
expectType<Promise<OpenAiChatCompletionResponse>>(
  new OpenAiChatClient('gpt-4').run({
    messages: [{ role: 'user', content: 'test prompt' }]
  })
);

/**
 * Chat Completion with invalid model.
 */
expectError(
  new OpenAiChatClient('unknown').run({
    messages: [{ role: 'user', content: 'test prompt' }]
  })
);

expectType<OpenAiChatCompletionOutput>(
  (
    await new OpenAiChatClient('gpt-4').run({
      messages: [{ role: 'user', content: 'test prompt' }]
    })
  ).data
);

expectType<string | null>(
  (
    new OpenAiChatClient('gpt-4').run({
      messages: [{ role: 'user', content: 'test prompt' }]
    })
  ).getContent()
);

expectType<string | null>(
  (
    new OpenAiChatClient('gpt-4').run({
      messages: [{ role: 'user', content: 'test prompt' }]
    })
  ).getFinishReason()
);

expectType<OpenAiUsage>(
  (
    new OpenAiChatClient('gpt-4').run({
      messages: [{ role: 'user', content: 'test prompt' }]
    })
  ).getUsageTokens()
);

/**
 * Embeddings.
 */
expectType<Promise<OpenAiEmbeddingOutput>>(
  new OpenAiEmbeddingClient('text-embedding-ada-002').run({
    input: 'test input'
  })
);

expectError<any>(new OpenAiEmbeddingClient('gpt-35-turbo'));
