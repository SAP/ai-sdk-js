import { expectError, expectType } from 'tsd';
import {
  OpenAiClient,
  OpenAiChatCompletionOutput,
  OpenAiEmbeddingOutput,
  OpenAiModels
} from '@sap-ai-sdk/gen-ai-hub';

const client = new OpenAiClient();
expectType<OpenAiClient>(client);

/**
 * Chat Completion.
 */
expectType<Promise<OpenAiChatCompletionOutput>>(
  client.chatCompletion(OpenAiModels.GPT_35_TURBO, {
    messages: [{ role: 'user', content: 'test prompt' }]
  })
);

/**
 * Embeddings.
 */
expectType<Promise<OpenAiEmbeddingOutput>>(
  client.embeddings(OpenAiModels.ADA_002, {
    input: 'test input'
  })
);

expectError<any>(
  client.embeddings(OpenAiModels.GPT_35_TURBO, { input: 'test input' })
);
