import { expectError, expectType } from 'tsd';
import {
  OpenAiClient,
  OpenAiEmbeddingOutput,
  OpenAiChatCompletionResponse,
  OpenAiUsage,
  OpenAiChatCompletionOutput
} from '@sap-ai-sdk/gen-ai-hub';

const client = new OpenAiClient();
expectType<OpenAiClient>(client);

/**
 * Chat Completion.
 */
expectType<Promise<OpenAiChatCompletionResponse>>(
  client.chatCompletion(
    {
      messages: [{ role: 'user', content: 'test prompt' }]
    },
    'gpt-4'
  )
);

expectType<OpenAiChatCompletionOutput>(
  (
    await client.chatCompletion(
      {
        messages: [{ role: 'user', content: 'test prompt' }]
      },
      'gpt-4'
    )
  ).data
);

expectType<string | null>(
  (
    await client.chatCompletion(
      {
        messages: [{ role: 'user', content: 'test prompt' }]
      },
      'gpt-4'
    )
  ).getContent()
);

expectType<string | null>(
  (
    await client.chatCompletion(
      {
        messages: [{ role: 'user', content: 'test prompt' }]
      },
      'gpt-4'
    )
  ).getFinishReason()
);

expectType<OpenAiUsage>(
  (
    await client.chatCompletion(
      {
        messages: [{ role: 'user', content: 'test prompt' }]
      },
      'gpt-4'
    )
  ).getUsageTokens()
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
