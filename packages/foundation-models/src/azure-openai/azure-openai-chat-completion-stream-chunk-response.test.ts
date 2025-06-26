import { parseMockResponse } from '../../../../test-util/mock-http.js';
import { AzureOpenAiChatCompletionStreamChunkResponse } from './azure-openai-chat-completion-stream-chunk-response.js';
import type { AzureOpenAiCreateChatCompletionStreamResponse } from './client/inference/schema/index.js';

describe('OpenAI chat completion stream chunk response', () => {
  let mockResponses: {
    tokenUsageResponse: AzureOpenAiCreateChatCompletionStreamResponse;
    finishReasonResponse: AzureOpenAiCreateChatCompletionStreamResponse;
    deltaContentResponse: AzureOpenAiCreateChatCompletionStreamResponse;
    toolCallsResponse: AzureOpenAiCreateChatCompletionStreamResponse;
  };
  let azureOpenAiChatCompletionStreamChunkResponses: {
    tokenUsageResponse: AzureOpenAiChatCompletionStreamChunkResponse;
    finishReasonResponse: AzureOpenAiChatCompletionStreamChunkResponse;
    deltaContentResponse: AzureOpenAiChatCompletionStreamChunkResponse;
    toolCallsResponse: AzureOpenAiChatCompletionStreamChunkResponse;
  };

  beforeAll(async () => {
    mockResponses = {
      tokenUsageResponse:
        await parseMockResponse<AzureOpenAiCreateChatCompletionStreamResponse>(
          'foundation-models',
          'azure-openai-chat-completion-stream-chunk-response-token-usage.json'
        ),
      finishReasonResponse:
        await parseMockResponse<AzureOpenAiCreateChatCompletionStreamResponse>(
          'foundation-models',
          'azure-openai-chat-completion-stream-chunk-response-finish-reason.json'
        ),
      deltaContentResponse:
        await parseMockResponse<AzureOpenAiCreateChatCompletionStreamResponse>(
          'foundation-models',
          'azure-openai-chat-completion-stream-chunk-response-delta-content.json'
        ),
      toolCallsResponse:
        await parseMockResponse<AzureOpenAiCreateChatCompletionStreamResponse>(
          'foundation-models',
          'azure-openai-chat-completion-stream-chunk-response-tool-calls.json'
        )
    };
    azureOpenAiChatCompletionStreamChunkResponses = {
      tokenUsageResponse: new AzureOpenAiChatCompletionStreamChunkResponse(
        mockResponses.tokenUsageResponse
      ),
      finishReasonResponse: new AzureOpenAiChatCompletionStreamChunkResponse(
        mockResponses.finishReasonResponse
      ),
      deltaContentResponse: new AzureOpenAiChatCompletionStreamChunkResponse(
        mockResponses.deltaContentResponse
      ),
      toolCallsResponse: new AzureOpenAiChatCompletionStreamChunkResponse(
        mockResponses.toolCallsResponse
      )
    };
  });

  it('should return the chat completion stream chunk response', () => {
    expect(
      azureOpenAiChatCompletionStreamChunkResponses.tokenUsageResponse.data
    ).toStrictEqual(mockResponses.tokenUsageResponse);
    expect(
      azureOpenAiChatCompletionStreamChunkResponses.finishReasonResponse.data
    ).toStrictEqual(mockResponses.finishReasonResponse);
    expect(
      azureOpenAiChatCompletionStreamChunkResponses.deltaContentResponse.data
    ).toStrictEqual(mockResponses.deltaContentResponse);
  });

  it('should get token usage', () => {
    expect(
      azureOpenAiChatCompletionStreamChunkResponses.tokenUsageResponse.getTokenUsage()
    ).toMatchObject({
      completion_tokens: expect.any(Number),
      prompt_tokens: expect.any(Number),
      total_tokens: expect.any(Number)
    });
  });

  it('should return finish reason', () => {
    expect(
      azureOpenAiChatCompletionStreamChunkResponses.finishReasonResponse.getFinishReason()
    ).toBe('stop');
  });

  it('should return delta content with default index 0', () => {
    expect(
      azureOpenAiChatCompletionStreamChunkResponses.deltaContentResponse.getDeltaContent()
    ).toBe(' is');
  });

  it('should get delta tool calls with default index 0', () => {
    expect(
      azureOpenAiChatCompletionStreamChunkResponses.toolCallsResponse.getDeltaToolCalls()
    ).toEqual([{ function: { arguments: '{"' }, index: 0 }]);
  });

  it('should find choice by index', () => {
    const choiceIndex = 0;
    const choice =
      azureOpenAiChatCompletionStreamChunkResponses.deltaContentResponse.findChoiceByIndex(
        choiceIndex
      );
    expect(choice?.index).toBe(choiceIndex);
  });
});
