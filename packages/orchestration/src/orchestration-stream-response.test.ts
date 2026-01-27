import { jest } from '@jest/globals';
import { createLogger } from '@sap-cloud-sdk/util';
import { parseMockResponse } from '../../../test-util/mock-http.js';
import { OrchestrationStreamResponse } from './orchestration-stream-response.js';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';

describe('OrchestrationStreamResponse', () => {
  let mockChunkResponse: any;
  let mockCompleteSuccessResponse: any;
  let rawResponse: HttpResponse;
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
    rawResponse = {
      data: {},
      status: 200,
      headers: {},
      request: {}
    };
  });

  beforeEach(() => {
    streamResponse = new OrchestrationStreamResponse(rawResponse);
  });

  function closeStream(data: any = mockChunkResponse): void {
    streamResponse._data = data;
    streamResponse._openStream = false;
  }

  it('should initialize with raw HTTP response and default state', () => {
    expect(streamResponse.rawResponse).toBe(rawResponse);
    expect(streamResponse._data).toEqual({});
    expect(streamResponse._openStream).toBe(true);
  });

  describe('stream open validation', () => {
    it('should throw error when accessing data while stream is open', () => {
      const errorMessage =
        'The stream is still open, the requested data is not available yet. Please wait until the stream is closed.';

      expect(() => streamResponse.getTokenUsage()).toThrow(errorMessage);
      expect(() => streamResponse.getFinishReason()).toThrow(errorMessage);
      expect(() => streamResponse.getContent()).toThrow(errorMessage);
      expect(() => streamResponse.getToolCalls()).toThrow(errorMessage);
      expect(() => streamResponse.getRefusal()).toThrow(errorMessage);
      expect(() => streamResponse.getAllMessages()).toThrow(errorMessage);
      expect(() => streamResponse.getAssistantMessage()).toThrow(errorMessage);
      expect(() => streamResponse.getIntermediateResults()).toThrow(
        errorMessage
      );
      expect(() => streamResponse.findChoiceByIndex(0)).toThrow(errorMessage);
    });
  });

  describe('getRequestId', () => {
    it('should return request ID from complete success response', () => {
      closeStream(mockCompleteSuccessResponse);

      expect(streamResponse.getRequestId()).toMatchInlineSnapshot(
        '"c2a9c683-df21-9e11-b49a-81a66c265927"'
      );
    });

    it('should return undefined when request ID is not set', () => {
      streamResponse._openStream = false;

      expect(streamResponse.getRequestId()).toBeUndefined();
    });

    it('should return request ID even when stream is open', () => {
      streamResponse._data = mockChunkResponse;
      streamResponse._openStream = true;

      expect(streamResponse.getRequestId()).toMatchInlineSnapshot(
        '"66172762-8c47-4438-89e7-2689be8f370b"'
      );
    });
  });

  describe('deprecated constructor', () => {
    it('should warn when constructed without rawResponse', () => {
      const logger = createLogger({
        package: 'orchestration',
        messageContext: 'orchestration-stream-response'
      });
      const warnSpy = jest.spyOn(logger, 'warn');

      new OrchestrationStreamResponse();

      expect(warnSpy).toHaveBeenCalledWith(
        'Constructing OrchestrationStreamResponse without raw HTTP response is deprecated and can lead to runtime errors when accessing `rawResponse`.'
      );
    });

    it('should throw error when accessing rawResponse after deprecated construction', () => {
      const response = new OrchestrationStreamResponse();

      expect(() => response.rawResponse).toThrow(
        'The raw response is not available. Please provide the raw response when constructing `OrchestrationStreamResponse`'
      );
    });
  });

  describe('getFinishReason', () => {
    it('should return finish reason for default index', () => {
      closeStream();

      expect(streamResponse.getFinishReason()).toBe('stop');
    });

    it('should return undefined for non-existent choice index', () => {
      closeStream();

      expect(streamResponse.getFinishReason(1)).toBeUndefined();
    });
  });

  describe('getContent', () => {
    it('should return content from response', () => {
      closeStream(mockCompleteSuccessResponse);

      expect(streamResponse.getContent()).toBe(
        'Der Orchestrierungsdienst funktioniert!'
      );
    });

    it('should return undefined for non-existent choice index', () => {
      closeStream();

      expect(streamResponse.getContent(1)).toBeUndefined();
    });
  });

  describe('getToolCalls', () => {
    it('should return tool calls when present', () => {
      closeStream({
        final_result: {
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                tool_calls: [
                  {
                    type: 'function',
                    function: {
                      name: 'get_weather',
                      arguments: '{"location": "Berlin"}'
                    }
                  }
                ]
              }
            }
          ]
        }
      });

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
      closeStream({
        final_result: {
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: 'Hello!'
              }
            }
          ]
        }
      });

      expect(streamResponse.getToolCalls()).toBeUndefined();
    });
  });

  describe('getRefusal', () => {
    it('should return refusal message when present', () => {
      closeStream({
        final_result: {
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                refusal: 'I cannot help with that request.'
              }
            }
          ]
        }
      });

      expect(streamResponse.getRefusal()).toBe(
        'I cannot help with that request.'
      );
    });

    it('should return undefined when no refusal present', () => {
      closeStream(mockCompleteSuccessResponse);

      expect(streamResponse.getRefusal()).toBeUndefined();
    });
  });

  describe('getAllMessages', () => {
    it('should return all messages including templating and assistant response', () => {
      closeStream(mockCompleteSuccessResponse);

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
      closeStream({
        intermediate_results: {
          templating: [{ role: 'user', content: 'Hello!' }]
        },
        final_result: {
          choices: []
        }
      } as any);

      const messages = streamResponse.getAllMessages();
      expect(messages).toHaveLength(1);
      expect(messages?.[0]).toMatchObject({
        role: 'user',
        content: 'Hello!'
      });
    });
  });

  describe('getAssistantMessage', () => {
    it('should return assistant message from response', () => {
      closeStream(mockCompleteSuccessResponse);

      expect(streamResponse.getAssistantMessage()).toMatchObject({
        role: 'assistant',
        content: 'Der Orchestrierungsdienst funktioniert!'
      });
    });
  });

  describe('getIntermediateResults', () => {
    it('should return intermediate results when available', () => {
      closeStream();

      const intermediateResults = streamResponse.getIntermediateResults();
      expect(intermediateResults).toBeDefined();
      expect(intermediateResults?.llm).toBeDefined();
    });
  });

  describe('findChoiceByIndex', () => {
    it('should find choice by valid index', () => {
      closeStream();

      const choice = streamResponse.findChoiceByIndex(0);
      expect(choice).toBeDefined();
      expect(choice?.index).toBe(0);
      expect(choice?.finish_reason).toBe('stop');
    });

    it('should return undefined for invalid index', () => {
      closeStream();

      expect(streamResponse.findChoiceByIndex(99)).toBeUndefined();
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
