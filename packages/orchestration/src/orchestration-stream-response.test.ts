import { parseMockResponse } from '../../../test-util/mock-http.js';
import { OrchestrationStreamResponse } from './orchestration-stream-response.js';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';

describe('OrchestrationStreamResponse', () => {
  let mockChunkResponse: any;
  let mockCompleteSuccessResponse: any;
  let rawHttpResponse: HttpResponse;
  let streamResponse: OrchestrationStreamResponse<any>;

  beforeAll(async () => {
    mockChunkResponse = await parseMockResponse<any>(
      'orchestration',
      'orchestration-chat-completion-stream-chunk-response-token-usage-and-finish-reason.json'
    );
    mockCompleteSuccessResponse = await parseMockResponse<any>(
      'orchestration',
      'orchestration-stream-response-complete-success.json'
    );
    rawHttpResponse = {
      data: {},
      status: 200,
      headers: {},
      request: {}
    };
  });

  beforeEach(() => {
    streamResponse = new OrchestrationStreamResponse(rawHttpResponse);
  });

  it('should initialize with raw HTTP response', () => {
    expect(streamResponse.rawHttpResponse).toBe(rawHttpResponse);
  });

  it('should have empty data initially', () => {
    expect(streamResponse._data).toEqual({});
  });

  it('should have open stream initially', () => {
    expect(streamResponse._openStream).toBe(true);
  });

  describe('getRequestId', () => {
    it('should return request ID when available', () => {
      streamResponse._data = {
        request_id: '66172762-8c47-4438-89e7-2689be8f370b'
      };
      streamResponse._openStream = false;

      expect(streamResponse.getRequestId()).toBe(
        '66172762-8c47-4438-89e7-2689be8f370b'
      );
    });

    it('should return undefined when request ID is not set', () => {
      streamResponse._openStream = false;

      expect(streamResponse.getRequestId()).toBeUndefined();
    });

    it('should return request ID even when stream is open', () => {
      streamResponse._data = {
        request_id: 'c2a9c683-df21-9e11-b49a-81a66c265927'
      };
      streamResponse._openStream = true;

      expect(streamResponse.getRequestId()).toBe(
        'c2a9c683-df21-9e11-b49a-81a66c265927'
      );
    });

    it('should return request ID from actual mock data', () => {
      streamResponse._data = mockChunkResponse;
      streamResponse._openStream = false;

      expect(streamResponse.getRequestId()).toBe(
        '66172762-8c47-4438-89e7-2689be8f370b'
      );
    });

    it('should return request ID from complete success response', () => {
      streamResponse._data = mockCompleteSuccessResponse;
      streamResponse._openStream = false;

      expect(streamResponse.getRequestId()).toBe(
        'c2a9c683-df21-9e11-b49a-81a66c265927'
      );
    });
  });

  describe('getTokenUsage', () => {
    it('should return token usage when stream is closed', () => {
      streamResponse._data = mockChunkResponse;
      streamResponse._openStream = false;

      expect(streamResponse.getTokenUsage()).toMatchObject({
        completion_tokens: 271,
        prompt_tokens: 17,
        total_tokens: 288
      });
    });

    it('should return token usage from complete success response', () => {
      streamResponse._data = mockCompleteSuccessResponse;
      streamResponse._openStream = false;

      expect(streamResponse.getTokenUsage()).toMatchObject({
        completion_tokens: 50,
        prompt_tokens: 20,
        total_tokens: 70
      });
    });

    it('should throw error when stream is open', () => {
      streamResponse._data = mockChunkResponse;
      streamResponse._openStream = true;

      expect(() => streamResponse.getTokenUsage()).toThrow(
        'The stream is still open, the requested data is not available yet. Please wait until the stream is closed.'
      );
    });

    it('should return undefined when final_result is not set', () => {
      streamResponse._openStream = false;

      expect(streamResponse.getTokenUsage()).toBeUndefined();
    });
  });

  describe('getFinishReason', () => {
    it('should return finish reason for default index when stream is closed', () => {
      streamResponse._data = mockChunkResponse;
      streamResponse._openStream = false;

      expect(streamResponse.getFinishReason()).toBe('stop');
    });

    it('should return finish reason from complete success response', () => {
      streamResponse._data = mockCompleteSuccessResponse;
      streamResponse._openStream = false;

      expect(streamResponse.getFinishReason()).toBe('stop');
    });

    it('should throw error when stream is open', () => {
      streamResponse._data = mockChunkResponse;
      streamResponse._openStream = true;

      expect(() => streamResponse.getFinishReason()).toThrow(
        'The stream is still open, the requested data is not available yet. Please wait until the stream is closed.'
      );
    });

    it('should return undefined for non-existent choice index', () => {
      streamResponse._data = mockChunkResponse;
      streamResponse._openStream = false;

      expect(streamResponse.getFinishReason(1)).toBeUndefined();
    });
  });

  describe('getContent', () => {
    it('should return content for default index when stream is closed', () => {
      const dataWithMessage = {
        ...mockChunkResponse,
        final_result: {
          ...mockChunkResponse.final_result,
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: 'Hello! How can I assist you today?'
              },
              finish_reason: 'stop'
            }
          ]
        }
      };
      streamResponse._data = dataWithMessage;
      streamResponse._openStream = false;

      expect(streamResponse.getContent()).toBe(
        'Hello! How can I assist you today?'
      );
    });

    it('should return content from complete success response', () => {
      streamResponse._data = mockCompleteSuccessResponse;
      streamResponse._openStream = false;

      expect(streamResponse.getContent()).toBe(
        'Der Orchestrierungsdienst funktioniert!'
      );
    });

    it('should throw error when stream is open', () => {
      streamResponse._data = mockChunkResponse;
      streamResponse._openStream = true;

      expect(() => streamResponse.getContent()).toThrow(
        'The stream is still open, the requested data is not available yet. Please wait until the stream is closed.'
      );
    });

    it('should return undefined for non-existent choice index', () => {
      streamResponse._data = mockChunkResponse;
      streamResponse._openStream = false;

      expect(streamResponse.getContent(1)).toBeUndefined();
    });
  });

  describe('getToolCalls', () => {
    it('should return tool calls when present', () => {
      const dataWithToolCalls = {
        ...mockChunkResponse,
        final_result: {
          ...mockChunkResponse.final_result,
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: '',
                tool_calls: [
                  {
                    type: 'function',
                    function: {
                      name: 'get_weather',
                      arguments: '{"location": "Berlin"}'
                    }
                  }
                ]
              },
              finish_reason: 'tool_calls'
            }
          ]
        }
      };
      streamResponse._data = dataWithToolCalls;
      streamResponse._openStream = false;

      const toolCalls = streamResponse.getToolCalls();
      expect(toolCalls).toHaveLength(1);
      expect(toolCalls?.[0]).toMatchObject({
        type: 'function',
        function: {
          name: 'get_weather'
        }
      });
    });

    it('should return undefined when no tool calls present', () => {
      const dataWithMessage = {
        ...mockChunkResponse,
        final_result: {
          ...mockChunkResponse.final_result,
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: 'Hello!'
              },
              finish_reason: 'stop'
            }
          ]
        }
      };
      streamResponse._data = dataWithMessage;
      streamResponse._openStream = false;

      expect(streamResponse.getToolCalls()).toBeUndefined();
    });

    it('should throw error when stream is open', () => {
      streamResponse._data = mockChunkResponse;
      streamResponse._openStream = true;

      expect(() => streamResponse.getToolCalls()).toThrow(
        'The stream is still open, the requested data is not available yet. Please wait until the stream is closed.'
      );
    });
  });

  describe('getRefusal', () => {
    it('should return refusal message when present', () => {
      const dataWithRefusal = {
        ...mockChunkResponse,
        final_result: {
          ...mockChunkResponse.final_result,
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                refusal: 'I cannot help with that request.'
              },
              finish_reason: 'stop'
            }
          ]
        }
      };
      streamResponse._data = dataWithRefusal;
      streamResponse._openStream = false;

      expect(streamResponse.getRefusal()).toBe(
        'I cannot help with that request.'
      );
    });

    it('should return undefined when no refusal present', () => {
      const dataWithMessage = {
        ...mockChunkResponse,
        final_result: {
          ...mockChunkResponse.final_result,
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: 'Hello!'
              },
              finish_reason: 'stop'
            }
          ]
        }
      };
      streamResponse._data = dataWithMessage;
      streamResponse._openStream = false;

      expect(streamResponse.getRefusal()).toBeUndefined();
    });

    it('should throw error when stream is open', () => {
      streamResponse._data = mockChunkResponse;
      streamResponse._openStream = true;

      expect(() => streamResponse.getRefusal()).toThrow(
        'The stream is still open, the requested data is not available yet. Please wait until the stream is closed.'
      );
    });
  });

  describe('getAllMessages', () => {
    it('should return all messages including templating when stream is closed', () => {
      const dataWithMessages = {
        ...mockChunkResponse,
        intermediate_results: {
          ...mockChunkResponse.intermediate_results,
          templating: [{ role: 'user', content: 'Hello!' }]
        },
        final_result: {
          ...mockChunkResponse.final_result,
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: 'Hi! How can I help?'
              },
              finish_reason: 'stop'
            }
          ]
        }
      };
      streamResponse._data = dataWithMessages;
      streamResponse._openStream = false;

      const messages = streamResponse.getAllMessages();
      expect(messages).toHaveLength(2);
      expect(messages?.[0]).toMatchObject({
        role: 'user',
        content: 'Hello!'
      });
      expect(messages?.[1]).toMatchObject({
        role: 'assistant',
        content: 'Hi! How can I help?'
      });
    });

    it('should return all messages from complete success response', () => {
      streamResponse._data = mockCompleteSuccessResponse;
      streamResponse._openStream = false;

      const messages = streamResponse.getAllMessages();
      expect(messages).toHaveLength(2);
      expect(messages?.[0]).toMatchObject({
        role: 'user',
        content: 'Translate to German: `Orchestration Service is working!`'
      });
      expect(messages?.[1]).toMatchObject({
        role: 'assistant',
        content: 'Der Orchestrierungsdienst funktioniert!'
      });
    });

    it('should return only templating messages when no assistant message', () => {
      const dataWithTemplating = {
        intermediate_results: {
          templating: [
            {
              role: 'user',
              content:
                'Translate to German: `Orchestration Service is working!`'
            }
          ]
        },
        final_result: {
          choices: []
        }
      };
      streamResponse._data = dataWithTemplating;
      streamResponse._openStream = false;

      const messages = streamResponse.getAllMessages();
      expect(messages).toHaveLength(1);
      expect(messages?.[0]).toMatchObject({
        role: 'user',
        content: 'Translate to German: `Orchestration Service is working!`'
      });
    });

    it('should throw error when stream is open', () => {
      streamResponse._data = mockChunkResponse;
      streamResponse._openStream = true;

      expect(() => streamResponse.getAllMessages()).toThrow(
        'The stream is still open, the requested data is not available yet. Please wait until the stream is closed.'
      );
    });
  });

  describe('getAssistantMessage', () => {
    it('should return assistant message when stream is closed', () => {
      const dataWithMessage = {
        ...mockChunkResponse,
        final_result: {
          ...mockChunkResponse.final_result,
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: 'Hello! How can I assist you today?'
              },
              finish_reason: 'stop'
            }
          ]
        }
      };
      streamResponse._data = dataWithMessage;
      streamResponse._openStream = false;

      expect(streamResponse.getAssistantMessage()).toMatchObject({
        role: 'assistant',
        content: 'Hello! How can I assist you today?'
      });
    });

    it('should return assistant message from complete success response', () => {
      streamResponse._data = mockCompleteSuccessResponse;
      streamResponse._openStream = false;

      expect(streamResponse.getAssistantMessage()).toMatchObject({
        role: 'assistant',
        content: 'Der Orchestrierungsdienst funktioniert!'
      });
    });

    it('should throw error when stream is open', () => {
      streamResponse._data = mockChunkResponse;
      streamResponse._openStream = true;

      expect(() => streamResponse.getAssistantMessage()).toThrow(
        'The stream is still open, the requested data is not available yet. Please wait until the stream is closed.'
      );
    });
  });

  describe('getIntermediateResults', () => {
    it('should return intermediate results when stream is closed', () => {
      streamResponse._data = mockChunkResponse;
      streamResponse._openStream = false;

      const intermediateResults = streamResponse.getIntermediateResults();
      expect(intermediateResults).toBeDefined();
      expect(intermediateResults?.llm).toBeDefined();
    });

    it('should throw error when stream is open', () => {
      streamResponse._data = mockChunkResponse;
      streamResponse._openStream = true;

      expect(() => streamResponse.getIntermediateResults()).toThrow(
        'The stream is still open, the requested data is not available yet. Please wait until the stream is closed.'
      );
    });
  });

  describe('findChoiceByIndex', () => {
    it('should find choice by valid index', () => {
      streamResponse._data = mockChunkResponse;
      streamResponse._openStream = false;

      const choice = streamResponse.findChoiceByIndex(0);
      expect(choice).toBeDefined();
      expect(choice?.index).toBe(0);
      expect(choice?.finish_reason).toBe('stop');
    });

    it('should return undefined for invalid index', () => {
      streamResponse._data = mockChunkResponse;
      streamResponse._openStream = false;

      expect(streamResponse.findChoiceByIndex(99)).toBeUndefined();
    });

    it('should throw error when stream is open', () => {
      streamResponse._data = mockChunkResponse;
      streamResponse._openStream = true;

      expect(() => streamResponse.findChoiceByIndex(0)).toThrow(
        'The stream is still open, the requested data is not available yet. Please wait until the stream is closed.'
      );
    });
  });

  describe('stream getter and setter', () => {
    it('should throw error when stream is not set', () => {
      expect(() => streamResponse.stream).toThrow(
        'Response stream is undefined.'
      );
    });

    it('should return stream when set', () => {
      const mockStream = {} as any;
      streamResponse.stream = mockStream;

      expect(streamResponse.stream).toBe(mockStream);
    });
  });
});
