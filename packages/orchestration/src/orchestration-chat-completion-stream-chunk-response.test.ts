import { parseMockResponse } from '../../../test-util/mock-http.js';
import { OrchestrationChatCompletionStreamChunkResponse } from './orchestration-chat-completion-stream-chunk-response.js';

describe('OpenAI chat completion stream chunk response', () => {
  let mockResponses: {
    tokenUsageResponse: any;
    finishReasonResponse: any;
    deltaContentResponse: any;
  };
  let orchestrationChatCompletionStreamChunkResponses: {
    tokenUsageResponse: OrchestrationChatCompletionStreamChunkResponse;
    finishReasonResponse: OrchestrationChatCompletionStreamChunkResponse;
    deltaContentResponse: OrchestrationChatCompletionStreamChunkResponse;
  };

  beforeAll(async () => {
    mockResponses = {
      tokenUsageResponse: await parseMockResponse<any>(
        'orchestration',
        'orchestration-chat-completion-stream-chunk-response-token-usage.json'
      ),
      finishReasonResponse: await parseMockResponse<any>(
        'orchestration',
        'orchestration-chat-completion-stream-chunk-response-finish-reason.json'
      ),
      deltaContentResponse: await parseMockResponse<any>(
        'orchestration',
        'orchestration-chat-completion-stream-chunk-response-delta-content.json'
      )
    };
    orchestrationChatCompletionStreamChunkResponses = {
      tokenUsageResponse: new OrchestrationChatCompletionStreamChunkResponse(
        mockResponses.tokenUsageResponse
      ),
      finishReasonResponse: new OrchestrationChatCompletionStreamChunkResponse(
        mockResponses.finishReasonResponse
      ),
      deltaContentResponse: new OrchestrationChatCompletionStreamChunkResponse(
        mockResponses.deltaContentResponse
      )
    };
  });

  it('should return the chat completion stream chunk response', () => {
    expect(
      orchestrationChatCompletionStreamChunkResponses.tokenUsageResponse.data
    ).toStrictEqual(mockResponses.tokenUsageResponse);
    expect(
      orchestrationChatCompletionStreamChunkResponses.finishReasonResponse.data
    ).toStrictEqual(mockResponses.finishReasonResponse);
    expect(
      orchestrationChatCompletionStreamChunkResponses.deltaContentResponse.data
    ).toStrictEqual(mockResponses.deltaContentResponse);
  });

  it('should get token usage', () => {
    expect(
      orchestrationChatCompletionStreamChunkResponses.tokenUsageResponse.getTokenUsage()
    ).toMatchObject({
      completion_tokens: expect.any(Number),
      prompt_tokens: expect.any(Number),
      total_tokens: expect.any(Number)
    });
  });

  it('should return finish reason', () => {
    expect(
      orchestrationChatCompletionStreamChunkResponses.finishReasonResponse.getFinishReason()
    ).toBe('stop');
  });

  it('should return delta content with default index 0', () => {
    expect(
      orchestrationChatCompletionStreamChunkResponses.deltaContentResponse.getDeltaContent()
    ).toMatchInlineSnapshot(
      '"rimarily focusing on Java and JavaScript/Node.js environments, allowing developers to work in their "'
    );
  });
});
