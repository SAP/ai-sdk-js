import { constructCompletionPostRequest } from './completion-request-builder.ts';

import type { CompletionRequestConfiguration } from '../client/api/schema/completion-request-configuration.ts';
import type { ModuleConfigs } from '../client/api/schema/index.ts';
import type {
  OrchestrationModuleConfig,
  ChatCompletionRequest
} from '../orchestration-types.ts';

describe('mergePromptWithMessages via constructCompletionPostRequest', () => {
  it('should throw when the prompt is still an unparsed string', () => {
    const config: OrchestrationModuleConfig = {
      promptTemplating: {
        prompt: 'template: [{ role: user }]' as any,
        model: { name: 'gpt-5.4' }
      }
    };

    expect(() => constructCompletionPostRequest(config)).toThrow(
      'Prompt must be parsed before merging with messages.'
    );
  });

  it('should reject an empty configured prompt even when history is provided', () => {
    const config: OrchestrationModuleConfig = {
      promptTemplating: {
        prompt: { template: [] },
        model: { name: 'gpt-5.4' }
      }
    };

    expect(() =>
      constructCompletionPostRequest(config, {
        messagesHistory: [{ role: 'user', content: 'Hello' }]
      })
    ).toThrow(
      'A configured prompt template must contain at least one message.'
    );
  });

  it('should reject missing prompt and history input', () => {
    const config: OrchestrationModuleConfig = {
      promptTemplating: {
        model: { name: 'gpt-5.4' }
      }
    };

    expect(() => constructCompletionPostRequest(config)).toThrow(
      'Either a prompt template, messages, or messagesHistory must be defined.'
    );
  });

  it('should omit the prompt when only non-empty messages history is provided', () => {
    const config: OrchestrationModuleConfig = {
      promptTemplating: {
        model: { name: 'gpt-5.4' }
      }
    };
    const messagesHistory = [{ role: 'user' as const, content: 'Hello' }];

    const result = constructCompletionPostRequest(config, {
      messagesHistory
    }) as CompletionRequestConfiguration;

    expect(result).toEqual({
      config: {
        modules: {
          prompt_templating: {
            model: { name: 'gpt-5.4' }
          }
        }
      },
      messages_history: messagesHistory
    });
  });

  it('should reject an empty messages history when no prompt or messages are provided', () => {
    const config: OrchestrationModuleConfig = {
      promptTemplating: {
        model: { name: 'gpt-5.4' }
      }
    };

    expect(() =>
      constructCompletionPostRequest(config, { messagesHistory: [] })
    ).toThrow(
      'Either a prompt template, messages, or messagesHistory must be defined.'
    );
  });

  it('should initialize the template from request messages when the prompt is undefined', () => {
    const config: OrchestrationModuleConfig = {
      promptTemplating: {
        model: { name: 'gpt-5.4' }
      }
    };
    const request: ChatCompletionRequest = {
      messages: [{ role: 'user', content: 'Hello' }]
    };

    const result = constructCompletionPostRequest(
      config,
      request
    ) as CompletionRequestConfiguration;

    expect(
      (result.config.modules as ModuleConfigs).prompt_templating.prompt
    ).toEqual({
      template: [{ role: 'user', content: 'Hello' }]
    });
  });
});
