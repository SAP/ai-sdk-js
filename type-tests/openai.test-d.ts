import { expectError, expectType } from 'tsd';
import { OpenAiClient } from '../packages/gen-ai-hub/src/client/openai/openai-client.js';
import {
  OpenAiChatCompletionOutput,
  OpenAiEmbeddingOutput,
  OpenAiModels,
} from '../packages/gen-ai-hub/src/client/openai/openai-types.js'

const client = new OpenAiClient();
expectType<OpenAiClient>(client );

expectType<Promise<OpenAiChatCompletionOutput>>(
  client.chatCompletion(
    { ...OpenAiModels.GPT4o, deploymentId: 'id' },
    { messages: [{ role: 'user', content: 'test prompt' }]
  })
);

expectError<any>(
  client.chatCompletion(
    OpenAiModels.GPT4o,
    { messages: [{ role: 'user', content: 'test prompt' }] })
);

expectType<Promise<OpenAiEmbeddingOutput>>(
  client.embeddings(
    { ...OpenAiModels.ADA002, deploymentId: 'id' },
    { input: 'test input' })
);

expectError<any>(client.embeddings(OpenAiModels.ADA002, { input: 'test input' }));
