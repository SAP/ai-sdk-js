import { jest } from '@jest/globals';
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { createAgent } from 'langchain';
import { AzureOpenAiChatClient } from '../openai/chat.js';
import { OrchestrationClient } from './client.js';
import { orchestrationPromptCachingMiddleware } from './prompt-caching-middleware.js';
import type { LanguageModelLike } from '@langchain/core/language_models/base';

function getBindToolsOptions(
  model: LanguageModelLike
): Record<string, unknown> | undefined {
  const bindToolsMock = (model as any).bindTools as jest.Mock;
  return bindToolsMock.mock.calls.at(-1)?.[1] as
    Record<string, unknown> | undefined;
}

function stubModel<T extends LanguageModelLike>(model: T): T {
  const bindToolsMock = jest.fn().mockReturnValue(model);
  const invokeMock = jest
    .fn()
    .mockResolvedValue(new AIMessage('Response from model') as never);

  Object.assign(model as object, {
    bindTools: bindToolsMock,
    invoke: invokeMock
  });

  return model;
}

function createSupportedModel(): LanguageModelLike {
  return stubModel(
    new OrchestrationClient({
      promptTemplating: {
        model: {
          name: 'gpt-5.4-nano',
          params: {}
        }
      }
    })
  );
}

function createUnsupportedModel(): LanguageModelLike {
  return stubModel(new AzureOpenAiChatClient({ modelName: 'gpt-5.4-nano' }));
}

describe('orchestrationPromptCachingMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds cache_control to modelSettings when conditions are met', async () => {
    const model = createSupportedModel();
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

    expect(model.bindTools).toHaveBeenCalled();
    expect(getBindToolsOptions(model)).toHaveProperty('cache_control');
    expect(getBindToolsOptions(model)?.cache_control).toEqual({
      type: 'ephemeral',
      ttl: '5m'
    });
  });

  it('does not add cache_control when message count is below threshold', async () => {
    const model = createSupportedModel();
    const middleware = orchestrationPromptCachingMiddleware({
      ttl: '1h',
      minMessagesToCache: 5
    });

    const agent = createAgent({ model, middleware: [middleware] });

    await agent.invoke({
      messages: [new HumanMessage('Hello'), new AIMessage('Hi there!')]
    });

    expect(model.bindTools).toHaveBeenCalled();
    expect(getBindToolsOptions(model)?.cache_control).toBeUndefined();
  });

  it('skips cache_control when enableCaching is false', async () => {
    const model = createSupportedModel();
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

    expect(getBindToolsOptions(model)?.cache_control).toBeUndefined();
  });

  it('includes the system message in the threshold count', async () => {
    const model = createSupportedModel();
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

    expect(getBindToolsOptions(model)).toHaveProperty('cache_control');
    expect(getBindToolsOptions(model)?.cache_control).toEqual({
      type: 'ephemeral',
      ttl: '1h'
    });
  });

  describe('non-Orchestration models', () => {
    it('warns and skips caching for non-OrchestrationClient models by default', async () => {
      const model = createUnsupportedModel();
      const middleware = orchestrationPromptCachingMiddleware({
        minMessagesToCache: 1
      });

      const agent = createAgent({ model, middleware: [middleware] });

      await expect(
        agent.invoke({ messages: [new HumanMessage('Hello')] })
      ).resolves.toBeDefined();

      expect(getBindToolsOptions(model)?.cache_control).toBeUndefined();
    });

    it('throws when unsupportedModelBehavior is raise', async () => {
      const model = createUnsupportedModel();
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
      const model = createUnsupportedModel();
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
