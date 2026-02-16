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

  describe('getRequestId', () => {
    it('should return request ID from complete success response', () => {
      streamResponse._data = mockCompleteSuccessResponse;
      streamResponse._openStream = false;

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
});
