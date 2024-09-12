import { expectError, expectType } from 'tsd';
import { OpenAiChatClient, OpenAiEmbeddingClient } from '@sap-ai-sdk/langchain';
import { AIMessageChunk } from '@langchain/core/messages';
import { LLMResult } from '@langchain/core/outputs';

expectError(
  new OpenAiChatClient({ deploymentId: 'test', modelName: 'test' }).invoke(
    'Test'
  )
);

expectError(new OpenAiChatClient({ modelName: 'my-cool-chat-model' }));

expectError(new OpenAiChatClient({ deploymentId: 'test', apiKey: 'test' }));

expectType<Promise<AIMessageChunk>>(
  new OpenAiChatClient({ modelName: 'gpt-35-turbo' }).invoke('Test')
);

expectType<Promise<LLMResult>>(
  new OpenAiChatClient({ modelName: 'gpt-35-turbo' }).generate([['Test']])
);

expectType<Promise<number[]>>(
  new OpenAiEmbeddingClient({ modelName: 'text-embedding-3-large' }).embedQuery(
    'test'
  )
);

expectError(
  new OpenAiEmbeddingClient({ modelName: 'my-cool-embedding-model' })
);
