import { expectError, expectType } from 'tsd';
import {
  OpenAiChatCompletionOutput,
  OpenAiEmbeddingOutput,
  OpenAiChatClient,
  OpenAiEmbeddingClient,
  OpenAiChatCompletionResponse,
  OpenAiUsage
} from '@sap-ai-sdk/foundation-models';

/**
 * Chat Completion.
 */
expectType<Promise<OpenAiChatCompletionResponse>>(
  new OpenAiChatClient('gpt-4').run({
    messages: [{ role: 'user', content: 'test prompt' }]
  })
);

/**
 * Chat Completion with custom model.
 */
expectType(
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

expectType<string | undefined>(
  (
    await new OpenAiChatClient('gpt-4').run({
      messages: [{ role: 'user', content: 'test prompt' }]
    })
  ).getContent()
);

expectType<string | undefined>(
  (
    await new OpenAiChatClient('gpt-4').run({
      messages: [{ role: 'user', content: 'test prompt' }]
    })
  ).getFinishReason()
);

expectType<OpenAiUsage>(
  (
    await new OpenAiChatClient('gpt-4').run({
      messages: [{ role: 'user', content: 'test prompt' }]
    })
  ).getTokenUsage()
);

/**
 * Embeddings.
 */
expectType<Promise<OpenAiEmbeddingOutput>>(
  new OpenAiEmbeddingClient('text-embedding-ada-002').run({
    input: 'test input'
  })
);

expectType<OpenAiEmbeddingClient>(new OpenAiEmbeddingClient('unknown'));
