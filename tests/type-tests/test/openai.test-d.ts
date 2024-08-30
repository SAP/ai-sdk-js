import { expectError, expectType } from 'tsd';
import {
  OpenAiClient,
  OpenAiChatCompletionOutput,
  OpenAiEmbeddingOutput
} from '@sap-ai-sdk/gen-ai-hub';

const client = new OpenAiClient();
expectType<OpenAiClient>(client);

/**
 * Chat Completion.
 */
expectType<Promise<OpenAiChatCompletionOutput>>(
  client.chatCompletion(
    {
      messages: [{ role: 'user', content: 'test prompt' }]
    },
    'gpt-4'
  )
);

/**
 * Embeddings.
 */
expectType<Promise<OpenAiEmbeddingOutput>>(
  client.embeddings(
    {
      input: 'test input'
    },
    'text-embedding-ada-002'
  )
);

expectError<any>(client.embeddings({ input: 'test input' }, 'gpt-35-turbo'));
