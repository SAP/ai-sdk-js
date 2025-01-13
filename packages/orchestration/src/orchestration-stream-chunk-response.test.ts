import { parseMockResponse } from '../../../test-util/mock-http.js';
import { OrchestrationStreamChunkResponse } from './orchestration-stream-chunk-response.js';

describe('Orchestration chat completion stream chunk response', () => {
  let mockResponses: {
    tokenUsageAndFinishReasonResponse: any;
    deltaContentResponse: any;
  };
  let orchestrationStreamChunkResponses: {
    tokenUsageResponse: OrchestrationStreamChunkResponse;
    finishReasonResponse: OrchestrationStreamChunkResponse;
    deltaContentResponse: OrchestrationStreamChunkResponse;
  };

  beforeAll(async () => {
    mockResponses = {
      tokenUsageAndFinishReasonResponse: await parseMockResponse<any>(
        'orchestration',
        'orchestration-chat-completion-stream-chunk-response-token-usage-and-finish-reason.json'
      ),
      deltaContentResponse: await parseMockResponse<any>(
        'orchestration',
        'orchestration-chat-completion-stream-chunk-response-delta-content.json'
      )
    };
    orchestrationStreamChunkResponses = {
      tokenUsageResponse: new OrchestrationStreamChunkResponse(
        mockResponses.tokenUsageAndFinishReasonResponse
      ),
      finishReasonResponse: new OrchestrationStreamChunkResponse(
        mockResponses.tokenUsageAndFinishReasonResponse
      ),
      deltaContentResponse: new OrchestrationStreamChunkResponse(
        mockResponses.deltaContentResponse
      )
    };
  });

  it('should return the chat completion stream chunk response', () => {
    expect(
      orchestrationStreamChunkResponses.tokenUsageResponse.data
    ).toStrictEqual(mockResponses.tokenUsageAndFinishReasonResponse);
    expect(
      orchestrationStreamChunkResponses.finishReasonResponse.data
    ).toStrictEqual(mockResponses.tokenUsageAndFinishReasonResponse);
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
