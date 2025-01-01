import { parseMockResponse } from '../../../test-util/mock-http.js';
import { OrchestrationStreamChunkResponse } from './orchestration-stream-chunk-response.js';

describe('Orchestration chat completion stream chunk response', () => {
  let mockResponses: {
    tokenUsageResponse: any;
    finishReasonResponse: any;
    deltaContentResponse: any;
  };
  let orchestrationStreamChunkResponses: {
    tokenUsageResponse: OrchestrationStreamChunkResponse;
    finishReasonResponse: OrchestrationStreamChunkResponse;
    deltaContentResponse: OrchestrationStreamChunkResponse;
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
    orchestrationStreamChunkResponses = {
      tokenUsageResponse: new OrchestrationStreamChunkResponse(
        mockResponses.tokenUsageResponse
      ),
      finishReasonResponse: new OrchestrationStreamChunkResponse(
        mockResponses.finishReasonResponse
      ),
      deltaContentResponse: new OrchestrationStreamChunkResponse(
        mockResponses.deltaContentResponse
      )
    };
  });

  it('should return the chat completion stream chunk response', () => {
    expect(
      orchestrationStreamChunkResponses.tokenUsageResponse.data
    ).toStrictEqual(mockResponses.tokenUsageResponse);
    expect(
      orchestrationStreamChunkResponses.finishReasonResponse.data
    ).toStrictEqual(mockResponses.finishReasonResponse);
    expect(
      orchestrationStreamChunkResponses.deltaContentResponse.data
    ).toStrictEqual(mockResponses.deltaContentResponse);
  });

  it('should get token usage', () => {
    expect(
      orchestrationStreamChunkResponses.tokenUsageResponse.getTokenUsage()
    ).toMatchObject({
      completion_tokens: expect.any(Number),
      prompt_tokens: expect.any(Number),
      total_tokens: expect.any(Number)
    });
  });

  it('should return finish reason', () => {
    expect(
      orchestrationStreamChunkResponses.finishReasonResponse.getFinishReason()
    ).toBe('stop');
  });

  it('should return delta content with default index 0', () => {
    expect(
      orchestrationStreamChunkResponses.deltaContentResponse.getDeltaContent()
    ).toMatchInlineSnapshot(
      '"rimarily focusing on Java and JavaScript/Node.js environments, allowing developers to work in their "'
    );
  });
});
