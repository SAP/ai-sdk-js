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
  client.chatCompletion({
    deploymentConfiguration: { deploymentId: 'id' },
    messages: [{ role: 'user', content: 'test prompt' }]
  })
);

expectError<any>(
  client.chatCompletion({
    messages: [{ role: 'user', content: 'test prompt' }]
  })
);

/**
 * Embeddings.
 */
expectType<Promise<OpenAiEmbeddingOutput>>(
  client.embeddings({
    deploymentConfiguration: { deploymentId: 'id' },
    input: 'test input'
  })
);

expectError<any>(client.embeddings({ input: 'test input' }));
