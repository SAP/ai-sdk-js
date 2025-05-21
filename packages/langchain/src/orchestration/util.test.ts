import {
  AIMessage,
  FunctionMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage
} from '@langchain/core/messages';
import {
  mapLangChainMessagesToOrchestrationMessages,
  mapOutputToChatResult
} from './util.js';
import type { OrchestrationMessage } from './orchestration-message.js';
import type {
  CompletionPostResponse,
  MessageToolCall
} from '@sap-ai-sdk/orchestration';

describe('mapLangChainMessagesToOrchestrationMessages', () => {
  it('should map an array of LangChain messages to Orchestration messages', () => {
    const langchainMessages = [
      new SystemMessage('System message content'),
      new HumanMessage('Human message content'),
      new AIMessage('AI message content'),
      new ToolMessage('Tool message content', 'tool_call_id')
    ];

    const result =
      mapLangChainMessagesToOrchestrationMessages(langchainMessages);

    expect(result).toEqual([
      { role: 'system', content: 'System message content' },
      { role: 'user', content: 'Human message content' },
      { role: 'assistant', content: 'AI message content' },
      { role: 'tool', content: 'Tool message content', tool_call_id: 'tool_call_id' }
    ]);
  });

  it('should throw error for unsupported message types', () => {
    const langchainMessages = [
      new FunctionMessage('Function message content', 'function_name')
    ];

    expect(() =>
      mapLangChainMessagesToOrchestrationMessages(langchainMessages)
    ).toThrow('Unsupported message type: function');
  });
});

describe('mapBaseMessageToChatMessage', () => {
  it('should map HumanMessage to ChatMessage with user role', () => {
    const humanMessage = new HumanMessage('Human message content');

    // Since mapBaseMessageToChatMessage is internal, we'll test it through mapLangChainMessagesToOrchestrationMessages
    const result = mapLangChainMessagesToOrchestrationMessages([humanMessage]);

    expect(result[0]).toEqual({
      role: 'user',
      content: 'Human message content'
    });
  });

  it('should map SystemMessage to ChatMessage with system role', () => {
    const systemMessage = new SystemMessage('System message content');

    const result = mapLangChainMessagesToOrchestrationMessages([systemMessage]);

    expect(result[0]).toEqual({
      role: 'system',
      content: 'System message content'
    });
  });

  it('should map AIMessage to ChatMessage with assistant role', () => {
    const aiMessage = new AIMessage('AI message content');

    const result = mapLangChainMessagesToOrchestrationMessages([aiMessage]);

    expect(result[0]).toEqual({
      role: 'assistant',
      content: 'AI message content'
    });
  });

  it('should map ToolMessage to ChatMessage with tool role', () => {
    const toolMessage = new ToolMessage('Tool message content', 'tool_call_id');
    const result = mapLangChainMessagesToOrchestrationMessages([toolMessage]);
    expect(result[0]).toEqual({
      role: 'tool',
      content: 'Tool message content',
      tool_call_id: 'tool_call_id'
    });
  });

  it('should throw error when mapping SystemMessage with unsupported content type like `image_url`', () => {
    const systemMessage = new SystemMessage({
      content: [
        { type: 'text', text: 'System text' },
        {
          type: 'image_url',
          image_url: { url: 'https://example.com/image.jpg' }
        }
      ]
    });

    expect(() =>
      mapLangChainMessagesToOrchestrationMessages([systemMessage])
    ).toThrow(
      'The content type of system message can only be "text" the Orchestration Client.'
    );
  });

  it('should throw error when mapping ToolMessage with unsupported content type like `image_url`', () => {
    const toolMessage = new ToolMessage({
      content: [
        { type: 'text', text: 'System text' },
        {
          type: 'image_url',
          image_url: { url: 'https://example.com/image.jpg' }
        }
      ]
    }, 'tool_call_id');

    expect(() =>
      mapLangChainMessagesToOrchestrationMessages([toolMessage])
    ).toThrow(
      'The content type of tool message can only be "text" the Orchestration Client.'
    );
  });
});

describe('mapOutputToChatResult', () => {
  it('should map CompletionPostResponse to ChatResult', () => {
    const completionResponse: CompletionPostResponse = {
      orchestration_result: {
        id: 'test-id',
        object: 'chat.completion',
        created: 1634840000,
        model: 'test-model',
        choices: [
          {
            message: {
              content: 'Test content',
              role: 'assistant'
            },
            finish_reason: 'stop',
            index: 0
          }
        ],
        usage: {
          completion_tokens: 10,
          prompt_tokens: 20,
          total_tokens: 30
        }
      },
      request_id: 'req-123',
      module_results: {}
    };

    const result = mapOutputToChatResult(completionResponse);

    expect(result.generations).toHaveLength(1);
    expect(result.generations[0].text).toBe('Test content');
    expect(result.generations[0].message.content).toBe('Test content');
    expect(result.generations[0].generationInfo).toEqual({
      finish_reason: 'stop',
      index: 0,
      function_call: undefined,
      tool_calls: undefined
    });
    expect(result.llmOutput).toEqual({
      created: 1634840000,
      id: 'test-id',
      model: 'test-model',
      object: 'chat.completion',
      tokenUsage: {
        completionTokens: 10,
        promptTokens: 20,
        totalTokens: 30
      }
    });
  });

  it('should map tool_calls correctly', () => {
    const toolCallData: MessageToolCall = {
      id: 'call-123',
      type: 'function',
      function: {
        name: 'test_function',
        arguments: '{"arg1":"value1"}'
      }
    };

    const completionResponse: CompletionPostResponse = {
      orchestration_result: {
        id: 'test-id',
        object: 'chat.completion',
        created: 1634840000,
        model: 'test-model',
        choices: [
          {
            index: 0,
            message: {
              content: 'Test content',
              role: 'assistant',
              tool_calls: [toolCallData]
            },
            finish_reason: 'tool_calls'
          }
        ],
        usage: {
          completion_tokens: 10,
          prompt_tokens: 20,
          total_tokens: 30
        }
      },
      request_id: 'req-123',
      module_results: {}
    };

    const result = mapOutputToChatResult(completionResponse);

    expect(
      (result.generations[0].message as OrchestrationMessage).tool_calls
    ).toEqual([
      {
        id: 'call-123',
        name: 'test_function',
        args: { arg1: 'value1' },
        type: 'tool_call'
      }
    ]);
  });
});
