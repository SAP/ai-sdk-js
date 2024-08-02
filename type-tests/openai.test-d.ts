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
    OpenAiModels.GPT_4o,
    { messages: [{ role: 'user', content: 'test prompt' }]
  })
);

expectError<any>(
  client.chatCompletion(
    OpenAiModels.GPT_4o,
    { messages2: [{ role: 'user', content: 'test prompt' }] })
);

expectType<Promise<OpenAiEmbeddingOutput>>(
  client.embeddings(
    OpenAiModels.ADA_002,
    { input: 'test input' })
);

expectError<any>(client.embeddings(OpenAiModels.GPT_4, { input: 'test input' }));
