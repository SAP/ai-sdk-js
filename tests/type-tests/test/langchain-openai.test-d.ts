import {
  AzureOpenAiChatClient,
  AzureOpenAiEmbeddingClient,
  createLcAzureOpenAi,
  LcAzureOpenAi
} from '@sap-ai-sdk/langchain/openai';

import { expectType } from 'tsd';

expectType<AzureOpenAiChatClient>(
  new AzureOpenAiChatClient({ modelName: 'gpt-5.4-nano' })
);
expectType<AzureOpenAiEmbeddingClient>(
  new AzureOpenAiEmbeddingClient({ modelName: 'text-embedding-3-small' })
);
expectType<Promise<LcAzureOpenAi>>(
  createLcAzureOpenAi({ deployment: 'gpt-5.4-nano' })
);
