import {
  AIMessage,
  HumanMessage,
  RemoveMessage,
  SystemMessage,
  ToolMessage
} from '@langchain/core/messages';
import { parseMockResponse } from '../../../../test-util/mock-http.js';
import { mapLangchainToAiClient, mapOutputToChatResult } from './util.js';
import { AzureOpenAiChatClient } from './chat.js';
import type { BaseMessage } from '@langchain/core/messages';
import type {
  AzureOpenAiCreateChatCompletionResponse,
  AzureOpenAiCreateChatCompletionRequest
} from '@sap-ai-sdk/foundation-models';
import type { AzureOpenAiChatCallOptions } from './types.js';

const openAiMockResponse =
  parseMockResponse<AzureOpenAiCreateChatCompletionResponse>(
    'foundation-models',
    'azure-openai-chat-completion-success-response.json'
  );

// Signal and Prompt Index are provided by the super class in every call
const defaultOptions = {
  signal: undefined,
  promptIndex: 0
};

describe('Mapping Functions', () => {
  it('should parse an OpenAI response to a (LangChain) chat response', async () => {
    const result = mapOutputToChatResult(openAiMockResponse);
    expect(result).toMatchSnapshot();
  });

  it('should parse a LangChain input to an AI SDK input', async () => {
    const langchainPrompt: BaseMessage[] = [
      new ToolMessage('Tool Test Content', 'test-id'),
      new HumanMessage('Human Test Content'),
      new SystemMessage('System Test Content'),
      new AIMessage('AI Test Content')
    ];

    const request: AzureOpenAiCreateChatCompletionRequest = {
      messages: [
        {
          role: 'tool',
          content: 'Tool Test Content',
          tool_call_id: 'test-id'
        },
        {
          role: 'user',
          content: 'Human Test Content'
        },
        {
          role: 'system',
          content: 'System Test Content'
        },
        {
          role: 'assistant',
          content: 'AI Test Content'
        }
      ],
      tools: [{ type: 'function', function: { name: 'test', parameters: {} } }],
      tool_choice: 'auto',
      functions: [{ name: 'random' }, { name: 'test' }]
    };
    const client = new AzureOpenAiChatClient({ modelName: 'gpt-35-turbo' });
    const options: AzureOpenAiChatCallOptions = {
      tools: [{ type: 'function', function: { name: 'test', parameters: {} } }],
      tool_choice: 'auto',
      functions: [{ name: 'random' }, { name: 'test' }]
    };
    const mapping = mapLangchainToAiClient(client, langchainPrompt, {
      ...defaultOptions,
      ...options
    });
    expect(mapping).toMatchObject(request);
  });

  it('throws an error if the message type is not supported', async () => {
    const langchainPrompt: BaseMessage[] = [
      new RemoveMessage({ id: 'test-id' })
    ];
    const client = new AzureOpenAiChatClient({ modelName: 'gpt-35-turbo' });
    expect(() =>
      mapLangchainToAiClient(client, langchainPrompt, defaultOptions)
    ).toThrowErrorMatchingInlineSnapshot('"Unsupported message type: remove"');
  });
});
