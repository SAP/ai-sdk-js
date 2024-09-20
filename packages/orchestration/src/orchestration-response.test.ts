import { parseMockResponse } from '../../../test-util/mock-http';
import { CompletionPostResponse } from './client/api/schema/index.js';
import { OrchestrationResponse } from './orchestration-response';
import { completionPostResponseSchema } from './ts-to-zod/completion-post-response.zod.js';

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
    const data = completionPostResponseSchema.parse(orchestrationResponse.data);
    expect(data).toStrictEqual(mockResponse);
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
    expect(orchestrationResponse.getFinishReason(1)).toBeUndefined();
    expect(orchestrationResponse.getContent(1)).toBeUndefined();
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
