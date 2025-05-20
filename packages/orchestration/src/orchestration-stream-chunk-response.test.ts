import { parseMockResponse } from '../../../test-util/mock-http.js';
import { OrchestrationStreamChunkResponse } from './orchestration-stream-chunk-response.js';

describe('Orchestration chat completion stream chunk response', () => {
  let mockResponses: {
    tokenUsageAndFinishReasonResponse: any;
    deltaContentResponse: any;
    toolCallResponse: any;
  };
  let orchestrationStreamChunkResponses: {
    tokenUsageResponse: OrchestrationStreamChunkResponse;
    finishReasonResponse: OrchestrationStreamChunkResponse;
    deltaContentResponse: OrchestrationStreamChunkResponse;
    toolCallResponse: OrchestrationStreamChunkResponse;
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
      ),
      toolCallResponse: await parseMockResponse<any>(
        'orchestration',
        'orchestration-chat-completion-stream-chunk-response-tool-call.json'
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
      ),
      toolCallResponse: new OrchestrationStreamChunkResponse(
        mockResponses.toolCallResponse
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

  it('should return delta tool call chunks with default index 0', () => {
    const toolCallChunks =
      orchestrationStreamChunkResponses.toolCallResponse.getDeltaToolCallChunks();

    expect(toolCallChunks).toBeDefined();
    expect(toolCallChunks).toHaveLength(1);
    expect(toolCallChunks?.[0]).toEqual({
      index: 0,
      function: {
        arguments: '20'
      }
    });
  });

  it('should find choice by valid index', () => {
    const choice =
      orchestrationStreamChunkResponses.toolCallResponse.findChoiceByIndex(0);

    expect(choice).toBeDefined();
    expect(choice?.index).toBe(0);
    expect(choice?.delta?.role).toEqual('assistant');
    expect(choice?.delta.content).toEqual(
      'rimarily focusing on Java and JavaScript/Node.js environments, allowing developers to work in their '
    );
    expect(choice?.delta.tool_calls).toEqual([
      { index: 0, function: { arguments: '20' } }
    ]);
  });
});
