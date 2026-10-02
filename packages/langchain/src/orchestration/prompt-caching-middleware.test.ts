import {
  AIMessage,
  AIMessageChunk,
  HumanMessage
} from '@langchain/core/messages';
import { createAgent } from 'langchain';

import { AzureOpenAiChatClient } from '../openai/chat.ts';
import { OrchestrationClient } from './client.ts';
import { OrchestrationMessageChunk } from './orchestration-message-chunk.ts';
import { orchestrationPromptCachingMiddleware } from './prompt-caching-middleware/index.ts';

import type { MockInstance } from 'vitest';

interface StubbedOrchestrationModel {
  model: OrchestrationClient;
  bindToolsMock: MockInstance<OrchestrationClient['bindTools']>;
}

interface StubbedAzureOpenAiModel {
  model: AzureOpenAiChatClient;
  bindToolsMock: MockInstance<AzureOpenAiChatClient['bindTools']>;
}

function createSupportedModel(): StubbedOrchestrationModel {
  const model = new OrchestrationClient({
    promptTemplating: {
      model: {
        name: 'gpt-5.4-nano',
        params: {}
      }
    }
  });
  const bindToolsMock = vi.spyOn(model, 'bindTools').mockReturnValue(model);
  vi.spyOn(model, 'invoke').mockResolvedValue(
    new OrchestrationMessageChunk('Response from model', {}, 'request-id')
  );

  return { model, bindToolsMock };
}

function createUnsupportedModel(): StubbedAzureOpenAiModel {
  const model = new AzureOpenAiChatClient({ modelName: 'gpt-5.4-nano' });
  const bindToolsMock = vi.spyOn(model, 'bindTools').mockReturnValue(model);
  vi.spyOn(model, 'invoke').mockResolvedValue(
    new AIMessageChunk('Response from model')
  );

  return { model, bindToolsMock };
}

describe('orchestrationPromptCachingMiddleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds cache_control to modelSettings when conditions are met', async () => {
    const { model, bindToolsMock } = createSupportedModel();
    const middleware = orchestrationPromptCachingMiddleware({
      ttl: '5m',
      minMessagesToCache: 3
    });

    const agent = createAgent({ model, middleware: [middleware] });

    await agent.invoke({
      messages: [
        new HumanMessage('Hello'),
        new AIMessage('Hi there!'),
        new HumanMessage('How are you?')
      ]
    });

    expect(bindToolsMock).toHaveBeenCalled();
    const bindToolsOptions = bindToolsMock.mock.calls.at(-1)?.[1];
    expect(bindToolsOptions).toHaveProperty('cache_control');
    expect(bindToolsOptions?.cache_control).toEqual({
      type: 'ephemeral',
      ttl: '5m'
    });
  });

  it('does not add cache_control when message count is below threshold', async () => {
    const { model, bindToolsMock } = createSupportedModel();
    const middleware = orchestrationPromptCachingMiddleware({
      ttl: '1h',
      minMessagesToCache: 5
    });

    const agent = createAgent({ model, middleware: [middleware] });

    await agent.invoke({
      messages: [new HumanMessage('Hello'), new AIMessage('Hi there!')]
    });

    expect(bindToolsMock).toHaveBeenCalled();
    expect(bindToolsMock.mock.calls.at(-1)?.[1]?.cache_control).toBeUndefined();
  });

  it('skips cache_control when enableCaching is false', async () => {
    const { model, bindToolsMock } = createSupportedModel();
    const middleware = orchestrationPromptCachingMiddleware({
      enableCaching: false,
      minMessagesToCache: 1
    });

    const agent = createAgent({ model, middleware: [middleware] });

    await agent.invoke({
      messages: [
        new HumanMessage('Hello'),
        new AIMessage('Hi there!'),
        new HumanMessage('How are you?')
      ]
    });

    expect(bindToolsMock.mock.calls.at(-1)?.[1]?.cache_control).toBeUndefined();
  });

  it('includes the system message in the threshold count', async () => {
    const { model, bindToolsMock } = createSupportedModel();
    const middleware = orchestrationPromptCachingMiddleware({
      ttl: '1h',
      minMessagesToCache: 3
    });

    const agent = createAgent({
      model,
      systemPrompt: 'You are a helpful assistant',
      middleware: [middleware]
    });

    // Only 2 messages, but system prompt pushes the total to 3.
    await agent.invoke({
      messages: [new HumanMessage('Hello'), new AIMessage('Hi there!')]
    });

    const bindToolsOptions = bindToolsMock.mock.calls.at(-1)?.[1];
    expect(bindToolsOptions).toHaveProperty('cache_control');
    expect(bindToolsOptions?.cache_control).toEqual({
      type: 'ephemeral',
      ttl: '1h'
    });
  });

  describe('non-Orchestration models', () => {
    it('warns and skips caching for non-OrchestrationClient models by default', async () => {
      const { model, bindToolsMock } = createUnsupportedModel();
      const middleware = orchestrationPromptCachingMiddleware({
        minMessagesToCache: 1
      });

      const agent = createAgent({ model, middleware: [middleware] });

      await expect(
        agent.invoke({ messages: [new HumanMessage('Hello')] })
      ).resolves.toBeDefined();

      expect(bindToolsMock.mock.calls.at(-1)?.[1]).not.toHaveProperty(
        'cache_control'
      );
    });

    it('throws when unsupportedModelBehavior is raise', async () => {
      const { model } = createUnsupportedModel();
      const middleware = orchestrationPromptCachingMiddleware({
        unsupportedModelBehavior: 'raise',
        minMessagesToCache: 1
      });

      const agent = createAgent({ model, middleware: [middleware] });

      await expect(
        agent.invoke({ messages: [new HumanMessage('Hello')] })
      ).rejects.toThrow(
        "Unsupported model 'AzureOpenAiChatClient'. orchestrationPromptCachingMiddleware requires an OrchestrationClient"
      );
    });

    it('prefers runtime context unsupportedModelBehavior over middleware options', async () => {
      const { model } = createUnsupportedModel();
      const middleware = orchestrationPromptCachingMiddleware({
        unsupportedModelBehavior: 'warn',
        minMessagesToCache: 1
      });

      const agent = createAgent({ model, middleware: [middleware] });

      await expect(
        agent.invoke(
          { messages: [new HumanMessage('Hello')] },
          {
            context: {
              unsupportedModelBehavior: 'raise'
            }
          }
        )
      ).rejects.toThrow(
        "Unsupported model 'AzureOpenAiChatClient'. orchestrationPromptCachingMiddleware requires an OrchestrationClient"
      );
    });
  });
});
