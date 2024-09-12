import { expectError, expectType } from 'tsd';
import {
  OpenAiChatCompletionOutput,
  OpenAiEmbeddingOutput,
  OpenAiChatClient,
  OpenAiEmbeddingClient,
  OpenAiChatCompletionResponse,
  OpenAiUsage
} from '@sap-ai-sdk/foundation-models';

/**
 * Chat completion.
 */
expectType<Promise<OpenAiChatCompletionResponse>>(
  new OpenAiChatClient('gpt-4').run({
    messages: [{ role: 'user', content: 'test prompt' }]
  })
);

/**
 * Chat Completion with custom model.
 */
expectType(
  new OpenAiChatClient('unknown').run({
    messages: [{ role: 'user', content: 'test prompt' }]
  })
);

expectType<OpenAiChatCompletionOutput>(
  (
    await new OpenAiChatClient('gpt-4').run({
      messages: [{ role: 'user', content: 'test prompt' }]
    })
  ).data
);

expectType<string | undefined>(
  (
    await new OpenAiChatClient('gpt-4').run({
      messages: [{ role: 'user', content: 'test prompt' }]
    })
  ).getContent()
);

expectType<string | undefined>(
  (
    await new OpenAiChatClient('gpt-4').run({
      messages: [{ role: 'user', content: 'test prompt' }]
    })
  ).getFinishReason()
);

expectType<OpenAiUsage>(
  (
    await new OpenAiChatClient('gpt-4').run({
      messages: [{ role: 'user', content: 'test prompt' }]
    })
  ).getTokenUsage()
);

/**
 * Chat completion with optional parameters.
 */
expectType<Promise<OpenAiChatCompletionResponse>>(
  new OpenAiChatClient({
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
expectType<Promise<OpenAiEmbeddingOutput>>(
  new OpenAiEmbeddingClient('text-embedding-ada-002').run({
    input: 'test input'
  })
);

expectType<OpenAiEmbeddingClient>(new OpenAiEmbeddingClient('unknown'));

/**
 * Embeddings with optional parameters.
 */
expectType<Promise<OpenAiEmbeddingOutput>>(
  new OpenAiEmbeddingClient('text-embedding-ada-002').run(
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
