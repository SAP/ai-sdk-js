import { parseMockResponse } from '../../../../test-util/mock-http.js';
import { AzureOpenAiChatCompletionStreamChunkResponse } from './azure-openai-chat-completion-stream-chunk-response.js';

describe('OpenAI chat completion stream chunk response', () => {
  let mockResponses: {
    tokenUsage: any;
    finishReason: any;
    deltaContent: any;
  };
  let azureOpenAiChatCompletionStreamChunkResponses: {
    tokenUsage: AzureOpenAiChatCompletionStreamChunkResponse;
    finishReason: AzureOpenAiChatCompletionStreamChunkResponse;
    deltaContent: AzureOpenAiChatCompletionStreamChunkResponse;
  };

  beforeAll(async () => {
    mockResponses = {
      tokenUsage: await parseMockResponse<any>(
        'foundation-models',
        'azure-openai-chat-completion-stream-chunk-response-token-usage.json'
      ),
      finishReason: await parseMockResponse<any>(
        'foundation-models',
        'azure-openai-chat-completion-stream-chunk-response-finish-reason.json'
      ),
      deltaContent: await parseMockResponse<any>(
        'foundation-models',
        'azure-openai-chat-completion-stream-chunk-response-delta-content.json'
      )
    };
    azureOpenAiChatCompletionStreamChunkResponses = {
      tokenUsage: new AzureOpenAiChatCompletionStreamChunkResponse(
        mockResponses.tokenUsage
      ),
      finishReason: new AzureOpenAiChatCompletionStreamChunkResponse(
        mockResponses.finishReason
      ),
      deltaContent: new AzureOpenAiChatCompletionStreamChunkResponse(
        mockResponses.deltaContent
      )
    };
  });

  it('should return the chat completion stream chunk response', () => {
    expect(
      azureOpenAiChatCompletionStreamChunkResponses.tokenUsage.data
    ).toStrictEqual(mockResponses.tokenUsage);
    expect(
      azureOpenAiChatCompletionStreamChunkResponses.finishReason.data
    ).toStrictEqual(mockResponses.finishReason);
    expect(
      azureOpenAiChatCompletionStreamChunkResponses.deltaContent.data
    ).toStrictEqual(mockResponses.deltaContent);
  });

  it('should get token usage', () => {
    expect(
      azureOpenAiChatCompletionStreamChunkResponses.tokenUsage.getTokenUsage()
    ).toMatchObject({
      completion_tokens: expect.any(Number),
      prompt_tokens: expect.any(Number),
      total_tokens: expect.any(Number)
    });
  });

  it('should return finish reason', () => {
    expect(
      azureOpenAiChatCompletionStreamChunkResponses.finishReason.getFinishReason()
    ).toBe('stop');
  });

  it('should return delta content with default index 0', () => {
    expect(
      azureOpenAiChatCompletionStreamChunkResponses.deltaContent.getDeltaContent()
    ).toBe(' is');
  });
});
