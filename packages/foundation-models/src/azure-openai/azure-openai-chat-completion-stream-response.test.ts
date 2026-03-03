import { AzureOpenAiChatCompletionStreamResponse } from './azure-openai-chat-completion-stream-response.js';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';

describe('AzureOpenAiChatCompletionStreamResponse', () => {
  let rawResponse: HttpResponse;
  let streamResponse: AzureOpenAiChatCompletionStreamResponse<any>;

  beforeEach(() => {
    rawResponse = {
      data: {},
      status: 200,
      headers: { 'x-request-id': 'test-request-id-123' },
      request: {}
    };
    streamResponse = new AzureOpenAiChatCompletionStreamResponse(rawResponse);
  });

  it('should initialize with raw HTTP response', () => {
    expect(streamResponse.rawResponse).toBe(rawResponse);
  });

  describe('rawResponse', () => {
    it('should return the raw HTTP response', () => {
      expect(streamResponse.rawResponse).toBe(rawResponse);
      expect(streamResponse.rawResponse.status).toBe(200);
    });

    it('should throw error when constructed without rawResponse', () => {
      const response = new AzureOpenAiChatCompletionStreamResponse();

      expect(() => response.rawResponse).toThrow(
        'The raw response is not available. Please provide the raw response when constructing `AzureOpenAiChatCompletionStreamResponse`.'
      );
    });
  });

  describe('getRequestId', () => {
    it('should return request ID from response headers', () => {
      expect(streamResponse.getRequestId()).toBe('test-request-id-123');
    });

    it('should return undefined when header is not present', () => {
      const responseWithoutId =
        new AzureOpenAiChatCompletionStreamResponse<any>({
          data: {},
          status: 200,
          headers: {},
          request: {}
        });

      expect(responseWithoutId.getRequestId()).toBeUndefined();
    });

    it('should return undefined when constructed without rawResponse', () => {
      const response = new AzureOpenAiChatCompletionStreamResponse();

      expect(response.getRequestId()).toBeUndefined();
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

  describe('getFinishReason', () => {
    it('should return undefined when no finish reason is set', () => {
      expect(streamResponse.getFinishReason()).toBeUndefined();
    });
  });

  describe('getTokenUsage', () => {
    it('should return undefined when no usage is set', () => {
      expect(streamResponse.getTokenUsage()).toBeUndefined();
    });
  });

  describe('getToolCalls', () => {
    it('should return undefined when no tool calls are set', () => {
      expect(streamResponse.getToolCalls()).toBeUndefined();
    });
  });
});
