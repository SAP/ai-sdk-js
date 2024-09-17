import { expectType } from 'tsd';
import {
  type AzureOpenAiChatModel,
  AzureOpenAiChatCompletionOutput,
  AzureOpenAiEmbeddingOutput,
  AzureOpenAiChatClient,
  AzureOpenAiEmbeddingClient,
  AzureOpenAiChatCompletionResponse,
  AzureOpenAiUsage
} from '@sap-ai-sdk/foundation-models';

/**
 * Chat completion.
 */
expectType<Promise<AzureOpenAiChatCompletionResponse>>(
  new AzureOpenAiChatClient('gpt-4').run({
    messages: [{ role: 'user', content: 'test prompt' }]
  })
);

/**
 * Chat Completion with custom model.
 */
expectType(
  new AzureOpenAiChatClient('unknown').run({
    messages: [{ role: 'user', content: 'test prompt' }]
  })
);

expectType<AzureOpenAiChatCompletionOutput>(
  (
    await new AzureOpenAiChatClient('gpt-4').run({
      messages: [{ role: 'user', content: 'test prompt' }]
    })
  ).data
);

expectType<string | undefined>(
  (
    await new AzureOpenAiChatClient('gpt-4').run({
      messages: [{ role: 'user', content: 'test prompt' }]
    })
  ).getContent()
);

expectType<string | undefined>(
  (
    await new AzureOpenAiChatClient('gpt-4').run({
      messages: [{ role: 'user', content: 'test prompt' }]
    })
  ).getFinishReason()
);

expectType<AzureOpenAiUsage>(
  (
    await new AzureOpenAiChatClient('gpt-4').run({
      messages: [{ role: 'user', content: 'test prompt' }]
    })
  ).getTokenUsage()
);

/**
 * Chat completion with optional parameters.
 */
expectType<Promise<AzureOpenAiChatCompletionResponse>>(
  new AzureOpenAiChatClient({
    modelName: 'gpt-4',
    modelVersion: 'latest'
  }).run(
    {
      messages: [{ role: 'user', content: 'test prompt' }],
      response_format: {
        type: 'text'
      },
      seed: 42,
      tools: [
        {
          type: 'function',
          function: {
            name: 'function 1',
            description: 'description 1',
            parameters: {
              param1: 'value1'
            }
          }
        }
      ],
      tool_choice: {
        type: 'function',
        function: {
          name: 'function 1'
        }
      }
    },
    {
      params: {
        apiVersion: '2024-02-01'
      }
    }
  )
);

/**
 * Embeddings.
 */
expectType<Promise<AzureOpenAiEmbeddingOutput>>(
  new AzureOpenAiEmbeddingClient('text-embedding-ada-002').run({
    input: 'test input'
  })
);

expectType<AzureOpenAiEmbeddingClient>(
  new AzureOpenAiEmbeddingClient('unknown')
);

/**
 * Embeddings with optional parameters.
 */
expectType<Promise<AzureOpenAiEmbeddingOutput>>(
  new AzureOpenAiEmbeddingClient('text-embedding-ada-002').run(
    {
      input: ['test input 1', 'test input 2'],
      user: 'some-guid'
    },
    {
      params: {
        apiVersion: '2024-02-01'
      }
    }
  )
);

expect<AzureOpenAiChatModel>('custom-model');
expect<AzureOpenAiChatModel>('gpt-4-32k');
