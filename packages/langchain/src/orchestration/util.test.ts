import {
  AIMessage,
  AIMessageChunk,
  HumanMessage,
  SystemMessage,
  ToolMessage
} from '@langchain/core/messages';
import { OrchestrationStreamChunkResponse } from '@sap-ai-sdk/orchestration';
import {
  mapLangchainMessagesToOrchestrationMessages,
  mapOutputToChatResult,
  setFinishReason,
  setTokenUsage,
  computeTokenIndices
} from './util.js';
import type { OrchestrationMessage } from './orchestration-message.js';
import type {
  CompletionPostResponse,
  MessageToolCall,
  TokenUsage
} from '@sap-ai-sdk/orchestration';

describe('mapLangchainMessagesToOrchestrationMessages', () => {
  it('should map an array of LangChain messages to Orchestration messages', () => {
    const langchainMessages = [
      new SystemMessage('System message content'),
      new HumanMessage('Human message content'),
      new AIMessage('AI message content')
    ];

    const result =
      mapLangchainMessagesToOrchestrationMessages(langchainMessages);

    expect(result).toEqual([
      { role: 'system', content: 'System message content' },
      { role: 'user', content: 'Human message content' },
      { role: 'assistant', content: 'AI message content' }
    ]);
  });

  it('should throw error for unsupported message types', () => {
    const langchainMessages = [
      new ToolMessage('Tool message content', 'tool-id')
    ];

    expect(() =>
      mapLangchainMessagesToOrchestrationMessages(langchainMessages)
    ).toThrow('Unsupported message type: tool');
  });
});

describe('mapBaseMessageToChatMessage', () => {
  it('should map HumanMessage to ChatMessage with user role', () => {
    const humanMessage = new HumanMessage('Human message content');

    // Since mapBaseMessageToChatMessage is internal, we'll test it through mapLangchainMessagesToOrchestrationMessages
    const result = mapLangchainMessagesToOrchestrationMessages([humanMessage]);

    expect(result[0]).toEqual({
      role: 'user',
      content: 'Human message content'
    });
  });

  it('should map SystemMessage to ChatMessage with system role', () => {
    const systemMessage = new SystemMessage('System message content');

    const result = mapLangchainMessagesToOrchestrationMessages([systemMessage]);

    expect(result[0]).toEqual({
      role: 'system',
      content: 'System message content'
    });
  });

  it('should map AIMessage to ChatMessage with assistant role', () => {
    const aiMessage = new AIMessage('AI message content');

    const result = mapLangchainMessagesToOrchestrationMessages([aiMessage]);

    expect(result[0]).toEqual({
      role: 'assistant',
      content: 'AI message content'
    });
  });

  it('should throw error when mapping SystemMessage with image_url content', () => {
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
      mapLangchainMessagesToOrchestrationMessages([systemMessage])
    ).toThrow(
      'System messages with image URLs are not supported by the Orchestration Client.'
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

describe('setFinishReason', () => {
  it('should set finish reason on message chunk when provided', () => {
    const messageChunk = new AIMessageChunk({ content: 'Test content' });

    setFinishReason(messageChunk, 'stop');

    expect(messageChunk.response_metadata.finish_reason).toBe('stop');
  });

  it('should not modify response_metadata when finish reason is falsy', () => {
    const messageChunk = new AIMessageChunk({ content: 'Test content' });
    const originalMetadata = { ...messageChunk.response_metadata };

    setFinishReason(messageChunk, '');

    expect(messageChunk.response_metadata).toEqual(originalMetadata);
  });
});

describe('setTokenUsage', () => {
  it('should set token usage metadata when provided', () => {
    const messageChunk = new AIMessageChunk({ content: 'Test content' });
    const tokenUsage: TokenUsage = {
      completion_tokens: 10,
      prompt_tokens: 20,
      total_tokens: 30
    };

    setTokenUsage(messageChunk, tokenUsage);

    expect(messageChunk.usage_metadata).toEqual({
      input_tokens: 20,
      output_tokens: 10,
      total_tokens: 30
    });
    expect(messageChunk.response_metadata.token_usage).toEqual(tokenUsage);
  });

  it('should not modify message chunk when token usage is undefined', () => {
    const messageChunk = new AIMessageChunk({
      content: 'Test content',
      response_metadata: { finish_reason: 'stop' }
    });

    setTokenUsage(messageChunk, undefined);

    expect(messageChunk.usage_metadata).toBeUndefined();
    expect(messageChunk.response_metadata.token_usage).toBeUndefined();
    expect(messageChunk.response_metadata.finish_reason).toBe('stop');
  });
});

describe('computeTokenIndices', () => {
  it('should compute token indices with choice index from chunk', () => {
    const mockChunk = new OrchestrationStreamChunkResponse({
      request_id: 'req-123',
      orchestration_result: {
        id: 'test-id',
        object: 'chat.completion.chunk',
        created: 1634840000,
        model: 'test-model',
        system_fingerprint: 'fp_123',
        choices: [
          {
            index: 0,
            delta: { content: 'Test' }
          }
        ]
      }
    });

    const result = computeTokenIndices(mockChunk);

    expect(result).toEqual({
      prompt: 0,
      completion: 0
    });
  });
});
