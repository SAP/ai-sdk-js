import { expectError, expectType } from 'tsd';
import {
  OpenAiChatCompletionOutput,
  OpenAiEmbeddingOutput,
  OpenAiChatClient,
  OpenAiEmbeddingClient
} from '@sap-ai-sdk/foundation-models';

/**
 * Chat Completion.
 */
expectType<Promise<OpenAiChatCompletionOutput>>(
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

/**
 * Embeddings.
 */
expectType<Promise<OpenAiEmbeddingOutput>>(
  new OpenAiEmbeddingClient('text-embedding-ada-002').run({
    input: 'test input'
  })
);

expectError<any>(new OpenAiEmbeddingClient('gpt-35-turbo'));
