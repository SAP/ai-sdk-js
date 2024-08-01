import { expectError, expectType } from 'tsd';
import { OpenAiClient } from '../packages/gen-ai-hub/src/client/openai/openai-client.js';
import {
  OpenAiChatCompletionOutput,
  OpenAiEmbeddingOutput
} from '../packages/gen-ai-hub/src/client/openai/openai-types.js'

const client = new OpenAiClient();
expectType<OpenAiClient>(client );

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
