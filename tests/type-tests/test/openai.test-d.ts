import { expectError, expectType } from 'tsd';
import {
  OpenAiClient,
  OpenAiChatCompletionOutput,
  OpenAiEmbeddingOutput,
} from '@sap-ai-sdk/gen-ai-hub';

const client = new OpenAiClient();
expectType<OpenAiClient>(client);

/**
 * Chat Completion.
 */
expectType<Promise<OpenAiChatCompletionOutput>>(
  client.chatCompletion('gpt-4', {
    messages: [{ role: 'user', content: 'test prompt' }]
  })
);

/**
 * Embeddings.
 */
expectType<Promise<OpenAiEmbeddingOutput>>(
  client.embeddings('text-embedding-ada-002', {
    input: 'test input'
  })
);

expectError<any>(
  client.embeddings('gpt-35-turbo', { input: 'test input' })
);
