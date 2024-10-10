import { createLogger } from '@sap-cloud-sdk/util';
import { jest } from '@jest/globals';
import { parseMockResponse } from '../../../test-util/mock-http.js';
import { OrchestrationResponse } from './orchestration-response.js';
import type { CompletionPostResponse } from './client/api/schema';

describe('OrchestrationResponse', () => {
  const mockResponse = parseMockResponse<CompletionPostResponse>(
    'orchestration',
    'orchestration-chat-completion-success-response.json'
  );
  const rawResponse = {
    data: mockResponse,
    status: 200,
    headers: {},
    request: {}
  };
  let orchestrationResponse = new OrchestrationResponse(rawResponse);

  it('should initialize with raw response', () => {
    expect(orchestrationResponse.rawResponse).toBe(rawResponse);
  });

  it('should return the completion response', () => {
    expect(orchestrationResponse.data).toStrictEqual(mockResponse);
  });

  it('should get token usage', () => {
    expect(orchestrationResponse.getTokenUsage()).toMatchObject({
      completion_tokens: expect.any(Number),
      prompt_tokens: expect.any(Number),
      total_tokens: expect.any(Number)
    });
  });

  it('should return default choice index with convenience functions', () => {
    expect(orchestrationResponse.getFinishReason()).toBe('stop');
    expect(orchestrationResponse.getContent()).toBe(
      'Hello! How can I assist you today?'
    );
  });

  it('should return undefined when convenience function is called with incorrect index', () => {
    const logger = createLogger({
      package: 'orchestration',
      messageContext: 'orchestration-response'
    });
    const errorSpy = jest.spyOn(logger, 'error');
    expect(orchestrationResponse.getFinishReason(1)).toBeUndefined();
    expect(errorSpy).toHaveBeenCalledWith('Choice index 1 is out of bounds.');
    expect(orchestrationResponse.getContent(1)).toBeUndefined();
    expect(errorSpy).toHaveBeenCalledTimes(2);
  });

  it('should throw if content that was filtered is accessed', () => {
    mockResponse.orchestration_result.choices = [
      {
        index: 0,
        message: {
          role: 'assistant',
          content: ''
        },
        finish_reason: 'content_filter'
      }
    ];
    orchestrationResponse = new OrchestrationResponse({
      ...rawResponse,
      data: mockResponse
    });
    expect(() =>
      orchestrationResponse.getContent()
    ).toThrowErrorMatchingInlineSnapshot(
      '"Content generated by the LLM was filtered by the output filter. Please try again with a different prompt or filter configuration."'
    );
  });
});
